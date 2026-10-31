import type { LearningState, LearningEvent, Task } from './types';
import {grade} from './grading';
export function initialLearningState(): LearningState { return { stage: 'INITIAL_ATTEMPTS', failures: 0, streak: 0, answer: '', feedback: 'Try from memory. Up to three initial attempts; you can pause at any time.', uncertain: false, deferred: false, history: [], hints: [] }; }
export {grade as evaluate} from './grading';
export function transition(state: LearningState, event: LearningEvent, task: Task, now = new Date()): LearningState {
    const at = now.toISOString();
    if(event.type==='answer'&&!event.answer.trim())return state;
    if (event.type === 'restart')
        return { ...initialLearningState(), history: state.history, hints: state.hints };
    if (event.type === 'defer')
        return { ...state, deferred: true, feedback: 'Saved for tomorrow. You can continue the course. This exercise is not marked mastered.' };
    if (event.type === 'beginMastery')
        return { ...state, stage: 'MASTERY', streak: 0, answer: '', feedback: 'The solution is hidden. Retrieve the answer three times in a row. Each try starts empty.', uncertain: false };
    if (['hint', 'explanation', 'transcript', 'translation'].includes(event.type)) {
        const kind = event.type as 'hint' | 'explanation' | 'transcript' | 'translation';
        const revealing = state.stage === 'MASTERY';
        return { ...state, answer:kind==='explanation'?'':state.answer, stage: kind === 'explanation' && state.stage === 'INITIAL_ATTEMPTS' ? 'RETEACH' : state.stage, streak: revealing ? 0 : state.streak, hints: [...state.hints, { at, kind }].slice(-500), feedback: revealing ? 'Help opened: retrieval streak reset to 0/3. Close the help and try again.' : state.feedback };
    }
    if (event.type !== 'answer' || state.stage === 'RETEACH' || state.stage === 'REVIEW')
        return state;
    const active = state.stage === 'TRANSFER' ? (task.transfer ?? task) : task;
    const correct = grade(active, event.answer);
    const next = { ...state, answer: event.answer, uncertain: correct === null, deferred: false, history: [...state.history, { answer: event.answer, correct, at, stage: state.stage }].slice(-500) };
    if (correct === null)
        return { ...next, streak:state.stage==='MASTERY'?0:state.streak, feedback: 'I cannot verify this alternative offline. It may be valid. Compare the rubric or ask a tutor; it is not counted as an error or mastery.' };
    if (state.stage === 'TRANSFER')
        return { ...next, stage: correct ? 'REVIEW' : 'TRANSFER', feedback: correct ? 'Transfer accepted. You used the structure in a different context. Review is scheduled.' : `Check the new context. ${active.errorFocus ?? active.explanation} Try again, ask for help, or review later.` };
    if (state.stage === 'MASTERY') {
        const streak = correct ? state.streak + 1 : 0;
        return { ...next, streak, stage: streak === 3 ? 'TRANSFER' : 'MASTERY', masteredAt: streak === 3 ? at : state.masteredAt, answer: correct ? '' : event.answer, feedback: streak === 3 ? '3/3 consecutive correct answers. Now transfer the structure to a new context.' : correct ? `${streak}/3 — retrieved correctly. Try again from an empty answer.` : `Streak reset to 0/3. Check ${task.topic.toLowerCase()}; identify the subject and the time. You can reopen the explanation.` };
    }
    if (correct)
        return { ...next, stage: 'TRANSFER', answer: '', feedback: 'Correct on retrieval. Now try a different context. A three-answer mastery streak has not been claimed.' };
    const failures = state.failures + 1;
    return { ...next, failures, stage: failures >= 3 ? 'RETEACH' : 'INITIAL_ATTEMPTS', feedback: failures === 1 ? `Check the error category: ${task.topic}. Focus on the time and subject.` : failures === 2 ? `Look at this structure: ${task.errorFocus ?? task.explanation}` : 'Three tries are useful evidence. Let us review the structure together, then retrieve it again.' };
}
