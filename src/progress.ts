import {grade} from './grading';
import {initialLearningState} from './learning';
import type {Progress,Lesson,Task,LessonProgress,LearningState} from './types';
export function taskResolved(t:Task,s?:LearningState):boolean{
 if(!s||t.contentRevision&&s.contentRevision!==t.contentRevision)return false;
 if(s.deferred)return true;
 if(s.stage!=='REVIEW')return false;
 return t.kind==='free'?s.history.some(h=>h.correct===null&&h.contentRevision===t.contentRevision):s.history.at(-1)?.stage==='TRANSFER'&&s.history.at(-1)?.correct===true&&s.history.at(-1)?.contentRevision===t.contentRevision&&Boolean(t.transfer&&grade(t.transfer,s.history.at(-1)!.answer)===true);
}
export function taskMastered(t:Task,s?:LearningState):boolean{
 if(!s||t.contentRevision&&s.contentRevision!==t.contentRevision||s.deferred||s.stage!=='REVIEW'||!s.masteredAt||s.streak!==3)return false;
 const transfer=s.history.at(-1);const retrieval=s.history.slice(0,-1).slice(-3);
 return transfer?.stage==='TRANSFER'&&transfer.correct===true&&transfer.contentRevision===t.contentRevision&&Boolean(t.transfer&&grade(t.transfer,transfer.answer)===true)&&retrieval.length===3&&retrieval.every(h=>h.stage==='MASTERY'&&h.correct===true&&h.contentRevision===t.contentRevision);
}
export function lessonStatus(p:Progress,l:Lesson):'Not started'|'In progress'|'Completed'{
 if(p.completed[l.id])return 'Completed';
 return p.lessonProgress[l.id]||l.tasks.some(t=>Object.hasOwn(p.drafts,t.id)||p.exerciseStates[t.id])?'In progress':'Not started';
}
export function startLesson(p:Progress,l:Lesson,now=new Date()):Progress{
 if(p.lessonProgress[l.id])return p;
 return {...p,lessonProgress:{...p.lessonProgress,[l.id]:{startedAt:now.toISOString(),lastStep:l.tasks[0].id,spoken:false,spokenRatings:[],seconds:0}}};
}
export function patchLesson(p:Progress,l:Lesson,patch:Partial<LessonProgress>):Progress{const next=startLesson(p,l);return {...next,lessonProgress:{...next.lessonProgress,[l.id]:{...next.lessonProgress[l.id],...patch}}};}
export function resumeStep(p:Progress,l:Lesson,tasks:Task[]):number{
 const saved=p.lessonProgress[l.id]?.lastStep;const index=saved==='speaking'?tasks.length:tasks.findIndex(t=>t.id===saved);
 if(p.completed[l.id])return index>=0?index:0;
 if(index>=0&&(index===tasks.length||!taskResolved(tasks[index],p.exerciseStates[tasks[index].id])))return index;
 const first=tasks.findIndex(t=>!taskResolved(t,p.exerciseStates[t.id]));return first<0?tasks.length:first;
}
export function completionStats(p:Progress,lessons:Lesson[]){const completed=lessons.filter(l=>p.completed[l.id]).length;return {completed,remaining:lessons.length-completed,percentage:completed/lessons.length*100,next:lessons.find(l=>!p.completed[l.id])??null};}
export function canComplete(p:Progress,l:Lesson){return l.tasks.every(t=>taskResolved(t,p.exerciseStates[t.id]))&&Boolean(p.lessonProgress[l.id]?.spoken);}
export function completeLesson(p:Progress,l:Lesson,now=new Date()):Progress{
 if(p.completed[l.id]||!canComplete(p,l))return p;
 const closed=l.tasks.filter(t=>t.kind!=='free');const attempts=closed.map(t=>p.exerciseStates[t.id]?.history.filter(h=>h.stage!=='TRANSFER'&&h.contentRevision===t.contentRevision).at(-1)).filter(Boolean);
 return {...p,completed:{...p.completed,[l.id]:{at:now.toISOString(),seconds:p.lessonProgress[l.id]?.seconds??0,correct:attempts.filter(a=>a!.correct===true).length,total:attempts.filter(a=>a!.correct!==null).length}}};
}
export function recordPractice(p:Progress,l:Lesson,seconds:number,now=new Date()):Progress{
 if(seconds<=0)return p;
 const next=startLesson(p,l,now);const last=next.practice.at(-1);const merge=last?.lessonId===l.id&&Math.floor(Date.parse(last.at)/60000)===Math.floor(now.getTime()/60000);
 const event={at:now.toISOString(),seconds:(merge?last.seconds:0)+seconds,lessonId:l.id};
 return {...patchLesson(next,l,{seconds:next.lessonProgress[l.id].seconds+seconds}),practice:merge?[...next.practice.slice(0,-1),event]:[...next.practice,event]};
}
export function draftValue(drafts:Record<string,string>,id:string,fallback=''):string{return Object.hasOwn(drafts,id)?drafts[id]:fallback;}
export function reconcileProgress(p:Progress,tasks:Task[],now=new Date()):Progress{
 let result=p;
 for(const task of tasks){const s=result.exerciseStates[task.id];
 if(task.contentRevision&&s?.contentRevision!==task.contentRevision&&(s||Object.hasOwn(p.drafts,task.id))){
  result={...result,exerciseStates:{...result.exerciseStates,[task.id]:{...initialLearningState(),contentRevision:task.contentRevision,deferred:true,history:s?.history??[],hints:s?.hints??[],feedback:'The lesson wording has been updated. Your earlier answers and completed lessons are kept. Compare any saved draft with the new prompt; this exercise is pending a new check.'}},reviews:{...result.reviews,[task.id]:{taskId:task.id,box:0,due:result.reviews[task.id]?.due??new Date(now.getTime()+86400000).toISOString()}}};
  if(task.id.startsWith('assessment-')){const id=task.id.split('-').slice(0,2).join('-');const meta=result.assessmentProgress[id];if(meta)result={...result,assessmentProgress:{...result.assessmentProgress,[id]:{...meta,step:0,answers:{},speaking:false,writingScore:'',speakingScore:'',finished:false}}};}
  continue;
 }
 if(!s||task.kind==='free'||s.stage!=='REVIEW')continue;
 const last=s.history.at(-1);if(last?.stage==='TRANSFER'&&last.correct===true&&task.transfer&&grade(task.transfer,last.answer)===true)continue;
 result={...result,exerciseStates:{...result.exerciseStates,[task.id]:{...s,stage:'TRANSFER',deferred:true,streak:0,masteredAt:undefined,answer:'',feedback:'This transfer has a corrected model. Your lesson completion is kept; review this exercise when ready.'}},reviews:{...result.reviews,[task.id]:{taskId:task.id,box:0,due:new Date(now.getTime()+86400000).toISOString()}}};
 }
 return result;
}
export function assessmentScore(tasks:Task[],states:Record<string,LearningState>,kind:'listen'|'grammar'):{score:number|null;checked:number}{
 const relevant=tasks.filter(t=>kind==='listen'?t.kind==='listen':['cloze','rewrite'].includes(t.kind));
 const verified=relevant.map(t=>states[t.id]?.history.find(h=>h.stage==='INITIAL_ATTEMPTS'&&h.correct!==null&&h.contentRevision===t.contentRevision)?.correct).filter((v):v is boolean=>typeof v==='boolean');
 return {score:verified.length?Math.round(verified.filter(Boolean).length/verified.length*100):null,checked:verified.length};
}
