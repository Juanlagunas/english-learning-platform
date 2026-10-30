export const NEURAL_VOICES = [
  {id:'af_sarah',name:'Sarah',gender:'Female',note:'Your default voice'},
  {id:'af_heart',name:'Heart',gender:'Female',note:'Another voice to compare'},
  {id:'af_bella',name:'Bella',gender:'Female',note:'Another starting option'},
  {id:'am_michael',name:'Michael',gender:'Male',note:'Compare a male voice'},
  {id:'am_puck',name:'Puck',gender:'Male',note:'A second male option'},
] as const;
export type NeuralVoice=typeof NEURAL_VOICES[number]['id'];
export type SpeechEngine='kokoro'|'browser';
export const NEURAL_VOICE_KEY='lagunas-kokoro-voice';
export const ENGINE_KEY='lagunas-speech-engine';
export function isNeuralVoice(id:unknown):id is NeuralVoice{return NEURAL_VOICES.some(v=>v.id===id);}
export function readNeuralVoice(storage:Pick<Storage,'getItem'>=localStorage):NeuralVoice{try{const id=storage.getItem(NEURAL_VOICE_KEY);return isNeuralVoice(id)?id:'af_sarah';}catch{return 'af_sarah';}}
export function readSpeechEngine(storage:Pick<Storage,'getItem'>=localStorage):SpeechEngine{try{return storage.getItem(ENGINE_KEY)==='browser'?'browser':'kokoro';}catch{return 'kokoro';}}
export function saveNeuralPreference(key:typeof ENGINE_KEY|typeof NEURAL_VOICE_KEY,value:string,storage:Pick<Storage,'setItem'>=localStorage):boolean{try{storage.setItem(key,value);return true;}catch{return false;}}
