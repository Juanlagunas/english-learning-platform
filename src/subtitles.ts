export const SUBTITLES_KEY='compass-show-subtitles';
export function readSubtitlesPreference(storage?:Pick<Storage,'getItem'>):boolean {try{return (storage??localStorage).getItem(SUBTITLES_KEY)==='true';}catch{return false;}}
export function saveSubtitlesPreference(show:boolean,storage?:Pick<Storage,'setItem'>):boolean {try{(storage??localStorage).setItem(SUBTITLES_KEY,String(show));return true;}catch{return false;}}
