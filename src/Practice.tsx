import { useState, useEffect, useRef, useContext } from 'react';
import { LearningContext } from './LearningContext';
import { ArrowLeft, ArrowRight, Check, Clock, Mic } from 'lucide-react';
import type { Lesson, Task, Assessment } from './types';
import { Audio } from './Audio';
import { Exercise } from './Exercise';
import { assessmentTasks, lessons } from './content';
import { grade } from './engine';
export function Speaking({ prompt, model, onDone }: {
    prompt: string;
    model: string;
    onDone: () => void;
}) {
    const [remaining, setRemaining] = useState(60);
    const [running, setRunning] = useState(false);
    const [ratings, setRatings] = useState<string[]>([]);
    useEffect(() => {
        if (!running)
            return;
        const id = setInterval(() => setRemaining(v => {
            if (v <= 1) {
                setRunning(false);
                return 0;
            }
            return v - 1;
        }), 1000);
        return () => clearInterval(id);
    }, [running]);
    const criteria = ['I answered the question without reading the model.', 'I used a clear time reference and a complete sentence.', 'I gave a reason or a useful next step.'];
    return <article className="exercise"><div className="eyebrow"><Mic size={15}/> Speak with confidence</div><h3>{prompt}</h3><p className="muted">Try from memory first. Speaking aloud is enough: no microphone access or recording is needed.</p><div className="speak-timer"><span>{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</span><button onClick={() => {
            if (!remaining)
                setRemaining(60);
            setRunning(!running);
        }}>{running ? 'Pause' : 'Start 60-second timer'}</button><button onClick={() => { setRunning(false); setRemaining(60); }}>Reset</button></div><details><summary>Listen to a model after your attempt</summary><p>{model}</p><Audio text={model}/></details><p>Self-assess your attempt. You can finish even if you need another try.</p>{criteria.map(c => <label className="check-row" key={c}><input type="checkbox" checked={ratings.includes(c)} onChange={e => setRatings(e.target.checked ? [...ratings, c] : ratings.filter(x => x !== c))}/>{c}</label>)}<button className="primary small" onClick={() => { setRunning(false); onDone(); }}><Check size={16}/> Save speaking reflection ({ratings.length}/3)</button></article>;
}
export function LessonRunner({ lesson, mode, spanish, drafts, onAttempt, onDraft, onFinish, onTime, onExit }: {
    lesson: Lesson;
    mode: number;
    spanish: boolean;
    drafts: Record<string, string>;
    onAttempt: (task: Task, answer: string, self?: boolean) => void;
    onDraft: (id: string, answer: string) => void;
    onFinish: (correct: number, total: number, seconds: number) => void;
    onTime: (seconds: number) => void;
    onExit: () => void;
}) {
    const [index, setIndex] = useState(0);
    const learning = useContext(LearningContext);
    const [done, setDone] = useState<Record<string, boolean>>(() => Object.fromEntries(lesson.tasks.filter(t => { const s = learning?.states[t.id]; return s && (s.stage === 'REVIEW' || s.deferred); }).map(t => [t.id, learning?.states[t.id]?.history.some(h => h.correct === true) ?? false])));
    const [spoken, setSpoken] = useState(false);
    const [full, setFull] = useState(mode >= 15);
    const [seconds, setSeconds] = useState(0);
    const [finished, setFinished] = useState(false);
    const elapsed = useRef(0), pending = useRef(0), lastAction = useRef(Date.now()), timeCallback = useRef(onTime);
    timeCallback.current = onTime;
    useEffect(() => {
        if (finished)
            return;
        const active = () => { lastAction.current = Date.now(); };
        document.addEventListener('pointerdown', active);
        document.addEventListener('keydown', active);
        const id = setInterval(() => {
            if (!document.hidden && Date.now() - lastAction.current < 120000) {
                elapsed.current++;
                pending.current++;
                setSeconds(elapsed.current);
                if (pending.current >= 60) {
                    timeCallback.current(pending.current);
                    pending.current = 0;
                }
            }
        }, 1000);
        return () => {
            clearInterval(id);
            document.removeEventListener('pointerdown', active);
            document.removeEventListener('keydown', active);
            if (pending.current) {
                timeCallback.current(pending.current);
                pending.current = 0;
            }
        };
    }, [finished]);
    const tasks = full ? lesson.tasks : lesson.tasks.filter(t => mode === 5 ? ['listen', 'cloze'].includes(t.kind) : ['listen', 'cloze', 'connector', 'free'].includes(t.kind));
    const allDone = tasks.every(t => t.id in done) && spoken;
    if (finished)
        return <div className="card celebration"><div className="big-check"><Check /></div><div className="eyebrow">A little progress counts</div><h2>{full ? 'Session complete.' : 'Micro-session saved.'}</h2><p>You practiced for {Math.floor(seconds / 60)}m {seconds % 60}s. {full ? 'Your lesson is marked complete.' : 'Return for the remaining tasks when you have more time.'}</p><p>{lesson.review}</p><button className="primary" onClick={onExit}>Back to my dashboard <ArrowRight size={18}/></button></div>;
    return <div className="lesson-runner"><button className="text-button" onClick={onExit}><ArrowLeft size={16}/> Save & leave</button><div className="lesson-heading"><div><div className="eyebrow">Week {lesson.week} · Session {lesson.day} · {mode}-minute target</div><h2>{lesson.title}</h2><p>{lesson.objective}</p></div><span className="timer"><Clock size={17}/>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</span></div><div className="notice">{mode === 30 ? 'Suggested balance: 10 min listening, 10 min exercises, 10 min speaking / review.' : mode === 15 ? 'Flexible plan: 5 min listening, 5 min exercises, 5 min speaking / review.' : `${mode}-minute micro-session: listen, retrieve, and speak. This saves practice without marking the full lesson complete.`} Time is counted while this tab is visible and recently active. Breaks are welcome.</div>{mode < 15 && <label className="check-row"><input type="checkbox" checked={full} onChange={e => { setFull(e.target.checked); setIndex(0); }}/>Show the full lesson instead</label>}<details className="help"><summary>Quick explanation & retrieval goal</summary><p>{lesson.explanation}</p><p>{lesson.review}</p>{spanish && <p className="spanish">{lesson.spanish}</p>}</details><nav aria-label="Practice steps" className="steps">{tasks.map((t, i) => <button key={t.id} aria-current={index === i ? 'step' : undefined} className={index === i ? 'current' : ''} onClick={() => setIndex(i)}>{t.id in done ? <Check size={14}/> : i + 1} {t.kind}</button>)}<button className={index === tasks.length ? 'current' : ''} onClick={() => setIndex(tasks.length)}>{spoken ? <Check size={14}/> : tasks.length + 1} speak</button></nav>{index < tasks.length ? <Exercise key={tasks[index].id} task={tasks[index]} spanish={spanish} initial={drafts[tasks[index].id] ?? ''} onDraft={a => onDraft(tasks[index].id, a)} onDone={(a, self) => { onAttempt(tasks[index], a, self); setDone(d => ({ ...d, [tasks[index].id]: grade(tasks[index], a) === true })); }}/> : <Speaking prompt={lesson.spoken} model={lesson.spokenModel} onDone={() => setSpoken(true)}/>}<div className="button-row spread"><button disabled={index === 0} onClick={() => setIndex(index - 1)}><ArrowLeft size={16}/> Previous</button>{index < tasks.length ? <button className="primary" onClick={() => setIndex(index + 1)}>Next step <ArrowRight size={16}/></button> : <button className="primary" disabled={!allDone} onClick={() => {
                if (pending.current) {
                    onTime(pending.current);
                    pending.current = 0;
                }
                if (full)
                    onFinish(Object.values(done).filter(Boolean).length, tasks.filter(t => t.kind !== 'free').length, elapsed.current);
                setFinished(true);
            }}>{full ? 'Complete lesson' : 'Save micro-session'} <Check size={16}/></button>}</div><p className="muted">{Object.keys(done).length}/{tasks.length} exercises attempted · Speaking {spoken ? 'reflected' : 'pending'}. Attempt each exercise and save the writing self-assessment before finishing. A mistake is a review opportunity.</p></div>;
}
export function AssessmentRunner({ index, spanish, onSave, onExit }: {
    index: number;
    spanish: boolean;
    onSave: (a: Assessment) => void;
    onExit: () => void;
}) {
    const tasks = assessmentTasks(index);
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [speaking, setSpeaking] = useState(false);
    const [writingScore, setWritingScore] = useState('');
    const [speakingScore, setSpeakingScore] = useState('');
    const [saved, setSaved] = useState(false);
    const title = index === 0 ? 'Starting-point diagnostic' : `Week ${index * 2} checkpoint`;
    function percentage(kind: string) { const selected = tasks.filter(t => kind === 'grammar' ? ['cloze', 'rewrite'].includes(t.kind) : t.kind === kind); return Math.round(selected.filter(t => grade(t, answers[t.id] ?? '') === true).length / selected.length * 100); }
    return <section><button className="text-button" onClick={onExit}><ArrowLeft size={16}/> Back</button><div className="page-heading"><div className="eyebrow">Notice what is getting easier</div><h2>{title}</h2><p>Two listening tasks, three grammar tasks, a written response, and self-scored speaking. Practice indicators, never a formal CEFR result. Forms sample different topics; compare with care.</p></div>{saved ? <div className="card"><h3>Snapshot saved</h3><p>Your results are on the Progress page. Keep practicing the topics that needed a second try.</p><button className="primary" onClick={onExit}>Done</button></div> : <><nav className="steps" aria-label="Assessment steps">{tasks.map((t, i) => <button key={t.id} onClick={() => setStep(i)} className={step === i ? 'current' : ''}>{t.id in answers ? '✓' : i + 1} {t.kind}</button>)}<button onClick={() => setStep(tasks.length)}>Speak & finish</button></nav>{step < tasks.length ? <><Exercise key={tasks[step].id} task={tasks[step]} spanish={spanish} initial={answers[tasks[step].id] ?? ''} onDone={a => setAnswers(x => ({ ...x, [tasks[step].id]: a }))}/><button className="primary" onClick={() => setStep(step + 1)}>Next <ArrowRight size={16}/></button></> : <><Speaking prompt={lessons[Math.min(index * 10 + 3, 59)].spoken} model={lessons[Math.min(index * 10 + 3, 59)].spokenModel} onDone={() => setSpeaking(true)}/><div className="card"><h3>Rate your writing and speaking</h3><p>0 = needs help · 1 = some meaning clear · 2 = mostly clear · 3 = clear, complete, and relevant. These are your own ratings.</p>{[['Writing', writingScore, setWritingScore], ['Speaking', speakingScore, setSpeakingScore]].map(([label, value, setter]) => <label key={label as string}>{label as string}<select value={value as string} onChange={e => (setter as (v: string) => void)(e.target.value)}><option value="">Choose a rating</option>{[0, 1, 2, 3].map(n => <option key={n} value={n}>{n} / 3</option>)}</select></label>)}<p>{Object.keys(answers).length}/{tasks.length} tasks attempted · Speaking {speaking ? 'saved' : 'pending'}</p><button className="primary" disabled={Object.keys(answers).length < tasks.length || !speaking || writingScore === '' || speakingScore === ''} onClick={() => { onSave({ id: index === 0 ? 'diagnostic' : `week-${index * 2}`, at: new Date().toISOString(), listening: percentage('listen'), grammar: percentage('grammar'), writing: Math.round(Number(writingScore) / 3 * 100), speaking: Math.round(Number(speakingScore) / 3 * 100) }); setSaved(true); }}>Save assessment</button></div></>}</>}</section>;
}
