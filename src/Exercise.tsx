import { useContext, useState } from 'react';
import { Check, Copy, RotateCcw } from 'lucide-react';
import type { LearningEvent, LearningState, Task } from './types';
import { correctionPrompt } from './engine';
import { initialLearningState, transition } from './learning';
import { LearningContext } from './LearningContext';
import { Audio } from './Audio';
import {draftValue,taskResolved,taskMastered} from './progress';
export async function copyText(text: string): Promise<boolean> { try {
    await navigator.clipboard.writeText(text);
    return true;
}
catch {
    return false;
} }
export function Exercise({ task, spanish, onDone, initial = '', onDraft }: {
    task: Task;
    spanish: boolean;
    onDone: (answer: string, self?: boolean) => void;
    initial?: string;
    onDraft?: (value: string) => void;
}) {
    const context = useContext(LearningContext);
    const [local, setLocal] = useState<LearningState>(initialLearningState);
    const state = context?.states[task.id] ?? local;
    const [answer, setAnswer] = useState(()=>draftValue(context?.drafts??{},task.id,state.answer||initial));
    const [compared, setCompared] = useState(false);
    const [explain, setExplain] = useState(false);
    const [es, setEs] = useState(false);
    const [selected, setSelected] = useState<number[]>([]);
    const [self, setSelf] = useState<string[]>([]);
    const [copyStatus, setCopyStatus] = useState('');
    const [showPrompt, setShowPrompt] = useState(false);
    const free = task.kind === 'free', transfer = state.stage === 'TRANSFER';
    const active = transfer ? (task.transfer ?? task) : task;
    const teaching = state.stage === 'RETEACH' || explain;
    const finished = !free && taskResolved(task,state)&&!state.deferred;
    function send(event: LearningEvent) { const next = transition(state, event, task); if (context)
        context.dispatch(task, event);
    else
        setLocal(next); if (event.type === 'answer') {
        setCopyStatus('');
        setAnswer(next.answer);
        if (next.stage !== state.stage || next.stage === 'MASTERY' && next.streak > state.streak) {
            setSelected([]);
            setExplain(false);setShowPrompt(false);
        }
    } if (next.stage === 'REVIEW'&&event.type==='answer'||event.type === 'defer') {
        const original = next.history.filter(h => h.stage !== 'TRANSFER').at(-1)?.answer ?? answer;
        onDone(original);
    } return next; }
    function update(v:string){setAnswer(v);if(onDraft)onDraft(v);else context?.saveDraft?.(task.id,v);}
    function openExplanation() { send({ type: 'explanation' }); setExplain(true); setAnswer(''); setSelected([]);setShowPrompt(false); }
    function help(kind: 'transcript' | 'translation') { send({ type: kind }); }
    const typeNames = { listen: 'Listen & understand', cloze: 'Find the missing word', reorder: 'Build a sentence', connector: 'Connect your ideas', rewrite: 'Make it natural', free: 'Make it your own' };
    return <article className="exercise"><div className="eyebrow">{typeNames[task.kind]}{transfer ? ' · NEW CONTEXT' : ''}</div><h3>{active.prompt}</h3>{!free && <div className="learning-status" role="status"><strong>{state.stage === 'INITIAL_ATTEMPTS' ? `Initial attempts · ${state.failures}/3 used` : state.stage === 'MASTERY' ? `Retrieval streak · ${state.streak}/3` : state.stage === 'TRANSFER' ? 'Transfer · use it in a new context' : state.stage === 'RETEACH' ? 'Learn the structure again' : 'Review scheduled'}</strong><p>{state.feedback}</p>{state.deferred && <p>Deferred for review. You can move to the next exercise.</p>}</div>}
 {active.audio && <Audio key={`${active.id}-${state.stage}-${state.history.length}`} text={active.audio} translation={active.translation} onHelp={help}/>}
 {spanish && state.stage!=='MASTERY' && <p className="spanish">{active.hint}</p>}
 {teaching && !free ? <div className="feedback"><strong>Why this structure works</strong><p>{active.model}</p><p>{active.explanation}</p><Audio text={active.explanation}/><button className="text-button" onClick={() => { send({ type: 'translation' }); setEs(!es); }}>{es ? 'Hide explanation in Spanish' : 'Explain in Spanish'}</button>{es && <p className="spanish">{active.hint}</p>}<div className="button-row"><button className="primary small" onClick={() => { if (state.stage === 'RETEACH' || state.stage === 'INITIAL_ATTEMPTS')
            send({ type: 'beginMastery' }); setExplain(false);setShowPrompt(false); setCopyStatus(''); setAnswer(''); setSelected([]); }}>Hide solution & start retrieval</button></div></div> : finished ? <div className="feedback"><strong>{taskMastered(task,state) ? 'Mastery streak completed; transfer accepted.' : 'Retrieval and transfer accepted.'}</strong><p>The Review practice page shows this structure’s saved review date.</p><button onClick={() => { send({ type: 'restart' }); setAnswer(''); }}>Practice again</button></div> : <>
 {active.options && active.kind !== 'reorder' ? <fieldset className="choices"><legend className="sr-only">Choose your answer</legend>{active.options.map((o, i) => <label className={answer === o ? 'choice selected' : 'choice'} key={`${o}-${i}`}><input type="radio" name={active.id} value={o} checked={answer === o} onChange={() => update(o)}/>{o}</label>)}</fieldset> : active.kind === 'reorder' ? <><div className="word-bank">{active.options?.map((w, i) => <button key={i} disabled={selected.includes(i)} onClick={() => { const next = [...selected, i]; setSelected(next); update(next.map(j => active.options![j]).join(' ')); }}>{w}</button>)}<button onClick={() => { setSelected([]); update(''); }} aria-label="Reset word order"><RotateCcw size={16}/></button></div><label>Your sentence<input value={answer} maxLength={2000} onChange={e => update(e.target.value)} placeholder="Tap the words or type your sentence"/></label></> : <label>{free ? 'Your response' : 'Your answer'}<textarea rows={free ? 4 : 2} value={answer} maxLength={5000} onChange={e => update(e.target.value)} placeholder={free ? 'Try a short answer. Use fictional details.' : 'Type your answer…'}/></label>}
 <div className="button-row"><button className="primary small" disabled={!answer.trim()} onClick={() => { if (free)
            setCompared(true);
        else
            send({ type: 'answer', answer }); }}>{free ? 'Compare with model' : transfer ? 'Check transfer' : 'Check answer'}</button>{!free && <button className="text-button" onClick={openExplanation}>Explanation / solution{state.stage === 'MASTERY' ? ' (resets streak)' : ''}</button>}</div>
 {state.uncertain && !free && <div className="notice"><strong>This may be a valid alternative.</strong><p>I can check known patterns, but cannot reliably judge every rewrite offline. Ask a tutor or save this for later; no incorrect answer has been recorded.</p><button onClick={async () => { setCopyStatus(await copyText(correctionPrompt(active, answer)) ? 'Prompt copied.' : 'Copy the prompt below.'); setShowPrompt(true); }}>Copy alternative for ChatGPT</button></div>}
 {free && compared && <div className="feedback"><strong>Your turn to assess</strong><p>I can check some patterns, but I cannot fully grade free writing offline.</p><p>{task.model}</p><p>{task.explanation}</p><Audio text={task.model}/>{task.rubric?.map(item => <label className="check-row" key={item}><input type="checkbox" checked={self.includes(item)} onChange={e => setSelf(e.target.checked ? [...self, item] : self.filter(x => x !== item))}/>{item}</label>)}<div className="button-row"><button className="primary small" onClick={() => onDone(answer, self.length === (task.rubric?.length ?? 0))}><Check size={16}/> Save self-assessment</button><button onClick={async () => { const ok = await copyText(correctionPrompt(task, answer)); setCopyStatus(ok ? 'Prompt copied. Paste into ChatGPT for nuanced feedback.' : 'Clipboard unavailable. Copy the prompt below.'); setShowPrompt(true); }}><Copy size={16}/> Copy to ChatGPT</button></div></div>}
 </>}
 {!free && !finished && <div className="button-row"><button onClick={() => { send({ type: 'hint' }); setCopyStatus(`Hint: ${state.failures > 0 ? active.errorFocus ?? active.explanation : `Check ${active.topic.toLowerCase()}: find the subject, time, and intended meaning.`}`); }}>Get a hint{state.stage === 'MASTERY' ? ' (resets streak)' : ''}</button><button className="text-button" onClick={() => send({ type: 'defer' })}>Review later — continue course</button></div>}
 <p role="status">{copyStatus}</p>{showPrompt && <textarea aria-label="Correction prompt to copy" readOnly rows={7} value={correctionPrompt(active, answer)}/>}
 </article>;
}
