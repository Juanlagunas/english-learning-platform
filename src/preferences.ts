import type {Preferences,Progress} from './types';
import {ENGINE_KEY,NEURAL_VOICE_KEY,readNeuralVoice,readSpeechEngine,isStoredVoice} from './neuralVoices';
import {VOICE_KEY,readVoicePreference} from './voices';
import {SUBTITLES_KEY,readSubtitlesPreference} from './subtitles';
export function readPreferences(storage?:Storage):Preferences|undefined{try{const s=storage??localStorage;s.getItem(ENGINE_KEY);return {engine:readSpeechEngine(s),neuralVoice:readNeuralVoice(s),browserVoice:readVoicePreference(s),subtitles:readSubtitlesPreference(s)};}catch{return undefined;}}
export function validPreferences(p:unknown):p is Preferences{if(typeof p!=='object'||!p)return false;const v=p as Preferences;return ['kokoro','browser'].includes(v.engine)&&isStoredVoice(v.neuralVoice)&&typeof v.browserVoice==='string'&&v.browserVoice.length<=1000&&typeof v.subtitles==='boolean';}
export function restorePreferences(p:Preferences,storage?:Storage):boolean{try{const s=storage??localStorage;s.setItem(ENGINE_KEY,'kokoro');s.setItem(NEURAL_VOICE_KEY,'af_sarah');s.setItem(VOICE_KEY,p.browserVoice);s.setItem(SUBTITLES_KEY,String(p.subtitles));return true;}catch{return false;}}
export function exportProgress(p:Progress,storage?:Storage):string{return JSON.stringify({...p,preferences:readPreferences(storage)},null,2);}
