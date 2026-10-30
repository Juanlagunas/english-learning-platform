import data from './lesson-data.json';
import { withTransfer } from './transfer';
import { connectors } from './connectors';
import type { Lesson, Task } from './types';
export const weeks = data.weeks;
const rubrics = ['Answer the actual question with a complete sentence.', 'Use the target grammar and a natural work phrase.', 'Add a specific detail, reason, or next step.'];
export const lessons: Lesson[] = data.rows.map((r, i) => {
    const [title, audio, interpretation, cloze, answer, unnatural, rewrite, explanation] = r;
    const id = `s${String(i + 1).padStart(2, '0')}`;
    const week = Math.floor(i / 5) + 1;
    const c = connectors[i % connectors.length];
    const full = cloze.replace('___', answer);
    const tasks: Task[] = [
        { id: `${id}-listen`, kind: 'listen', topic: 'Listening comprehension', prompt: 'Listen first. Which statement matches the conversation?', audio, translation: data.translations[i], options: [interpretation, ...data.distractors[i]].sort((a, b) => ((a.length + i) % 7) - ((b.length + i) % 7)), answers: [interpretation], model: interpretation, explanation: `The conversation says: “${audio}” Focus on the time, action, and condition.`, hint: 'Escucha quién hace qué, cuándo, y si hay una condición.' },
        { id: `${id}-cloze`, kind: 'cloze', topic: weeks[week - 1].focus, prompt: cloze, answers: [answer], model: full, explanation, errorFocus: `Check the subject and the verb form. ${explanation}`, hint: weeks[week - 1].spanish },
        { id: `${id}-reorder`, kind: 'reorder', topic: 'Sentence order', prompt: 'Build a complete sentence from these words.', options: full.replace(/[.?!]$/, '').split(' ').reverse(), answers: [full], model: full, explanation: `Say the subject before the verb in this statement. ${explanation}`, hint: 'Empieza por el sujeto o el marcador de tiempo. Conserva todas las palabras.' },
        { id: `${id}-connector`, kind: 'connector', topic: `Connector: ${c.word}`, prompt: `${c.before} ___ ${c.after} (${c.meaning})`, options: [c.word, ...connectors.filter(x => x.word !== c.word).filter(x => x.meaning !== c.meaning).slice((i % 5), i % 5 + 2).map(x => x.word)].sort(), answers: [c.word], model: c.example, explanation: `${c.usage} ${c.contrast}`, hint: `${c.word}: ${c.spanish}` },
        { id: `${id}-rewrite`, kind: 'rewrite', topic: weeks[week - 1].focus, prompt: `Rewrite this sentence naturally: “${unnatural}”`, answers: [rewrite], errorExample: unnatural, errorFocus: explanation, model: rewrite, explanation: `${explanation} This exercise checks the target model; other natural rewrites may also exist.`, hint: 'Corrige la estructura; conserva el significado y las palabras que ya funcionan.' },
        { id: `${id}-free`, kind: 'free', topic: 'Writing', prompt: `Project Orion roleplay: ${audio.split('?')[0]}${audio.includes('?') ? '?' : ''} Write your own 2–3 sentence answer. Change at least one detail and add a reason or next step.`, model: `${audio.slice(audio.indexOf('?') + 1).trim()} Next, I will confirm the plan with the team.`, explanation: `Compare meaning, grammar, and clarity with the model. ${explanation} Your answer can be different and still work.`, hint: weeks[week - 1].spanish, rubric: [rubrics[0], `Use this target: ${explanation}`, rubrics[2]] }
    ];
    return { id, week, day: i % 5 + 1, title, objective: `${title} using ${weeks[week - 1].focus.toLowerCase()}.`, explanation, spanish: weeks[week - 1].spanish, tasks: tasks.map(withTransfer), spoken: `Without reading a script, answer: ${audio.split('?')[0]}${audio.includes('?') ? '?' : ''} Speak for 30–60 seconds. Give one fact, one reason, and a next step.`, spokenModel: `${rewrite} ${full}`, review: `From memory, say one useful sentence from “${title}”. Then explain when to use ${c.word}.` };
});
export const allTasks = [...lessons.flatMap(l => l.tasks), ...Array.from({ length: 7 }, (_, i) => assessmentTasks(i)).flat()];
export function assessmentTasks(index: number): Task[] {
    const start = index === 0 ? 0 : index * 10 - 5;
    const a = lessons[start], b = lessons[start + 4];
    return [a.tasks[0], b.tasks[0], a.tasks[1], b.tasks[1], b.tasks[4], a.tasks[5]].map((t, j) => ({ ...t, id: `assessment-${index}-${j}` }));
}
