import type { Task } from './types';
// Editorially selected noun substitutions preserve verb morphology and number.
const replacements: [
    RegExp,
    string
][] = [[/design team/gi, 'UX team'], [/designs/gi, 'wireframes'], [/designers/gi, 'researchers'], [/designer/gi, 'researcher'], [/design/gi, 'prototype'], [/report/gi, 'brief'], [/summary/gi, 'overview'], [/figures/gi, 'estimates'], [/budget/gi, 'funding'], [/approval/gi, 'confirmation'], [/security/gi, 'architecture'], [/review/gi, 'assessment'], [/launch/gi, 'rollout'], [/release/gi, 'delivery'], [/prototype/gi, 'mockup'], [/plan/gi, 'schedule'], [/issue/gi, 'blocker'], [/problem/gi, 'defect'], [/chart/gi, 'diagram'], [/screen/gi, 'page'], [/feature/gi, 'function'], [/Monday/gi, 'Tuesday'], [/Friday/gi, 'Thursday'], [/yesterday/gi, 'last week'], [/tomorrow/gi, 'next week'], [/goal/gi, 'objective'], [/risks/gi, 'constraints'], [/risk/gi, 'constraint'], [/notes/gi, 'minutes'], [/walk/gi, 'short run'], [/dependency/gi, 'prerequisite'], [/three months/gi, 'six weeks'], [/that/gi, 'the last point'], [/jump in/gi, 'interrupt'], [/clarify/gi, 'explain the next step'], [/success/gi, 'a good outcome']];
export function vary(text: string): string { let result = text; for (const [pattern, replacement] of replacements)
    result = result.replace(pattern, replacement); return result; }
export function withTransfer(t: Task): Task {
    if (t.kind === 'free')
        return t;
    const changed = vary(t.prompt);
    const alternatives = t.kind === 'rewrite' ? verifiedAlternatives(t.model) : [];
    return { ...t, answers: [...(t.answers ?? []), ...alternatives], transfer: { ...t, id: t.id + '-transfer', prompt: `Transfer · Project Orion UX team: ${changed === t.prompt ? 'In the next planning conversation, ' : ''}${changed}`, audio: t.audio ? `In the UX planning conversation: ${vary(t.audio)}` : undefined, translation: undefined, options: t.options?.map(vary), answers: [...(t.answers ?? []).map(vary), ...alternatives.map(vary)], model: vary(t.model), errorExample: t.errorExample ? vary(t.errorExample) : undefined, explanation: `Use the same structure with the new details. ${t.explanation}` } };
}
export function verifiedAlternatives(model: string): string[] {
    const alternatives = [];
    if (model.includes('need to'))
        alternatives.push(model.replace('need to', 'have to'));
    if (model.includes('needs to'))
        alternatives.push(model.replace('needs to', 'has to'));
    if (model.includes('Could you repeat that?'))
        alternatives.push('Could you say that again?');
    if (model.includes('Could you review the summary?'))
        alternatives.push('Could you check the summary?');
    if (model.includes('Please open the report we discussed.'))
        alternatives.push('Please open the report that we discussed.');
    if (model.includes('I am working on the launch plan.'))
        alternatives.push("I'm working on the launch plan.");
    if (model.includes('We need two more days for the checked version.'))
        alternatives.push('We need another two days for the checked version.');
    if (model.includes('She coordinates the design team.'))
        alternatives.push('She coordinates the team of designers.');
    if (model.includes('I proposed a smaller release.'))
        alternatives.push('I suggested a smaller release.');
    if (model.includes('The team needs to decide.'))
        alternatives.push('The team has to decide.');
    if (model.includes('I will take the notes.'))
        alternatives.push("I'll take the notes.");
    return alternatives;
}
