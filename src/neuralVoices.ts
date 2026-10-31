export const NEURAL_VOICES=[{id:'af_sarah',name:'Sarah',gender:'Female',note:'American English'}] as const;
export type NeuralVoice='af_sarah';
export type SpeechEngine='kokoro'|'browser'; // Old exports may still contain browser preferences.
export const NEURAL_VOICE_KEY='lagunas-kokoro-voice';
export const ENGINE_KEY='lagunas-speech-engine';
export function isNeuralVoice(id:unknown):id is NeuralVoice{return id==='af_sarah';}
export function isStoredVoice(id:unknown):boolean{return ['af_sarah','af_heart','af_bella','am_michael','am_puck'].includes(id as string);}
export function readNeuralVoice(_storage?:Pick<Storage,'getItem'>):NeuralVoice{void _storage;return 'af_sarah';}
export function readSpeechEngine(_storage?:Pick<Storage,'getItem'>):SpeechEngine{void _storage;return 'kokoro';}
export function saveNeuralPreference(key:typeof ENGINE_KEY|typeof NEURAL_VOICE_KEY,value:string,storage?:Pick<Storage,'setItem'>):boolean{try{(storage??localStorage).setItem(key,value);return true;}catch{return false;}}
