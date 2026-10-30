import type { Progress, Task, Review, Attempt, LearningEvent } from './types';
import { initialLearningState, transition } from './learning';
export const STORAGE_KEY = 'compass-progress-v1';
export function normalize(s: string): string { return s.normalize('NFKC').toLowerCase().replace(/[’‘]/g, "'").replace(/\b(i'm)\b/g, 'i am').replace(/\b(can't)\b/g, 'cannot').replace(/\b(won't)\b/g, 'will not').replace(/\b(don't)\b/g, 'do not').replace(/\b(doesn't)\b/g, 'does not').replace(/\b(didn't)\b/g, 'did not').replace(/[^\p{L}\p{N}'\s]/gu, ' ').replace(/\s+/g, ' ').trim(); }
export function grade(task: Task, answer: string): boolean | null { return task.kind === 'free' ? null : (task.answers ?? []).some(a => normalize(a) === normalize(answer)); }
export function freshProgress(now = new Date()): Progress { return { version: 1, started: now.toISOString(), completed: {}, attempts: [], reviews: {}, assessments: [], practice: [], drafts: {}, mode: 30, exerciseStates: {}, reviewIntervals: [1, 3, 7] }; }
export function nextReview(taskId: string, correct: boolean, previous?: Review, now = new Date(), intervals: readonly number[] = [1, 3, 7]): Review {
    const box = correct ? Math.min((previous?.box ?? 0) + 1, 5) : 0;
    return { taskId, box, due: new Date(now.getTime() + [intervals[0], ...intervals, 14, 30][box] * 86400000).toISOString() };
}
export function recordAttempt(p: Progress, task: Task, answer: string, self?: boolean, now = new Date()): Progress {
    const correct = grade(task, answer);
    const reviewCorrect = correct ?? self ?? false;
    const attempt: Attempt = { taskId: task.id, answer, correct, at: now.toISOString(), topic: task.topic };
    return { ...p, attempts: [...p.attempts, attempt].slice(-10000), reviews: { ...p.reviews, [task.id]: nextReview(task.id, reviewCorrect, p.reviews[task.id], now, p.reviewIntervals) }, exerciseStates: task.kind === 'free' ? { ...p.exerciseStates, [task.id]: { ...initialLearningState(), stage: 'REVIEW', feedback: 'Self-assessment saved. No automatic writing grade.', history: [{ answer, correct: null, at: now.toISOString(), stage: 'REVIEW' }] } } : p.exerciseStates, drafts: { ...p.drafts, [task.id]: answer } };
}
export function recordLearningEvent(p: Progress, task: Task, event: LearningEvent, now = new Date()): Progress {
    const previous = p.exerciseStates[task.id] ?? initialLearningState();
    const state = transition(previous, event, task, now);
    let result = { ...p, exerciseStates: { ...p.exerciseStates, [task.id]: state } };
    if (event.type === 'answer' && state.history.length) {
        const latest = state.history.at(-1)!;
        result = { ...result, attempts: [...p.attempts, { taskId: task.id, answer: event.answer, correct: latest.correct, at: now.toISOString(), topic: task.topic }].slice(-10000), drafts: { ...p.drafts, [task.id]: event.answer } };
    }
    if (event.type === 'answer' && state.history.at(-1)?.correct === false) {
        result = { ...result, reviews: { ...p.reviews, [task.id]: nextReview(task.id, false, p.reviews[task.id], now, p.reviewIntervals) } };
    }
    if (event.type === 'defer' || state.stage === 'REVIEW' && previous.stage !== 'REVIEW') {
        result = { ...result, reviews: { ...p.reviews, [task.id]: nextReview(task.id, event.type !== 'defer', p.reviews[task.id], now, p.reviewIntervals) } };
    }
    return result;
}
const isRecord = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);
const validDate = (x: unknown) => typeof x === 'string' && Number.isFinite(Date.parse(x));
const count = (x: unknown, max = 1e9) => typeof x === 'number' && Number.isFinite(x) && x >= 0 && x <= max;
const string = (x: unknown, max = 10000) => typeof x === 'string' && x.length <= max;
export function parseProgress(raw: string): Progress {
    if (raw.length > 8000000)
        throw new Error('This file is too large (maximum 8 MB).');
    const p: unknown = JSON.parse(raw);
    if (!isRecord(p) || p.version !== 1 || !validDate(p.started) || !isRecord(p.completed) || !isRecord(p.reviews) || !isRecord(p.drafts) || !Array.isArray(p.attempts) || !Array.isArray(p.assessments) || !Array.isArray(p.practice) || typeof p.mode !== 'number' || ![5, 10, 15, 30].includes(p.mode))
        throw new Error('This is not a supported Inglés Lagunas progress file (schema version 1).');
    if (Object.keys(p.completed).some(k => !/^s\d{2}$/.test(k)) || Object.values(p.completed).some(x => !isRecord(x) || !validDate(x.at) || !count(x.seconds) || !count(x.correct, 100) || !count(x.total, 100) || Number(x.correct) > Number(x.total)))
        throw new Error('Invalid session history.');
    if (Object.entries(p.reviews).some(([k, x]) => !isRecord(x) || x.taskId !== k || !validDate(x.due) || !Number.isInteger(x.box) || !count(x.box, 5)))
        throw new Error('Invalid review schedule.');
    if (Object.values(p.drafts).some(x => !string(x)))
        throw new Error('Invalid saved answer.');
    if (p.attempts.length > 10000 || p.attempts.some(x => !isRecord(x) || !string(x.taskId, 120) || !string(x.answer) || ![true, false, null].includes(x.correct as boolean | null) || !validDate(x.at) || !string(x.topic, 300)))
        throw new Error('Invalid answer history.');
    if (p.assessments.some(x => !isRecord(x) || !string(x.id, 100) || !validDate(x.at) || !['listening', 'grammar', 'writing', 'speaking'].every(k => count(x[k], 100))))
        throw new Error('Invalid assessment history.');
    if (p.practice.some(x => !isRecord(x) || !validDate(x.at) || !count(x.seconds)))
        throw new Error('Invalid practice history.');
    // Backward-compatible extension: version-1 exports predating the correction engine remain importable.
    if (p.exerciseStates === undefined)
        p.exerciseStates = {};
    if (p.reviewIntervals === undefined)
        p.reviewIntervals = [1, 3, 7];
    if (!Array.isArray(p.reviewIntervals) || p.reviewIntervals.length !== 3 || p.reviewIntervals.some(x => !Number.isInteger(x) || !count(x, 30) || Number(x) < 1))
        throw new Error('Invalid review intervals.');
    const stages = ['INITIAL_ATTEMPTS', 'RETEACH', 'MASTERY', 'TRANSFER', 'REVIEW'];
    if (!isRecord(p.exerciseStates) || Object.values(p.exerciseStates).some(s => !isRecord(s) || !stages.includes(s.stage as string) || !Number.isInteger(s.failures) || !count(s.failures, 3) || !Number.isInteger(s.streak) || !count(s.streak, 3) || !string(s.answer) || !string(s.feedback) || typeof s.uncertain !== 'boolean' || typeof s.deferred !== 'boolean' || s.masteredAt !== undefined && !validDate(s.masteredAt) || !Array.isArray(s.history) || s.history.length > 500 || s.history.some(h => !isRecord(h) || !string(h.answer) || !validDate(h.at) || !stages.includes(h.stage as string) || ![true, false, null].includes(h.correct as boolean | null)) || !Array.isArray(s.hints) || s.hints.length > 500 || s.hints.some(h => !isRecord(h) || !validDate(h.at) || !['hint', 'explanation', 'transcript', 'translation'].includes(h.kind as string))))
        throw new Error('Invalid correction state or hint history.');
    return p as unknown as Progress;
}
export function loadProgress(storage: Pick<Storage, 'getItem'> = localStorage): {
    progress: Progress;
    error?: string;
} {
    try {
        const raw = storage.getItem(STORAGE_KEY);
        return { progress: raw ? parseProgress(raw) : freshProgress() };
    }
    catch {
        return { progress: freshProgress(), error: 'Saved progress could not be read. It has not been overwritten. Export your current work before closing; import a valid backup to restore saving.' };
    }
}
export function saveProgress(p: Progress, storage: Pick<Storage, 'setItem'> = localStorage): void { storage.setItem(STORAGE_KEY, JSON.stringify(p)); }
export function localDay(date = new Date()): string { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
export function weeklyStats(p: Progress, now = new Date()) {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    const events = p.practice.filter(x => new Date(x.at) >= start);
    const totals = new Map<string, number>();
    for (const e of events) {
        const d = localDay(new Date(e.at));
        totals.set(d, (totals.get(d) ?? 0) + e.seconds);
    }
    return { goalWeekdays: [...totals].filter(([, s]) => s >= 900).map(([d]) => (new Date(d + 'T12:00:00').getDay() + 6) % 7), days: [...totals.values()].filter(s => s >= 900).length, minutes: Math.floor(events.reduce((a, x) => a + x.seconds, 0) / 60) };
}
export function streak(p: Progress, now = new Date()): number {
    const days = new Set(p.practice.filter(x => x.seconds >= 60).map(x => localDay(new Date(x.at))));
    let n = 0;
    const day = new Date(now);
    if (!days.has(localDay(day)))
        day.setDate(day.getDate() - 1);
    while (days.has(localDay(day))) {
        n++;
        day.setDate(day.getDate() - 1);
    }
    return n;
}
export function weakTopics(p: Progress): [
    string,
    number
][] {
    const map = new Map<string, number>();
    for (const a of p.attempts.slice(-200)) {
        if (a.correct === false)
            map.set(a.topic, (map.get(a.topic) ?? 0) + 1);
    }
    return [...map].sort((a, b) => b[1] - a[1]).slice(0, 5);
}
export function tutorSummary(p: Progress): string { return `Inglés Lagunas tutor handoff (fictional Project Orion only)\nCompleted: ${Object.keys(p.completed).length}/60 sessions\nPractice: ${Math.floor(p.practice.reduce((a, x) => a + x.seconds, 0) / 60)} minutes\nRecent error patterns: ${weakTopics(p).map(([t, n]) => `${t} (${n})`).join(', ') || 'No recorded errors yet'}\nLatest assessments: ${p.assessments.slice(-3).map(a => `${a.id}: listening ${a.listening}%, grammar ${a.grammar}%, writing self-score ${a.writing}%, speaking self-score ${a.speaking}%`).join('; ')}\nRecent answers:\n${p.attempts.slice(-8).map(a => `${a.topic}: ${a.answer} [${a.correct === null ? 'self-assessed' : a.correct ? 'matched model' : 'needs review'}]`).join('\n')}\nPlease ask short workplace questions one at a time. Let me answer spontaneously. Correct tense, auxiliaries, prepositions, and collocations; then ask me to retry. These results are practice indicators, not a CEFR certification.`; }
export function correctionPrompt(t: Task, answer: string): string { return `Act as a supportive English tutor for an A2–B1 learner. Use only this fictional Project Orion scenario.\nTask: ${t.prompt}\nMy answer: ${answer}\nModel for comparison: ${t.model}\nGive nuanced feedback on meaning, grammar, natural collocations and clarity. Accept valid alternatives. Explain the top two error patterns briefly, offer a natural correction, and ask one follow-up question. Do not assign a formal CEFR level. Do not request real workplace or personal information.`; }
