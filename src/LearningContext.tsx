import { createContext } from 'react';
import type { LearningState, LearningEvent, Task } from './types';
export const LearningContext = createContext<{
    states: Record<string, LearningState>;
    drafts?:Record<string,string>;
    saveDraft?:(id:string,value:string)=>void;
    dispatch: (task: Task, event: LearningEvent) => void;
} | null>(null);
