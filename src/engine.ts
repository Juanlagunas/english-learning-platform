import type { Progress, Task, Review, Attempt } from './types';
export const STORAGE_KEY='compass-progress-v1';
export function normalize(s:string):string { return s.normalize('NFKC').toLowerCase().replace(/[’‘]/g,"'").replace(/\b(i'm)\b/g,'i am').replace(/\b(can't)\b/g,'cannot').replace(/\b(won't)\b/g,'will not').replace(/\b(don't)\b/g,'do not').replace(/\b(doesn't)\b/g,'does not').replace(/\b(didn't)\b/g,'did not').replace(/[^\p{L}\p{N}'\s]/gu,' ').replace(/\s+/g,' ').trim(); }
export function grade(task:Task,answer:string):boolean|null { return task.kind==='free'?null:(task.answers??[]).some(a=>normalize(a)===normalize(answer)); }
export function freshProgress(now=new Date()):Progress { return {version:1,started:now.toISOString(),completed:{},attempts:[],reviews:{},assessments:[],practice:[],drafts:{},mode:30}; }
export function nextReview(taskId:string,correct:boolean,previous?:Review,now=new Date()):Review {
  const box=correct?Math.min((previous?.box??0)+1,5):0;
  return {taskId,box,due:new Date(now.getTime()+[0,1,3,7,14,30][box]*86400000).toISOString()};
}
export function recordAttempt(p:Progress,task:Task,answer:string,self?:boolean,now=new Date()):Progress {
  const correct=grade(task,answer); const reviewCorrect=correct??self??false;
  const attempt:Attempt={taskId:task.id,answer,correct,at:now.toISOString(),topic:task.topic};
  return {...p,attempts:[...p.attempts,attempt].slice(-10000),reviews:{...p.reviews,[task.id]:nextReview(task.id,reviewCorrect,p.reviews[task.id],now)},drafts:{...p.drafts,[task.id]:answer}};
}
const isRecord=(x:unknown):x is Record<string,unknown>=>typeof x==='object'&&x!==null&&!Array.isArray(x);
const validDate=(x:unknown)=>typeof x==='string'&&Number.isFinite(Date.parse(x));
const count=(x:unknown,max=1e9)=>typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<=max;
const string=(x:unknown,max=10000)=>typeof x==='string'&&x.length<=max;
export function parseProgress(raw:string):Progress {
  if(raw.length>8_000_000) throw new Error('This file is too large (maximum 8 MB).');
  const p:unknown=JSON.parse(raw);
  if(!isRecord(p)||p.version!==1||!validDate(p.started)||!isRecord(p.completed)||!isRecord(p.reviews)||!isRecord(p.drafts)||!Array.isArray(p.attempts)||!Array.isArray(p.assessments)||!Array.isArray(p.practice)||typeof p.mode!=='number'||![5,10,15,30].includes(p.mode)) throw new Error('This is not a supported Compass progress file (schema version 1).');
  if(Object.keys(p.completed).some(k=>!/^s\d{2}$/.test(k))||Object.values(p.completed).some(x=>!isRecord(x)||!validDate(x.at)||!count(x.seconds)||!count(x.correct,100)||!count(x.total,100)||Number(x.correct)>Number(x.total))) throw new Error('Invalid session history.');
  if(Object.entries(p.reviews).some(([k,x])=>!isRecord(x)||x.taskId!==k||!validDate(x.due)||!Number.isInteger(x.box)||!count(x.box,5))) throw new Error('Invalid review schedule.');
  if(Object.values(p.drafts).some(x=>!string(x))) throw new Error('Invalid saved answer.');
  if(p.attempts.length>10000||p.attempts.some(x=>!isRecord(x)||!string(x.taskId,120)||!string(x.answer)||![true,false,null].includes(x.correct as boolean|null)||!validDate(x.at)||!string(x.topic,300))) throw new Error('Invalid answer history.');
  if(p.assessments.some(x=>!isRecord(x)||!string(x.id,100)||!validDate(x.at)||!['listening','grammar','writing','speaking'].every(k=>count(x[k],100)))) throw new Error('Invalid assessment history.');
  if(p.practice.some(x=>!isRecord(x)||!validDate(x.at)||!count(x.seconds))) throw new Error('Invalid practice history.');
  return p as unknown as Progress;
}
export function loadProgress(storage:Pick<Storage,'getItem'>=localStorage):{progress:Progress;error?:string} {
  try { const raw=storage.getItem(STORAGE_KEY);return {progress:raw?parseProgress(raw):freshProgress()}; }
  catch { return {progress:freshProgress(),error:'Saved progress could not be read. It has not been overwritten. Export your current work before closing; import a valid backup to restore saving.'}; }
}
export function saveProgress(p:Progress,storage:Pick<Storage,'setItem'>=localStorage):void { storage.setItem(STORAGE_KEY,JSON.stringify(p)); }
export function localDay(date=new Date()):string { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
export function weeklyStats(p:Progress,now=new Date()) {
  const start=new Date(now); start.setHours(0,0,0,0); start.setDate(start.getDate()-((start.getDay()+6)%7));
  const events=p.practice.filter(x=>new Date(x.at)>=start);
  const totals=new Map<string,number>(); for(const e of events){const d=localDay(new Date(e.at));totals.set(d,(totals.get(d)??0)+e.seconds);}
  return {days:[...totals.values()].filter(s=>s>=900).length,minutes:Math.floor(events.reduce((a,x)=>a+x.seconds,0)/60)};
}
export function streak(p:Progress,now=new Date()):number {
  const days=new Set(p.practice.filter(x=>x.seconds>=60).map(x=>localDay(new Date(x.at)))); let n=0;
  const day=new Date(now); if(!days.has(localDay(day)))day.setDate(day.getDate()-1);
  while(days.has(localDay(day))){n++;day.setDate(day.getDate()-1);}return n;
}
export function weakTopics(p:Progress):[string,number][] { const map=new Map<string,number>();for(const a of p.attempts.slice(-200)){if(a.correct===false)map.set(a.topic,(map.get(a.topic)??0)+1);}return [...map].sort((a,b)=>b[1]-a[1]).slice(0,5); }
export function tutorSummary(p:Progress):string {return `Compass tutor handoff (fictional Project Compass only)\nCompleted: ${Object.keys(p.completed).length}/60 sessions\nPractice: ${Math.floor(p.practice.reduce((a,x)=>a+x.seconds,0)/60)} minutes\nRecent error patterns: ${weakTopics(p).map(([t,n])=>`${t} (${n})`).join(', ')||'No recorded errors yet'}\nLatest assessments: ${p.assessments.slice(-3).map(a=>`${a.id}: listening ${a.listening}%, grammar ${a.grammar}%, writing self-score ${a.writing}%, speaking self-score ${a.speaking}%`).join('; ')}\nRecent answers:\n${p.attempts.slice(-8).map(a=>`${a.topic}: ${a.answer} [${a.correct===null?'self-assessed':a.correct?'matched model':'needs review'}]`).join('\n')}\nPlease ask short workplace questions one at a time. Let me answer spontaneously. Correct tense, auxiliaries, prepositions, and collocations; then ask me to retry. These results are practice indicators, not a CEFR certification.`; }
export function correctionPrompt(t:Task,answer:string):string {return `Act as a supportive English tutor for an A2–B1 learner. Use only this fictional Project Compass scenario.\nTask: ${t.prompt}\nMy answer: ${answer}\nModel for comparison: ${t.model}\nGive nuanced feedback on meaning, grammar, natural collocations and clarity. Accept valid alternatives. Explain the top two error patterns briefly, offer a natural correction, and ask one follow-up question. Do not assign a formal CEFR level. Do not request real workplace or personal information.`;}
