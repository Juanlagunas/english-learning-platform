import type { Task } from './types';
// One bounded substitution pass: never replace a substring inside another word.
const replacements:Record<string,string>={
 'software team':'platform team','test results':'build results','test environment':'staging environment','core API':'core service','logs':'error logs','chart':'icon',
 'rice':'pasta','vegetables':'fruit','grocery list':'shopping list','sister':'brother','photo album':'family album','quiet spot':'shady spot','coffee':'tea','dinner':'lunch','my place':'my apartment','bike':'skateboard','bus':'train',
 'Monday':'Tuesday','Friday':'Thursday','Wednesday':'Tuesday','Thursday':'Wednesday','yesterday':'last week','tomorrow':'next week','two':'three','ten':'eleven','reviewed':'checked','reviewing':'checking','reviews':'checks','review':'check'
};
const lower=Object.fromEntries(Object.entries(replacements).map(([k,v])=>[k.toLowerCase(),v]));
const pattern=new RegExp('\\b('+Object.keys(replacements).sort((a,b)=>b.length-a.length).join('|')+')\\b','gi');
export function vary(text:string):string{
 return text.replace(pattern,word=>{const value=lower[word.toLowerCase()];return /^[A-Z]/.test(word)?value[0].toUpperCase()+value.slice(1):value;});
}
export function withTransfer(t: Task): Task {
    if (t.kind === 'free')
        return t;
    const context=t.context==='general'?'another fictional neighborhood':'another fictional software team';
    const translationContext=t.context==='general'?'otra comunidad ficticia':'otro equipo ficticio de software';
    const alternatives = t.kind === 'rewrite' ? verifiedAlternatives(t.model) : [];
    return { ...t, answers: [...(t.answers ?? []), ...alternatives], transfer: { ...t, id: t.id + '-transfer', prompt: `Transfer · ${context}: ${vary(t.prompt)}`, audio: t.audio ? `Here is a conversation in ${context}. ${vary(t.audio)}` : undefined, translation:t.audio&&t.translation?`Esta es una conversación en ${translationContext}. ${varySpanish(t.translation, t.audio)}`:undefined, options:t.kind==='reorder'?vary(t.model).replace(/[.?!]$/,'').split(' ').reverse():t.options?.map(vary), answers: [...(t.answers ?? []).map(vary), ...alternatives.map(vary)], model: vary(t.model), errorExample: t.errorExample ? vary(t.errorExample) : undefined, explanation: `Use the same structure with the new details. ${t.explanation}` } };
}

export function verifiedAlternatives(model: string): string[] {
    const alternatives = [];
    if (model.includes('need to'))
        alternatives.push(model.replace('need to', 'have to'));
    if (model.includes('needs to'))
        alternatives.push(model.replace('needs to', 'has to'));
    if (model.includes('Could you repeat that?'))
        alternatives.push('Could you say that again?');
    if (model.includes('Could you review the summary?'))
        alternatives.push('Could you check the summary?');
    if (model.includes('Please open the report we discussed.'))
        alternatives.push('Please open the report that we discussed.');
    if (model.includes('I am working on the launch plan.'))
        alternatives.push("I'm working on the launch plan.");
    if (model.includes('We need two more days for the checked version.'))
        alternatives.push('We need another two days for the checked version.');
    if (model.includes('She coordinates the software team.'))
        alternatives.push('She coordinates the team of software engineers.');
    if (model.includes('I proposed a smaller release.'))
        alternatives.push('I suggested a smaller release.');
    if (model.includes('The team needs to decide.'))
        alternatives.push('The team has to decide.');
    if (model.includes('I will take the notes.'))
        alternatives.push("I'll take the notes.");
    return alternatives;
}

function varySpanish(text:string,english:string):string{
 const pairs:Record<string,string>={'equipo pequeño de software':'equipo pequeño de plataforma','equipo de software':'equipo de plataforma','resultados de las pruebas':'resultados de la compilación','entorno de pruebas':'entorno de preproducción','la api principal':'el servicio principal','api principal':'servicio principal','registros':'registros de errores','la gráfica':'el icono','gráfica':'icono','arroz':'pasta','verduras':'fruta','lista de compras':'lista del supermercado','hermana':'hermano','álbum de fotos':'álbum familiar','lugar tranquilo':'lugar con sombra','café':'té','la cena':'el almuerzo','mi casa':'mi departamento','bicicleta':'patineta','autobús':'tren','lunes':'martes','viernes':'jueves','miércoles':'martes','jueves':'miércoles','ayer':'la semana pasada','dos':'tres','diez':'once','revisó':'verificó','revisando':'verificando','revisar':'verificar','revisión':'verificación'};
 const lowerPairs=Object.fromEntries(Object.entries(pairs).map(([k,v])=>[k.toLowerCase(),v]));
 const pattern=new RegExp('(?<![\\p{L}\\p{N}_])('+Object.keys(pairs).sort((a,b)=>b.length-a.length).join('|')+')(?![\\p{L}\\p{N}_])','giu');
 const result=text.replace(pattern,w=>{const v=lowerPairs[w.toLowerCase()];return /^[A-ZÁÉÍÓÚ]/.test(w)?v[0].toUpperCase()+v.slice(1):v;});
 return /\btomorrow\b/i.test(english)?result.replace(/\bmañana\b/gi,w=>/^[A-Z]/.test(w)?'La próxima semana':'la próxima semana'):result;
}
