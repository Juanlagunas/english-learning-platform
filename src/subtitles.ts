export const SUBTITLES_KEY='compass-show-subtitles';
export function readSubtitlesPreference(storage:Pick<Storage,'getItem'>=localStorage):boolean {try{return storage.getItem(SUBTITLES_KEY)==='true';}catch{return false;}}
export function saveSubtitlesPreference(show:boolean,storage:Pick<Storage,'setItem'>=localStorage):boolean {try{storage.setItem(SUBTITLES_KEY,String(show));return true;}catch{return false;}}
