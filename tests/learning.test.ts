import { describe, it, expect } from 'vitest';
import { lessons, allTasks } from '../src/content';
import { initialLearningState, transition, evaluate } from '../src/learning';
import { recordLearningEvent, freshProgress, parseProgress, normalize } from '../src/engine';
import { englishVoices, preferredVoice, readVoicePreference, saveVoicePreference, VOICE_KEY } from '../src/voices';
const task = lessons[1].tasks[1];
const right = task.answers![0];
const at = new Date('2026-10-30T12:00:00Z');
describe('explicit correction machine', () => {
    it('shows hints after each miss and reteaches after exactly three failures', () => { let s = initialLearningState(); for (let i = 1; i <= 3; i++) {
        s = transition(s, { type: 'answer', answer: 'wrong' }, task, at);
        expect(s.failures).toBe(i);
        expect(s.history).toHaveLength(i);
        expect(s.stage).toBe(i === 3 ? 'RETEACH' : 'INITIAL_ATTEMPTS');
    } expect(s.feedback).toContain('review the structure'); });
    it('requires three consecutive correct answers after reteaching', () => { let s = transition(initialLearningState(), { type: 'beginMastery' }, task, at); s = transition(s, { type: 'answer', answer: right }, task, at); expect(s.streak).toBe(1); expect(s.answer).toBe(''); s = transition(s, { type: 'answer', answer: right }, task, at); expect(s.streak).toBe(2); s = transition(s, { type: 'answer', answer: 'wrong' }, task, at); expect(s.streak).toBe(0); for (let i = 0; i < 3; i++)
        s = transition(s, { type: 'answer', answer: right }, task, at); expect(s.streak).toBe(3); expect(s.stage).toBe('TRANSFER'); expect(s.masteredAt).toBe(at.toISOString()); });
    it('resets a mastery streak when solution transcript translation or hint is consulted', () => { for (const type of ['explanation', 'hint', 'transcript', 'translation'] as const) {
        let s = transition(initialLearningState(), { type: 'beginMastery' }, task, at);
        s = transition(s, { type: 'answer', answer: right }, task, at);
        s = transition(s, { type }, task, at);
        expect(s.streak).toBe(0);
        expect(s.hints[0].kind).toBe(type);
    } });
    it('moves an initial correct answer to transfer without claiming mastery', () => { const s = transition(initialLearningState(), { type: 'answer', answer: right }, task, at); expect(s.stage).toBe('TRANSFER'); expect(s.masteredAt).toBeUndefined(); expect(s.streak).toBe(0); });
    it('accepts transfer, schedules future review, and preserves the full state after export', () => { let p = freshProgress(at); p = recordLearningEvent(p, task, { type: 'answer', answer: right }, at); p = recordLearningEvent(p, task, { type: 'answer', answer: task.transfer!.answers![0] }, at); expect(p.exerciseStates[task.id].stage).toBe('REVIEW'); expect(p.attempts).toHaveLength(2); expect(p.reviews[task.id].due).toBe('2026-10-31T12:00:00.000Z'); expect(parseProgress(JSON.stringify(p))).toEqual(p); });
    it('can defer from any stage without a mastery claim and allows continuing later', () => { const p = recordLearningEvent(freshProgress(at), task, { type: 'defer' }, at); expect(p.exerciseStates[task.id].deferred).toBe(true); expect(p.exerciseStates[task.id].masteredAt).toBeUndefined(); expect(p.reviews[task.id].due).toBe('2026-10-31T12:00:00.000Z'); });
    it('keeps mastery pending after a transfer mistake', () => { let s = transition(initialLearningState(), { type: 'answer', answer: right }, task, at); s = transition(s, { type: 'answer', answer: 'wrong' }, task, at); expect(s.stage).toBe('TRANSFER'); expect(s.history.at(-1)?.correct).toBe(false); });
    it('accepts verified equivalents, identifies known grammar errors, and admits uncertainty', () => { const rewrite = lessons[0].tasks[4]; expect(evaluate(rewrite, 'She coordinates the team of software engineers.')).toBe(true); expect(evaluate(rewrite, 'She coordinate the software team.')).toBe(false); expect(evaluate(rewrite, 'She manages our design group.')).toBeNull(); expect(normalize('my job need it')).not.toBe(normalize('my job needs it')); expect(normalize('work')).not.toBe(normalize('working')); });
    it('includes distinct transfer tasks and Spanish audio translations throughout the course', () => { for (const t of allTasks.filter(t => t.kind !== 'free')) {
        expect(t.transfer).toBeDefined();
        expect(t.transfer!.prompt).not.toBe(t.prompt);
        expect(evaluate(t.transfer!, t.transfer!.answers![0])).toBe(true);
    } for (const l of lessons)
        expect(l.tasks[0].translation!.length).toBeGreaterThan(30); });
    it('migrates older version-1 exports without losing earlier work', () => { const p = freshProgress(at) as unknown as Record<string, unknown>; delete p.exerciseStates; delete p.reviewIntervals; const restored = parseProgress(JSON.stringify(p)); expect(restored.exerciseStates).toEqual({}); expect(restored.reviewIntervals).toEqual([1, 3, 7]); });
    it('rejects tampered streak state and review intervals', () => { const p = freshProgress(at); expect(() => parseProgress(JSON.stringify({ ...p, exerciseStates: { q: { ...initialLearningState(), streak: 9 } } }))).toThrow(); expect(() => parseProgress(JSON.stringify({ ...p, reviewIntervals: [-1, 3, 7] }))).toThrow(); });
});
const voice = (name: string, lang: string, isDefault = false) => ({ name, lang, voiceURI: name + '-' + lang, default: isDefault });
describe('simple browser voice preference', () => {
    it('prioritizes en-US natural voice hints over default robotic or other-language voices', () => { const voices = [voice('System default', 'en-US', true), voice('Natural UK', 'en-GB'), voice('Jenny Natural', 'en-US'), voice('Español', 'es-MX')]; expect(englishVoices(voices).map(v => v.name)).toEqual(['Jenny Natural', 'System default', 'Natural UK']); expect(preferredVoice(voices, '')?.name).toBe('Jenny Natural'); });
    it('respects a saved available voice and gracefully falls back if absent', () => { const voices = [voice('Samantha', 'en-US'), voice('Daniel', 'en-GB')]; expect(preferredVoice(voices, voices[1].voiceURI)?.name).toBe('Daniel'); expect(preferredVoice(voices, 'missing')?.name).toBe('Samantha'); expect(preferredVoice([], '')).toBeUndefined(); });
    it('stores voice selection in localStorage and reports denied persistence', () => { const values = new Map<string, string>(); const storage = { getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => { values.set(k, v); } }; expect(saveVoicePreference('voice-id', storage)).toBe(true); expect(values.get(VOICE_KEY)).toBe('voice-id'); expect(readVoicePreference(storage)).toBe('voice-id'); expect(saveVoicePreference('voice-id', { setItem: () => { throw new Error('denied'); } })).toBe(false); expect(readVoicePreference({ getItem: () => { throw new Error('denied'); } })).toBe(''); });
});
