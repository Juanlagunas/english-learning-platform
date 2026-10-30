import type {NeuralVoice} from './neuralVoices';
export type SynthRequest={type:'generate';id:number;text:string;voice:NeuralVoice;speed:number}|{type:'cancel';id:number};
export type SynthResponse={type:'status';id:number;message:string}|{type:'audio';id:number;blob:Blob}|{type:'error';id:number;message:string};
