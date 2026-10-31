import type {Task} from './types';
const contractions:Record<string,string>={"let's":'let us',"i'm":'i am',"you're":'you are',"we're":'we are',"they're":'they are',"isn't":'is not',"aren't":'are not',"wasn't":'was not',"weren't":'were not',"can't":'cannot',"won't":'will not',"don't":'do not',"doesn't":'does not',"didn't":'did not',"couldn't":'could not',"shouldn't":'should not',"wouldn't":'would not',"i'll":'i will',"you'll":'you will',"we'll":'we will',"they'll":'they will',"he'll":'he will',"she'll":'she will',"i've":'i have',"you've":'you have',"we've":'we have',"they've":'they have'};
export function normalize(s:string):string{return s.normalize('NFKC').toLowerCase().replace(/[’‘]/g,"'").replace(/\b[a-z]+'[a-z]+\b/g,v=>contractions[v]??v).replace(/[^\p{L}\p{N}'\s]/gu,' ').replace(/\s+/g,' ').trim();}
export function grade(task:Task,answer:string):boolean|null{
 if(task.kind==='free')return null;
 if(task.answers?.some(a=>normalize(a)===normalize(answer)))return true;
 // A rewrite outside the verified set is uncertain, unless it repeats the known error.
 // Broad suffix/auxiliary heuristics can reject valid words such as "bring".
 if(task.kind==='rewrite')return task.errorExample&&normalize(answer)===normalize(task.errorExample)?false:null;
 return false;
}
