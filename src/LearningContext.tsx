import { createContext } from 'react';
import type { LearningState, LearningEvent, Task } from './types';
export const LearningContext = createContext<{
    states: Record<string, LearningState>;
    dispatch: (task: Task, event: LearningEvent) => void;
} | null>(null);
