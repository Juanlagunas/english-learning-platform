import {useCallback,useEffect,useRef,useState} from 'react';
import type {SetStateAction} from 'react';
import type {Progress} from './types';
import {loadProgress,saveProgress,parseProgress,STORAGE_KEY} from './engine';
import {allTasks} from './content';
import {reconcileProgress} from './progress';
import {restorePreferences} from './preferences';
export function useProgress(){
 const [initial]=useState(()=>{const loaded=loadProgress();const progress=reconcileProgress(loaded.progress,allTasks);let migrationError='';if(progress!==loaded.progress&&!loaded.error)try{saveProgress(progress);}catch{migrationError='Updated progress is only in this tab: browser storage is unavailable or full. Export Progress before closing.';}return {...loaded,progress,migrationError};});const current=useRef(initial.progress),blocked=useRef(Boolean(initial.error));
 const [progress,setState]=useState(initial.progress),[storageError,setError]=useState(initial.error??initial.migrationError);
 const update=useCallback((action:SetStateAction<Progress>):boolean=>{
  const next=typeof action==='function'?action(current.current):action;
  if(next===current.current)return !blocked.current;
  current.current=next;let saved=false;
  if(!blocked.current)try{saveProgress(next);saved=true;setError('');}catch{setError('Progress is only in this tab: browser storage is unavailable or full. Export Progress before closing.');}
  setState(next);return saved;
 },[]);
 useEffect(()=>{const changed=(event:StorageEvent)=>{if(event.key!==STORAGE_KEY)return;try{if(!event.newValue)throw new Error('removed');const next=reconcileProgress(parseProgress(event.newValue),allTasks);current.current=next;blocked.current=false;setState(next);setError('');}catch{blocked.current=true;setError('Stored progress changed or became unreadable in another tab. Saving is paused to protect your copy; Export Progress before restoring a valid backup.');}};window.addEventListener('storage',changed);return()=>window.removeEventListener('storage',changed);},[]);
 const replace=useCallback((next:Progress)=>{blocked.current=false;const saved=update(reconcileProgress(next,allTasks));if(next.preferences){const preferencesSaved=restorePreferences(next.preferences);window.dispatchEvent(new Event('compass-voice-changed'));window.dispatchEvent(new Event('compass-subtitles-changed'));if(!preferencesSaved)setError('Progress restored, but audio preferences could not be saved. Export a backup before closing.');return saved&&preferencesSaved;}return saved;},[update]);
 return {progress,update,replace,storageError};
}
