import {describe,it,expect} from 'vitest';
import {lessons} from '../src/content';
import {initialLearningState,transition,evaluate} from '../src/learning';
import {freshProgress,recordLearningEvent,grade} from '../src/engine';
import {vary} from '../src/transfer';
describe('final audit regressions',()=>{
 it('does not preserve a retrieval streak across an uncertain rewrite',()=>{const t=lessons[0].tasks[4];let s=transition(initialLearningState(),{type:'beginMastery'},t);s=transition(s,{type:'answer',answer:t.answers![0]},t);s=transition(s,{type:'answer',answer:'She manages our design group.'},t);expect(s.uncertain).toBe(true);expect(s.streak).toBe(0);expect(s.history.at(-1)?.correct).toBeNull();});
 it('does not falsely reject valid sentences containing bring or an adjective after did',()=>{const t=lessons[0].tasks[4];expect(evaluate(t,'I need to bring the plan.')).toBeNull();expect(evaluate(t,'Did the approved plan include the budget?')).toBeNull();});
 it('does not append attempts when REVIEW ignores an answer event',()=>{const t=lessons[0].tasks[1];let p=recordLearningEvent(freshProgress(),t,{type:'answer',answer:t.answers![0]});p=recordLearningEvent(p,t,{type:'answer',answer:t.transfer!.answers![0]});const count=p.attempts.length;p=recordLearningEvent(p,t,{type:'answer',answer:'wrong'});expect(p.attempts).toHaveLength(count);});
 it('accepts unambiguous contractions without normalizing grammar errors',()=>{const t={...lessons[0].tasks[2],answers:['We are working on the report.']};expect(grade(t,"We're working on the report.")).toBe(true);expect(grade(t,'We working on the report.')).toBe(false);});
 it('changes vocabulary without corrupting verbs or conjunctions',()=>{expect(vary('I reviewed the plan yesterday.')).toBe('I checked the plan last week.');expect(vary('We are planning the release.')).toBe('We are planning the release.');expect(vary('What I mean is that we will release tomorrow.')).toBe('What I mean is that we will release next week.');});
});
it('keeps each transfer word bank consistent with its model and offers independent Spanish listening help',()=>{for(const l of lessons){const reorder=l.tasks.find(t=>t.kind==='reorder')!.transfer!;expect(grade(reorder,[...reorder.options!].reverse().join(' '))).toBe(true);expect(l.tasks[0].transfer!.translation).toBeTruthy();}});
