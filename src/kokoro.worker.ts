/// <reference lib="webworker" />
import {KokoroTTS} from 'kokoro-js';
import {env} from '@huggingface/transformers';
import type {SynthRequest,SynthResponse} from './kokoroProtocol';
const scope=self as unknown as DedicatedWorkerGlobalScope;
env.allowLocalModels=false;
// Pages cannot set COOP/COEP response headers: one WASM thread works without them.
if(env.backends.onnx.wasm)env.backends.onnx.wasm.numThreads=1;
let model:Promise<KokoroTTS>|undefined;
let active=0;
function send(message:SynthResponse){scope.postMessage(message);}
async function getModel(id:number){
 if(!model)model=(async()=>{
  let fast=false;
  try{fast=Boolean(await (navigator as Navigator & {gpu?:{requestAdapter:()=>Promise<unknown>}}).gpu?.requestAdapter());}catch{/* Use the compatible CPU path. */}
  send({type:'status',id:active,message:fast?'Preparing accelerated voice model (~330 MB on first use)…':'Preparing compatible voice model (~90 MB on first use); this device may take longer.'});
  return KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX',{
   dtype:fast?'fp32':'q8',device:fast?'webgpu':'wasm',progress_callback:p=>{
    if(p.status==='progress'&&p.file.endsWith('.onnx'))send({type:'status',id:active,message:`Downloading voice model: ${Math.round(p.progress)}%`});
    else if(p.status==='ready')send({type:'status',id:active,message:'Voice model ready. Generating speech…'});
   }
  });
 })().catch(error=>{model=undefined;throw error;});
 send({type:'status',id,message:'Preparing neural speech…'});
 return model;
}
let queue=Promise.resolve();
scope.onmessage=(event:MessageEvent<SynthRequest>)=>{
 const request=event.data;
 if(request.type==='cancel'){if(active===request.id)active=0;return;}
 active=request.id;
 queue=queue.then(async()=>{
  try{
   if(active!==request.id)return;
   const tts=await getModel(request.id);
   if(active!==request.id)return;
   send({type:'status',id:request.id,message:'Generating speech on this device…'});
   const audio=await tts.generate(request.text,{voice:'af_sarah',speed:request.speed});
   if(active===request.id)send({type:'audio',id:request.id,blob:audio.toBlob()});
  }catch(error){send({type:'error',id:request.id,message:error instanceof Error?error.message:'Speech generation failed.'});}
 });
};
