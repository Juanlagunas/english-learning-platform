import {it,expect} from 'vitest';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Exercise} from '../src/Exercise';
import {LearningContext} from '../src/LearningContext';
import {lessons} from '../src/content';
import {initialLearningState} from '../src/learning';
it('keeps saved free writing self-assessed and editable without a mastery claim',()=>{
 const task=lessons[0].tasks[5];
 const html=renderToStaticMarkup(createElement(LearningContext.Provider,{value:{states:{[task.id]:{...initialLearningState(),stage:'REVIEW',feedback:'Self-assessment saved.'}},dispatch:()=>{}}},createElement(Exercise,{task,spanish:false,initial:'My own answer.',onDone:()=>{}})));
 expect(html).toContain('Your response');expect(html).toContain('Compare with model');expect(html).not.toContain('transfer accepted');expect(html).not.toContain('Mastery streak completed');
});
