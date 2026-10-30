import {useEffect,useState,useRef} from 'react';
import {Volume2,Square} from 'lucide-react';
import {readSubtitlesPreference,saveSubtitlesPreference} from './subtitles';
import {englishVoices,preferredVoice,readVoicePreference,saveVoicePreference,VOICE_SAMPLE} from './voices';
import {NEURAL_VOICES,NEURAL_VOICE_KEY,ENGINE_KEY,readNeuralVoice,readSpeechEngine,saveNeuralPreference} from './neuralVoices';
import type {NeuralVoice,SpeechEngine} from './neuralVoices';
import {generateKokoro} from './kokoroClient';
export function Audio({text,translation,onHelp}:{text:string;translation?:string;onHelp?:(kind:'transcript'|'translation')=>void}){
 const supported='speechSynthesis' in window;
 const [voices,setVoices]=useState<SpeechSynthesisVoice[]>([]);
 const [saved,setSaved]=useState(readVoicePreference),[candidate,setCandidate]=useState(readVoicePreference);
 const [engine,setEngine]=useState(readSpeechEngine),[neural,setNeural]=useState(readNeuralVoice);
 const [rate,setRate]=useState('1'),[status,setStatus]=useState(''),[preferenceStatus,setPreferenceStatus]=useState('');
 const [transcript,setTranscript]=useState(readSubtitlesPreference),[translated,setTranslated]=useState(false);
 const [samplePlaying,setSamplePlaying]=useState(false),[subtitleStatus,setSubtitleStatus]=useState('');
 const [readyToPlay,setReadyToPlay]=useState(false),[busy,setBusy]=useState(false);
 const helpCallback=useRef(onHelp);helpCallback.current=onHelp;
 const player=useRef<HTMLAudioElement>(null),objectUrl=useRef<string|null>(null),request=useRef<AbortController|null>(null),ticket=useRef(0),isSample=useRef(false),spokenVoice=useRef('Sarah');
 function stop(message?:string){ticket.current++;request.current?.abort();request.current=null;player.current?.pause();if(player.current){player.current.removeAttribute('src');player.current.load();}if(objectUrl.current){URL.revokeObjectURL(objectUrl.current);objectUrl.current=null;}if(supported)speechSynthesis.cancel();setReadyToPlay(false);setBusy(false);if(message)setStatus(message);}
 useEffect(()=>{if(transcript)helpCallback.current?.('transcript');},[transcript]);
 useEffect(()=>{
  const syncSubtitles=()=>setTranscript(readSubtitlesPreference());
  const syncVoices=()=>{const preference=readVoicePreference();setSaved(preference);setCandidate(preference);setEngine(readSpeechEngine());setNeural(readNeuralVoice());};
  const stopAll=()=>stop();
  const update=()=>setVoices(englishVoices(speechSynthesis.getVoices()));
  window.addEventListener('compass-subtitles-changed',syncSubtitles);window.addEventListener('compass-voice-changed',syncVoices);window.addEventListener('lagunas-stop-audio',stopAll);
  if(supported){update();speechSynthesis.addEventListener('voiceschanged',update);}
  return()=>{window.removeEventListener('compass-subtitles-changed',syncSubtitles);window.removeEventListener('compass-voice-changed',syncVoices);window.removeEventListener('lagunas-stop-audio',stopAll);if(supported)speechSynthesis.removeEventListener('voiceschanged',update);stop();};
 // Speech support does not change during the lifetime of a mounted player.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[supported]);
 function preference(key:typeof ENGINE_KEY|typeof NEURAL_VOICE_KEY,value:string){const ok=saveNeuralPreference(key,value);if(ok)window.dispatchEvent(new Event('compass-voice-changed'));setPreferenceStatus(ok?'Preference saved for this browser.':'Applied for now. Browser storage is unavailable, so the preference cannot be saved.');}
 function chooseEngine(value:SpeechEngine){stop();setEngine(value);preference(ENGINE_KEY,value);}
 async function play(sample=false,voiceOverride?:NeuralVoice){
  window.dispatchEvent(new Event('lagunas-stop-audio'));
  const token=++ticket.current;spokenVoice.current=NEURAL_VOICES.find(v=>v.id===(voiceOverride??neural))!.name;isSample.current=sample;setSamplePlaying(sample);setReadyToPlay(false);
  const utterance=sample?VOICE_SAMPLE:text;
  if(engine==='browser'&&!voiceOverride){
   if(!supported){setStatus('Browser speech is unavailable. Choose Kokoro or Show Subtitles.');return;}
   const u=new SpeechSynthesisUtterance(utterance);u.lang='en-US';u.rate=Number(rate);const selected=preferredVoice(voices,sample?candidate:saved);if(selected){u.voice=selected;u.lang=selected.lang;}
   u.onstart=()=>{if(token===ticket.current)setStatus(sample?'Playing voice sample…':'Playing browser voice…');};u.onend=()=>{if(token===ticket.current)setStatus(sample?'Sample finished. Use this voice if you like it.':'Finished. Play again any time.');};u.onerror=e=>{if(token===ticket.current)setStatus(`Browser audio unavailable (${e.error}). Choose Kokoro or Show Subtitles.`);};setStatus('Starting browser speech…');speechSynthesis.speak(u);return;
  }
  const abort=new AbortController();request.current=abort;setBusy(true);
  setStatus('Preparing Kokoro. First use downloads a voice model (~90–330 MB) plus speech files.');
  try{
   const blob=await generateKokoro(utterance,voiceOverride??neural,Number(rate),s=>{if(token===ticket.current)setStatus(s);},abort.signal);
   if(token!==ticket.current||abort.signal.aborted||!player.current)return;
   setBusy(false);objectUrl.current=URL.createObjectURL(blob);player.current.src=objectUrl.current;
   try{await player.current.play();if(token===ticket.current)setStatus(sample?`Playing ${spokenVoice.current} voice sample…`:`Playing ${spokenVoice.current} · Kokoro…`);}
   catch(error){if(token===ticket.current){if(error instanceof DOMException&&error.name==='NotAllowedError'){setReadyToPlay(true);setStatus('Audio is ready. Press Play ready audio to allow playback in this browser.');}else setStatus('Audio could not play. Try again or choose Browser voice (backup).');}}
  }catch(error){if(token!==ticket.current||abort.signal.aborted)return;setBusy(false);setStatus(`Kokoro is unavailable: ${error instanceof Error?error.message:'generation failed'}. Try again or choose Browser voice (backup). Your selected engine has not been changed.`);}
 }
 const selected=preferredVoice(voices,candidate),current=preferredVoice(voices,saved);
 const name=NEURAL_VOICES.find(v=>v.id===neural)!.name;
 return <div className="audio">
  <div className="audio-controls"><button className="listen" disabled={busy} onClick={()=>void play()}><Volume2 size={20}/> Play / replay</button><button className="icon-button" aria-label="Stop audio" onClick={()=>stop('Stopped.')}><Square size={16}/></button><label>Speed<select value={rate} onChange={e=>{stop();setRate(e.target.value);}}><option value="1">1.0× — normal</option><option value="0.85">0.85× — slower</option></select></label></div>
  <details className="voice-picker"><summary>Voice: {engine==='kokoro'?`${name} · Kokoro`:current?.name??'browser default'}</summary>
   <label>Speech engine<select value={engine} onChange={e=>chooseEngine(e.target.value as SpeechEngine)}><option value="kokoro">Kokoro · neural voices</option><option value="browser">Browser voice (backup)</option></select></label>
   {engine==='kokoro'?<><p className="muted">Compare five US English voices using the same sentence. Sarah is the default. A clear voice you enjoy is more useful than choosing by gender. Try another speaker sometimes.</p><div className="neural-voices">{NEURAL_VOICES.map(v=><div className={neural===v.id?'neural-voice chosen':'neural-voice'} key={v.id}><div><strong>{v.name}</strong><small>{v.gender} · US English</small><small>{v.note}</small></div><div className="button-row"><button disabled={busy} aria-label={`Preview ${v.name}`} onClick={()=>void play(true,v.id)}>Listen</button><button aria-label={`Use ${v.name}`} aria-pressed={neural===v.id} onClick={()=>{setNeural(v.id);preference(NEURAL_VOICE_KEY,v.id);}}>{neural===v.id?'Selected':'Use voice'}</button></div></div>)}</div></>:<><label>Available English voices<select value={selected?.voiceURI??''} onChange={e=>setCandidate(e.target.value)}>{!voices.length&&<option value="">No English voice available</option>}{voices.map(v=><option key={v.voiceURI} value={v.voiceURI}>{v.name} · {v.lang}</option>)}</select></label><div className="button-row"><button disabled={!selected} onClick={()=>void play(true)}>Preview voice sample</button><button disabled={!selected} onClick={()=>{if(!selected)return;setSaved(selected.voiceURI);setCandidate(selected.voiceURI);const ok=saveVoicePreference(selected.voiceURI);if(ok)window.dispatchEvent(new Event('compass-voice-changed'));setPreferenceStatus(ok?'Voice saved for this browser.':'Voice applied for now; storage is unavailable.');}}>Use this voice</button></div>{!supported&&<p>Browser speech is unavailable here. Choose Kokoro or Show Subtitles.</p>}</>}
   <p role="status" className="muted">{preferenceStatus}</p>
  </details>
  <small>{engine==='kokoro'?'Kokoro generates speech on your device. First play downloads ~90–330 MB of model data plus runtime and voice files from public hosting; the browser can cache them. No paid API or microphone.':'Browser-generated speech. Some voices require an internet connection. No paid service or microphone.'}</small>
  <span role="status" className="audio-status">{status}</span>
  <audio ref={player} onEnded={()=>setStatus(isSample.current?`${spokenVoice.current} sample finished. Choose Use voice to save it.`:`${spokenVoice.current} finished. Play again any time.`)} onError={()=>{if(objectUrl.current)setStatus('Audio could not play. Try again or choose Browser voice (backup).');}}/>
  {readyToPlay&&<button onClick={()=>{void player.current?.play().then(()=>{setReadyToPlay(false);setStatus('Playing Kokoro…');}).catch(()=>setStatus('Playback is blocked. Try another browser or Show Subtitles.'));}}>Play ready audio</button>}
  <div className="button-row"><button className="text-button" aria-expanded={transcript} onClick={()=>{const show=!transcript;setTranscript(show);const ok=saveSubtitlesPreference(show);if(ok)window.dispatchEvent(new Event('compass-subtitles-changed'));setSubtitleStatus(ok?'':'Subtitles changed for now; browser storage is unavailable.');}}>{transcript?'Hide Subtitles':'Show Subtitles'}</button>{translation&&<button className="text-button" aria-expanded={translated} onClick={()=>{if(!translated)onHelp?.('translation');setTranslated(!translated);}}>{translated?'Hide Spanish translation':'Show Spanish translation'}</button>}</div>
  {subtitleStatus&&<p role="status" className="muted">{subtitleStatus}</p>}{transcript&&<p className="transcript" aria-label="English subtitles">{samplePlaying?VOICE_SAMPLE:text}</p>}{translated&&<p className="spanish">{samplePlaying?'¿En qué estás trabajando esta semana? Estoy revisando el diseño UX de Project Orion. Podemos terminar para el viernes.':translation}</p>}
 </div>;
}
