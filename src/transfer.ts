import type { Task } from './types';
// One bounded substitution pass: never replace a substring inside another word.
const replacements:Record<string,string>={
 'design team':'UX team','designs':'wireframes','designers':'researchers','designer':'researcher','design':'prototype','report':'brief','summary':'overview','figures':'estimates','budget':'funding','approval':'confirmation','security':'architecture','review':'check','reviewed':'checked','reviewing':'checking','reviews':'checks','launch':'release','release':'launch','prototype':'mockup','planning':'scheduling','planned':'scheduled','plans':'schedules','plan':'schedule','issue':'blocker','problem':'defect','chart':'diagram','screen':'page','feature':'function','Monday':'Tuesday','Friday':'Thursday','yesterday':'last week','tomorrow':'next week','goal':'objective','risks':'delivery risks','risk':'delivery risk','notes':'minutes','walk':'short run','dependency':'prerequisite','three months':'six weeks','repeat that':'repeat the last point','jump in':'interrupt','clarify':'explain','success':'a good outcome'
};
const lower=Object.fromEntries(Object.entries(replacements).map(([k,v])=>[k.toLowerCase(),v]));
const pattern=new RegExp('\\b('+Object.keys(replacements).sort((a,b)=>b.length-a.length).join('|')+')\\b','gi');
export function vary(text:string):string{
 return text.replace(pattern,word=>{const value=lower[word.toLowerCase()];return /^[A-Z]/.test(word)?value[0].toUpperCase()+value.slice(1):value;})
 .replace(/\ba (overview|objective)\b/gi,(_,noun:string)=>'an '+noun)
 .replace(/\ban (blocker|defect)\b/gi,(_,noun:string)=>'a '+noun);
}
export function withTransfer(t: Task): Task {
    if (t.kind === 'free')
        return t;
    const changed = vary(t.prompt);
    const alternatives = t.kind === 'rewrite' ? verifiedAlternatives(t.model) : [];
    return { ...t, answers: [...(t.answers ?? []), ...alternatives], transfer: { ...t, id: t.id + '-transfer', prompt: `Transfer · Project Orion UX team: ${changed === t.prompt ? 'In the next planning conversation, ' : ''}${changed}`, audio: t.audio ? `In the UX planning conversation: ${vary(t.audio)}` : undefined, translation:t.audio&&t.translation?`En la conversación de planificación UX: ${varySpanish(t.translation,t.audio)}`:undefined, options:t.kind==='reorder'?vary(t.model).replace(/[.?!]$/,'').split(' ').reverse():t.options?.map(vary), answers: [...(t.answers ?? []).map(vary), ...alternatives.map(vary)], model: vary(t.model), errorExample: t.errorExample ? vary(t.errorExample) : undefined, explanation: `Use the same structure with the new details. ${t.explanation}` } };
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
    if (model.includes('She coordinates the design team.'))
        alternatives.push('She coordinates the team of designers.');
    if (model.includes('I proposed a smaller release.'))
        alternatives.push('I suggested a smaller release.');
    if (model.includes('The team needs to decide.'))
        alternatives.push('The team has to decide.');
    if (model.includes('I will take the notes.'))
        alternatives.push("I'll take the notes.");
    return alternatives;
}

function varySpanish(text:string,english:string):string{
 const pairs:Record<string,string>={'equipo de diseño':'equipo de UX','diseñadores':'investigadores','diseñadora':'investigadora','diseñador':'investigador','diseños':'wireframes','diseño':'prototipo','informe':'brief','resumen':'panorama','cifras':'estimaciones','presupuesto':'financiamiento','aprobación':'confirmación','revisión':'verificación','revisando':'verificando','revisar':'verificar','plan':'cronograma','problema':'defecto','gráfica':'diagrama','pantalla':'página','lunes':'martes','viernes':'jueves','ayer':'la semana pasada','riesgos':'riesgos de entrega','riesgo':'riesgo de entrega','notas':'minuta','dependencia':'prerrequisito','primeros tres meses':'primeras seis semanas','los primeros tres meses':'las primeras seis semanas','salí a caminar':'salí a correr un poco'};
 const pattern=new RegExp('\\b('+Object.keys(pairs).sort((a,b)=>b.length-a.length).join('|')+')\\b','gi');
 let result=text.replace(pattern,w=>{const v=pairs[w.toLowerCase()];return /^[A-ZÁÉÍÓÚ]/.test(w)?v[0].toUpperCase()+v.slice(1):v;});
 if(/\btomorrow\b/i.test(english))result=result.replace(/\bmañana\b/gi,'la próxima semana');
 return result;
}
