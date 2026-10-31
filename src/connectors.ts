export interface Connector {
    word: string;
    meaning: string;
    spanish: string;
    usage: string;
    contrast: string;
    example: string;
    before: string;
    after: string;
}
export const connectors: Connector[] = [
    ["and", "addition", "y", "Join two similar ideas or items.", "And adds; but contrasts.", "We reviewed the API contract and confirmed the response format.", "We reviewed the API contract", "confirmed the response format."],
    ["but", "contrast", "pero", "Join two contrasting clauses with a comma.", "But joins clauses; however usually starts a separate statement.", "The code is ready, but the API documentation needs an example.", "The code is ready,", "the API documentation needs an example."],
    ["because", "reason", "porque", "Introduce the reason with a subject and verb.", "Because gives a cause; so gives its result.", "We paused the deployment because an integration test failed.", "We paused the deployment", "an integration test failed."],
    ["so", "result", "así que", "Put the result after so.", "So is conversational; therefore is more formal.", "The test environment is unavailable, so testing cannot start.", "The test environment is unavailable,", "testing cannot start."],
    ["although", "concession", "aunque", "Use although + clause; do not add but to the main clause.", "Although makes one idea subordinate; but joins equal clauses.", "Although the change is small, we still need to test it.", "", "the change is small, we still need to test it."],
    ["however", "contrast across statements", "sin embargo", "Use a new sentence or a semicolon, then however with a comma.", "Unlike but, however is not a coordinating conjunction.", "The core API is ready;  however, the export feature needs more testing.", "The core API is ready; ", ", the export feature needs more testing."],
    ["therefore", "logical consequence", "por lo tanto", "Use with commas after a full stop or semicolon.", "Therefore stresses a logical conclusion; because gives its cause.", "Test-environment access is required;  therefore, testing must wait.", "Test-environment access is required; ", ", testing must wait."],
    ["first", "initial step", "primero", "Place at the start of the first step, usually with a comma.", "First opens a sequence; finally closes it.", "First, read the incident timeline.", "", ", read the incident timeline."],
    ["next", "following step", "después / a continuación", "Introduce the following action in a sequence.", "Next usually marks an ordered step; meanwhile marks overlapping actions.", "Next, check the service logs.", "", ", check the service logs."],
    ["then", "subsequent action", "luego", "Place before the action that follows.", "Then orders actions; also simply adds information.", "Confirm the API contract;  then run the integration tests.", "Confirm the API contract; ", "run the integration tests."],
    ["finally", "last step", "finalmente", "Introduce the last step of a sequence.", "Finally means last; it does not mean a consequence like therefore.", "Finally, confirm the deployment owner and date.", "", ", confirm the deployment owner and date."],
    ["also", "addition", "también", "Put before a main verb or after be; sentence-initial Also is possible.", "Also adds another fact; for example illustrates a fact.", "We also need a rollback plan before deployment.", "We", "need a rollback plan before deployment."],
    ["in addition", "further point", "además", "Use at the start of a sentence with a comma.", "In addition adds a point; on the other hand presents a competing view.", "In addition, we need to document the API response format.", "", ", we need to document the API response format."],
    ["for example", "illustration", "por ejemplo", "Introduce a specific example of a general statement.", "For example illustrates; because explains a cause.", "Some work can wait;  for example, the optional export feature can wait.", "Some work can wait; ", ", the optional export feature can wait."],
    ["as a result", "outcome", "como resultado", "Use as a result with a comma to introduce a consequence.", "As a result shows an outcome; meanwhile shows concurrent activity.", "We reduced the initial scope.  as a result, we delivered the core API on time.", "We reduced the initial scope. ", ", we delivered the core API on time."],
    ["meanwhile", "simultaneous activity", "mientras tanto", "Introduce something happening during the same period.", "Meanwhile means at the same time; next means afterward.", "The platform team is restoring the service.  meanwhile, we are checking the logs.", "The platform team is restoring the service. ", ", we are checking the logs."],
    ["on the other hand", "alternative perspective", "por otro lado", "Introduce a competing consideration, often after one side of a choice.", "On the other hand weighs perspectives; in addition supports the same direction.", "Microservices can support independent scaling.  on the other hand, they add operational complexity.", "Microservices can support independent scaling. ", ", they add operational complexity."]
].map(([word, meaning, spanish, usage, contrast, example, before, after]) => ({ word, meaning, spanish, usage, contrast, example, before, after }));

// Keep the grammar rule once; vary only the complete situational example.
function contextualExamples(pairs:[string,string][]):Connector[]{return connectors.map((c,i)=>{
 const [before,after]=pairs[i];
 const text=[before,c.word,after].filter(Boolean).join(' ').replace(/\s+([,;.])/g,'$1');
 const example=(text[0].toUpperCase()+text.slice(1)).replace(/([.!?] )([a-z])/g,(_,end:string,letter:string)=>end+letter.toUpperCase());
 return {...c,before,after,example};
});}
export const generalConnectors=contextualExamples([
 ['We bought groceries','made dinner.'],
 ['I like the apartment,','the rent is too high.'],
 ['We stayed home','it was raining.'],
 ['The bus was late,','I called my friend.'],
 ['', 'the store is busy, the line moves quickly.'],
 ['The cafe is close; ', ', it is closed today.'],
 ['The class is full; ', ', we need to choose another time.'],
 ['', ', check the address.'],
 ['', ', take the bus to the park.'],
 ['Buy the tickets; ', 'meet me at the entrance.'],
 ['', ', confirm the time with your friend.'],
 ['We', 'need some fruit for breakfast.'],
 ['', ', we need to bring water for the walk.'],
 ['There are several ways to get there; ', ', we can take the bus.'],
 ['We left early. ', ', we arrived before the crowd.'],
 ['My sister is making dinner. ', ', I am setting the table.'],
 ['I want to see our friends. ', ', we need a quiet evening.']
]);
export const technologyConnectors=connectors;
