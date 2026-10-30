import type {NeuralVoice} from './neuralVoices';
import type {SynthRequest,SynthResponse} from './kokoroProtocol';
export interface SpeechWorker {
 postMessage:(message:SynthRequest)=>void;
 terminate:()=>void;
 onmessage:((event:MessageEvent<SynthResponse>)=>void)|null;
 onerror:((event:ErrorEvent)=>void)|null;
}
interface Pending {resolve:(b:Blob)=>void;reject:(e:Error)=>void;status:(s:string)=>void;cleanup:()=>void;}
export function createKokoroClient(makeWorker:()=>SpeechWorker){
 let worker:SpeechWorker|undefined;let serial=0;
 const pending=new Map<number,Pending>();const cache=new Map<string,Blob>();
 function failAll(message:string){for(const p of pending.values()){p.cleanup();p.reject(new Error(message));}pending.clear();worker?.terminate();worker=undefined;}
 function getWorker(){if(!worker){worker=makeWorker();worker.onmessage=({data})=>{const p=pending.get(data.id);if(!p)return;if(data.type==='status')p.status(data.message);else{pending.delete(data.id);p.cleanup();if(data.type==='audio')p.resolve(data.blob);else p.reject(new Error(data.message));}};worker.onerror=()=>failAll('The speech worker could not run. Try again or use the browser voice.');}return worker;}
 return {generate(text:string,voice:NeuralVoice,speed:number,onStatus:(s:string)=>void,signal:AbortSignal):Promise<Blob>{
  if(signal.aborted)return Promise.reject(new DOMException('Stopped','AbortError'));
  const key=JSON.stringify([text,voice,speed]);const cached=cache.get(key);if(cached)return Promise.resolve(cached);
  const current=getWorker();const id=++serial;
  // One speaker at a time; a new request supersedes an older preview.
  for(const [old,p]of pending){p.cleanup();p.reject(new DOMException('Superseded','AbortError'));current.postMessage({type:'cancel',id:old});}pending.clear();
  return new Promise<Blob>((resolve,reject)=>{
   const stop=()=>{pending.delete(id);clearTimeout(timeout);current.postMessage({type:'cancel',id});reject(new DOMException('Stopped','AbortError'));};
   const timeout=setTimeout(()=>{pending.delete(id);signal.removeEventListener('abort',stop);current.postMessage({type:'cancel',id});reject(new Error('Speech is taking too long. Retry or use the browser voice.'));},240000);
   pending.set(id,{resolve:blob=>{cache.set(key,blob);if(cache.size>8)cache.delete(cache.keys().next().value!);resolve(blob);},reject,status:onStatus,cleanup:()=>{clearTimeout(timeout);signal.removeEventListener('abort',stop);}});
   signal.addEventListener('abort',stop,{once:true});current.postMessage({type:'generate',id,text,voice,speed});
  });
 },dispose(){failAll('Speech engine closed.');cache.clear();}};
}
let client:ReturnType<typeof createKokoroClient>|undefined;
export function generateKokoro(text:string,voice:NeuralVoice,speed:number,onStatus:(s:string)=>void,signal:AbortSignal){
 client??=createKokoroClient(()=>new Worker(new URL('./kokoro.worker.ts',import.meta.url),{type:'module'}) as unknown as SpeechWorker);
 return client.generate(text,voice,speed,onStatus,signal);
}
