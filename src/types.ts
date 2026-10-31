export type TaskKind = 'cloze' | 'reorder' | 'connector' | 'rewrite' | 'free' | 'listen';
export interface Task {
    id: string;
    kind: TaskKind;
    topic: string;
    prompt: string;
    answers?: string[];
    options?: string[];
    audio?: string;
    model: string;
    explanation: string;
    hint: string;
    rubric?: string[];
    translation?: string;
    transfer?: Omit<Task, 'transfer'>;
    errorExample?: string;
    errorFocus?: string;
}
export interface Lesson {
    id: string;
    week: number;
    day: number;
    title: string;
    objective: string;
    explanation: string;
    spanish: string;
    tasks: Task[];
    spoken: string;
    spokenModel: string;
    review: string;
}
export interface Attempt {
    taskId: string;
    answer: string;
    correct: boolean | null;
    at: string;
    topic: string;
}
export interface Review {
    taskId: string;
    box: number;
    due: string;
}
export interface Completion {
    at: string;
    seconds: number;
    correct: number;
    total: number;
}
export interface Assessment {
    id: string;
    at: string;
    listeningChecked?:number;
    grammarChecked?:number;
    listening: number|null;
    grammar: number|null;
    writing: number;
    speaking: number;
}
export interface Progress {
    version: 1;
    started: string;
    completed: Record<string, Completion>;
    attempts: Attempt[];
    reviews: Record<string, Review>;
    assessments: Assessment[];
    practice: {
        at: string;
        seconds: number;
        lessonId?:string;
    }[];
    drafts: Record<string, string>;
    mode: number;
    exerciseStates: Record<string, LearningState>;
    lessonProgress:Record<string,LessonProgress>;
    assessmentProgress:Record<string,AssessmentProgress>;
    preferences?:Preferences;
    reviewIntervals: [
        number,
        number,
        number
    ];
}
export type LearningStage = 'INITIAL_ATTEMPTS' | 'RETEACH' | 'MASTERY' | 'TRANSFER' | 'REVIEW';
export interface LearningState {
    stage: LearningStage;
    failures: number;
    streak: number;
    answer: string;
    feedback: string;
    uncertain: boolean;
    deferred: boolean;
    masteredAt?: string;
    history: {
        answer: string;
        correct: boolean | null;
        at: string;
        stage: LearningStage;
    }[];
    hints: {
        at: string;
        kind: 'hint' | 'explanation' | 'transcript' | 'translation';
    }[];
}
export type LearningEvent = {
    type: 'answer';
    answer: string;
} | {
    type: 'beginMastery';
} | {
    type: 'explanation';
} | {
    type: 'hint';
} | {
    type: 'transcript';
} | {
    type: 'translation';
} | {
    type: 'defer';
} | {
    type: 'restart';
};

export interface LessonProgress {full?:boolean;startedAt:string;lastStep:string;spoken:boolean;spokenRatings:string[];seconds:number;}
export interface AssessmentProgress {finished?:boolean;step:number;answers:Record<string,string>;speaking:boolean;writingScore:string;speakingScore:string;}
export interface Preferences {engine:'kokoro'|'browser';neuralVoice:string;browserVoice:string;subtitles:boolean;}
