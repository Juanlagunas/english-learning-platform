import {describe,it,expect} from 'vitest';
import data from '../src/lesson-data.json';
import oldBackup from './fixtures/pre-software-progress.json';
import {lessons,allTasks,assessmentTasks,CONTENT_REVISION} from '../src/content';
import {grade,normalize,freshProgress,parseProgress,recordLearningEvent,recordAttempt} from '../src/engine';
import {reconcileProgress,taskMastered,taskResolved,assessmentScore,completeLesson,patchLesson} from '../src/progress';
import {vary} from '../src/transfer';
import {initialLearningState} from '../src/learning';
const now=new Date('2026-10-31T12:00:00Z');
describe('American software curriculum',()=>{
 it('keeps every lesson and exercise ID and the 42/18 progressive mix',()=>{
  expect(lessons).toHaveLength(60);expect(lessons.filter(l=>l.context==='technology')).toHaveLength(42);expect(lessons.filter(l=>l.context==='general')).toHaveLength(18);
  for(let w=1;w<=12;w++){expect(lessons.filter(l=>l.week===w&&l.context==='technology')).toHaveLength(w<=6?3:4);}
  expect(lessons.map(l=>l.id)).toEqual(Array.from({length:60},(_,i)=>`s${String(i+1).padStart(2,'0')}`));
  for(const l of lessons)expect(l.tasks.map(t=>t.id)).toEqual(['listen','cloze','reorder','connector','rewrite','free'].map(kind=>`${l.id}-${kind}`));
  for(let i=0;i<7;i++)expect(assessmentTasks(i).map(t=>t.id)).toEqual(Array.from({length:6},(_,j)=>`assessment-${i}-${j}`));
 });
 it('pairs every dialogue with one accepted interpretation, two distinct distractors, Spanish, and valid models',()=>{
  expect(data.translations).toHaveLength(60);expect(data.distractors).toHaveLength(60);expect(new Set(data.rows.map(r=>r[1])).size).toBe(60);
  for(const l of lessons){const listen=l.tasks[0];expect(listen.options).toHaveLength(3);expect(listen.options!.filter(a=>grade(listen,a)===true)).toHaveLength(1);expect(new Set(listen.options!.map(normalize)).size).toBe(3);expect(listen.transfer!.options!.filter(a=>grade(listen.transfer!,a)===true)).toHaveLength(1);expect(new Set(listen.transfer!.options!.map(normalize)).size).toBe(3);expect(listen.translation!.length).toBeGreaterThan(40);expect(listen.transfer!.translation).not.toContain('undefined');
   for(const t of l.tasks.filter(t=>t.kind!=='free')){expect(t.contentRevision).toBe(CONTENT_REVISION);expect(grade(t,t.answers![0])).toBe(true);expect(grade(t.transfer!,t.transfer!.answers![0])).toBe(true);}
   const cloze=l.tasks[1];expect(cloze.model).toBe(cloze.prompt.replace('___',cloze.answers![0]));
   const reorder=l.tasks[2];expect(grade(reorder,reorder.options!.slice().reverse().join(' '))).toBe(true);expect(grade(reorder.transfer!,reorder.transfer!.options!.slice().reverse().join(' '))).toBe(true);
   expect(grade(l.tasks[4],l.tasks[4].errorExample!)).toBe(false);
  }
 });
 it('teaches distinctions in context without turning technical terms into synonyms',()=>{
  const text=data.rows.flat().join(' ');for(const term of ['weekly update','status report','blocker','issue','risk','microservices','API contract','integration','deployment','incident','tech lead','architect','engineering manager'])expect(text.toLowerCase()).toContain(term.toLowerCase());
  expect(data.rows[21][7]).toContain('A blocker prevents progress now');expect(data.rows[42][7]).toContain('A risk may happen in the future');
  expect(vary('A risk is not an issue or a blocker. The rollback plan is ready.')).toBe('A risk is not an issue or a blocker. The rollback plan is ready.');
 });
 it('uses answerable speaking and writing prompts without embedding an interview answer',()=>{for(const i of [19,50,51]){const l=lessons[i];expect(l.spoken).not.toContain(l.tasks[0].audio!.split('. ').slice(1).join('. '));expect(l.spokenModel.length).toBeGreaterThan(15);}expect(lessons[19].spoken).toContain('clarify the dinner plan');expect(lessons[33].spokenModel).toContain('I will handle the rollback');});
 it('changes concrete details coherently in transfer audio, answers and Spanish',()=>{
  const dinner=lessons[3].tasks[0].transfer!;expect(dinner.audio).toContain('buy pasta');expect(dinner.answers![0]).toContain('pasta');expect(dinner.translation).toContain('comprar pasta');expect(dinner.translation).toContain('el almuerzo');
  const album=lessons[13].tasks[0].transfer!;expect(album.audio).toContain('family album');expect(album.translation).toContain('álbum familiar');
  const delivery=lessons[48].tasks[0].transfer!;expect(delivery.audio).toContain('core service');expect(delivery.translation).toContain('el servicio principal');expect(delivery.translation).not.toContain('la Servicio');
  expect(lessons[38].tasks[0].transfer!.translation).toContain('El icono opcional');
 });
 it('keeps everyday writing, speaking and connector examples separate from software roleplay',()=>{
  for(const l of lessons){expect(l.tasks[5].prompt).toContain(l.context==='general'?'Everyday roleplay':'Project Orion software team');
   if(l.context==='general'){expect(l.tasks[5].model).not.toContain('with the team');expect(l.tasks[3].model).not.toMatch(/API|deployment|microservice/);expect(l.tasks[0].transfer!.audio).toContain('fictional neighborhood');}
   else expect(l.tasks[0].transfer!.audio).toContain('fictional software team');
  }
 });
});
describe('compatible editorial update',()=>{
 it('retains real prior-release QA history, drafts, completions and snapshots without preserving false mastery',()=>{
  const old=parseProgress(JSON.stringify(oldBackup));const migrated=reconcileProgress(old,allTasks,now);
  expect(migrated.completed).toEqual(old.completed);expect(migrated.attempts).toEqual(old.attempts);expect(migrated.drafts).toEqual(old.drafts);expect(migrated.assessments).toEqual(old.assessments);expect(migrated.practice).toEqual(old.practice);
  for(const [id,previous] of Object.entries(old.exerciseStates)){const t=allTasks.find(t=>t.id===id)!;expect(migrated.exerciseStates[id].history).toEqual(previous.history);expect(migrated.exerciseStates[id].contentRevision).toBe(CONTENT_REVISION);expect(migrated.exerciseStates[id].streak).toBe(0);expect(migrated.exerciseStates[id].deferred).toBe(true);expect(migrated.reviews[id]).toBeDefined();expect(taskMastered(t,migrated.exerciseStates[id])).toBe(false);}
  expect(migrated.assessmentProgress['assessment-0']).toMatchObject({step:0,answers:{},speaking:false,finished:false});
  expect(assessmentScore(assessmentTasks(0),migrated.exerciseStates,'grammar')).toEqual({score:null,checked:0});
  expect(reconcileProgress(parseProgress(JSON.stringify(migrated)),allTasks,now)).toEqual(migrated);
 });
 it('does not count old correct answers as new results when revised work is deferred',()=>{const old=parseProgress(JSON.stringify(oldBackup));old.completed={};let p=reconcileProgress(old,allTasks,now);p=patchLesson(p,lessons[0],{spoken:true});p=completeLesson(p,lessons[0],now);expect(p.completed.s01).toMatchObject({correct:0,total:0});expect(p.attempts).toEqual(old.attempts);});
 it('keeps legacy draft-only work pending and preserves newly checked progress on subsequent loads',()=>{
  let p=freshProgress(now);const t=lessons[6].tasks[4];p.drafts[t.id]='I am checking the old design.';p=reconcileProgress(p,allTasks,now);expect(p.drafts[t.id]).toBe('I am checking the old design.');expect(p.exerciseStates[t.id].deferred).toBe(true);
  p=recordLearningEvent(p,t,{type:'answer',answer:t.answers![0]},now);p=recordLearningEvent(p,t,{type:'answer',answer:t.transfer!.answers![0]},now);expect(taskResolved(t,p.exerciseStates[t.id])).toBe(true);expect(reconcileProgress(parseProgress(JSON.stringify(p)),allTasks,now)).toEqual(p);
 });
 it('scores only the first verified attempt from the new content revision',()=>{
  const task=assessmentTasks(0)[2];let p=freshProgress(now);p.exerciseStates[task.id]={...initialLearningState(),history:[{answer:'coordinate',correct:true,at:now.toISOString(),stage:'INITIAL_ATTEMPTS'}]};
  p=reconcileProgress(p,allTasks,now);expect(assessmentScore(assessmentTasks(0),p.exerciseStates,'grammar')).toEqual({score:null,checked:0});
  p=recordLearningEvent(p,task,{type:'answer',answer:'wrong'},now);expect(assessmentScore(assessmentTasks(0),p.exerciseStates,'grammar')).toEqual({score:0,checked:1});
  p=recordLearningEvent(p,task,{type:'answer',answer:task.answers![0]},now);expect(assessmentScore(assessmentTasks(0),p.exerciseStates,'grammar')).toEqual({score:0,checked:1});
 });
 it('does not mark a new unsent current-revision draft as legacy content',()=>{const t=lessons[6].tasks[4];const p=freshProgress(now);p.drafts[t.id]='I am building our API.';p.exerciseStates[t.id]={...initialLearningState(),contentRevision:CONTENT_REVISION};expect(reconcileProgress(p,allTasks,now)).toBe(p);});
 it('saves current-revision free writing and rejects corrupt revision metadata',()=>{
  const task=lessons[3].tasks[5];const p=recordAttempt(freshProgress(now),task,'We need to buy rice before dinner.',true,now);expect(reconcileProgress(p,allTasks,now)).toEqual(p);expect(taskResolved(task,p.exerciseStates[task.id])).toBe(true);
  p.exerciseStates[task.id].contentRevision=99 as unknown as string;expect(()=>parseProgress(JSON.stringify(p))).toThrow();
 });
});
