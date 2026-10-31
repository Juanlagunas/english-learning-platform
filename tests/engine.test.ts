import { describe, it, expect } from 'vitest';
import { freshProgress, grade, normalize, nextReview, recordAttempt, parseProgress, loadProgress, saveProgress, weeklyStats, streak, weakTopics, tutorSummary, STORAGE_KEY } from '../src/engine';
import { lessons, allTasks, assessmentTasks } from '../src/content';
import { connectors } from '../src/connectors';
const now = new Date('2026-10-30T12:00:00Z');
describe('curriculum contract', () => {
    it('delivers 60 distinct complete sessions and 5 per week', () => {
        expect(lessons).toHaveLength(60);
        expect(new Set(lessons.map(l => l.title)).size).toBe(60);
        expect(new Set(allTasks.map(t => t.id)).size).toBe(allTasks.length);
        expect(new Set(lessons.map(l => l.tasks[0].audio)).size).toBe(60);
        for (let w = 1; w <= 12; w++)
            expect(lessons.filter(l => l.week === w)).toHaveLength(5);
        for (const l of lessons) {
            expect(l.objective.length).toBeGreaterThan(20);
            expect(l.tasks.filter(t => t.kind === 'listen').length).toBeGreaterThanOrEqual(1);
            expect(l.tasks.filter(t => t.kind !== 'listen')).toHaveLength(5);
            expect(l.spoken.length).toBeGreaterThan(30);
            expect(l.review.length).toBeGreaterThan(20);
            for (const t of l.tasks) {
                expect(t.model.length).toBeGreaterThan(4);
                expect(t.explanation.length).toBeGreaterThan(20);
                if (t.kind !== 'free') {
                    expect(t.answers?.length).toBeGreaterThan(0);
                    expect(grade(t, t.answers![0])).toBe(true);
                    expect(grade(t,'unrelated incorrect text')).toBe(t.kind==='rewrite'?null:false);
                }
                else {
                    expect(t.rubric).toHaveLength(3);
                    expect(grade(t, 'anything')).toBeNull();
                }
            }
        }
    });
    it('offers all 17 connectors with active lesson practice', () => {
        expect(connectors).toHaveLength(17);
        for (const c of connectors) {
            expect(c.spanish.length).toBeGreaterThan(0);
            expect(c.contrast.length).toBeGreaterThan(20);
            expect(allTasks.some(t => t.kind === 'connector' && t.answers?.includes(c.word))).toBe(true);
        }
    });
    it('includes listening writing and grammar in all seven assessments', () => {
        for (let i = 0; i <= 6; i++) {
            const tasks = assessmentTasks(i);
            expect(tasks).toHaveLength(6);
            expect(tasks.filter(t => t.kind === 'listen')).toHaveLength(2);
            expect(tasks.filter(t => t.kind === 'free')).toHaveLength(1);
            expect(new Set(tasks.map(t => t.id)).size).toBe(6);
        }
        expect(assessmentTasks(6)[1].audio).toBe(lessons[59].tasks[0].audio);
    });
});
describe('grading', () => {
    it('accepts case punctuation spacing and common contraction variants', () => { expect(normalize(' I’m READY! ')).toBe('i am ready'); expect(normalize("We can't start.")).toBe(normalize('We cannot start')); expect(grade(lessons[0].tasks[4], 'she COORDINATES the design team!')).toBe(true); });
    it('does not equate a wrong auxiliary or tense', () => { expect(grade(lessons[1].tasks[4], 'He need a clear plan.')).toBe(false); expect(grade(lessons[11].tasks[1], 'approved')).toBe(false); });
});
describe('review scheduler', () => {
    it('moves success through 1, 3, 7, 14 and 30 days and resets mistakes', () => {
        let review = nextReview('q', false, undefined, now);
        expect(review.box).toBe(0);
        expect(review.due).toBe(new Date(now.getTime() + 86400000).toISOString());
        for (const days of [1, 3, 7, 14, 30, 30]) {
            review = nextReview('q', true, review, now);
            expect(new Date(review.due).getTime() - now.getTime()).toBe(days * 86400000);
        }
        expect(nextReview('q', false, review, now).box).toBe(0);
    });
    it('records mistakes separately from self-assessed open answers', () => { let p = recordAttempt(freshProgress(now), lessons[0].tasks[1], 'wrong', undefined, now); p = recordAttempt(p, lessons[0].tasks[5], 'My response.', true, now); expect(p.attempts[0].correct).toBe(false); expect(p.attempts[1].correct).toBeNull(); expect(p.reviews[lessons[0].tasks[5].id].box).toBe(1); expect(weakTopics(p)[0][1]).toBe(1); expect(p.completed).toEqual({}); });
});
describe('portable persistence', () => {
    it('round trips completions attempts answers and review schedule through storage', () => { let value: string | null = null; const storage = { getItem: (k: string) => k === STORAGE_KEY ? value : null, setItem: (_k: string, v: string) => { value = v; } }; const p = recordAttempt(freshProgress(now), lessons[0].tasks[1], 'coordinate', undefined, now); p.completed.s01 = { at: now.toISOString(), seconds: 902, correct: 5, total: 5 }; p.practice.push({ at: now.toISOString(), seconds: 902 }); saveProgress(p, storage); expect(loadProgress(storage).progress).toEqual(p); expect(parseProgress(JSON.stringify(p))).toEqual(p); });
    it('rejects bad versions malformed nested data and excessive files', () => { const p = freshProgress(now); expect(() => parseProgress(JSON.stringify({ ...p, version: 2 }))).toThrow(); expect(() => parseProgress(JSON.stringify({ ...p, reviews: { q: { box: 9, due: 'tomorrow' } } }))).toThrow(); expect(() => parseProgress(JSON.stringify({ ...p, practice: [{ at: now.toISOString(), seconds: -3 }] }))).toThrow(); expect(() => parseProgress(JSON.stringify({ ...p, completed: { s01: { at: now.toISOString(), seconds: 2, correct: 7, total: 5 } } }))).toThrow(); expect(() => parseProgress('x'.repeat(8000001))).toThrow(); });
    it('reports corrupt or denied storage without asserting persistence', () => { expect(loadProgress({ getItem: () => '{broken' }).error).toBeTruthy(); expect(loadProgress({ getItem: () => { throw new Error('denied'); } }).error).toBeTruthy(); expect(() => saveProgress(freshProgress(), { setItem: () => { throw new Error('full'); } })).toThrow(); });
});
describe('honest practice metrics', () => {
    it('counts measured seconds and requires 15 minutes for a weekly goal day', () => { const p = freshProgress(now); p.practice = [{ at: now.toISOString(), seconds: 30 }]; expect(weeklyStats(p, now).days).toBe(0); expect(weeklyStats(p, now).minutes).toBe(0); p.practice.push({ at: now.toISOString(), seconds: 870 }); expect(weeklyStats(p, now).days).toBe(1); expect(weeklyStats(p, now).minutes).toBe(15); });
    it('gives yesterday credit without requiring practice every day', () => { const p = freshProgress(now); const yesterday = new Date(now.getTime() - 86400000); p.practice = [{ at: yesterday.toISOString(), seconds: 60 }]; expect(streak(p, now)).toBe(1); expect(tutorSummary(p)).toContain('1 minutes'); expect(tutorSummary(p)).toContain('not a CEFR'); });
});
