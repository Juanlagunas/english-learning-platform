import {afterEach,describe,it,expect,vi} from 'vitest';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Audio} from '../src/Audio';
import {readSubtitlesPreference,saveSubtitlesPreference,SUBTITLES_KEY} from '../src/subtitles';
afterEach(()=>vi.unstubAllGlobals());
describe('optional English subtitles',()=>{
 it('starts hidden and saves both show and hide preferences',()=>{const data=new Map<string,string>();const storage={getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);}};expect(readSubtitlesPreference(storage)).toBe(false);expect(saveSubtitlesPreference(true,storage)).toBe(true);expect(data.get(SUBTITLES_KEY)).toBe('true');expect(readSubtitlesPreference(storage)).toBe(true);saveSubtitlesPreference(false,storage);expect(readSubtitlesPreference(storage)).toBe(false);});
 it('handles denied browser storage with an honest in-memory fallback',()=>{expect(readSubtitlesPreference({getItem:()=>{throw new Error('denied');}})).toBe(false);expect(saveSubtitlesPreference(true,{setItem:()=>{throw new Error('denied');}})).toBe(false);});
 it('renders the exact English utterance only when enabled; Spanish stays independent',()=>{vi.stubGlobal('window',{});const text='When do you expect to finish? We can finish by Friday.';const translation='¿Cuándo esperan terminar? Podemos terminar para el viernes.';vi.stubGlobal('localStorage',{getItem:()=>null});let html=renderToStaticMarkup(createElement(Audio,{text,translation}));expect(html).toContain('Show Subtitles');expect(html).not.toContain(text);expect(html).not.toContain(translation);vi.stubGlobal('localStorage',{getItem:(key:string)=>key===SUBTITLES_KEY?'true':null});html=renderToStaticMarkup(createElement(Audio,{text,translation}));expect(html).toContain('Hide Subtitles');expect(html).toContain('aria-label="English subtitles"');expect(html).toContain(text);expect(html).not.toContain(translation);});
});
