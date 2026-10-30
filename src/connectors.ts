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
    ['and', 'addition', 'y', 'Join two similar ideas or items.', 'And adds; but contrasts.', 'We reviewed the plan and confirmed the date.', 'We reviewed the plan', 'confirmed the date.'],
    ['but', 'contrast', 'pero', 'Join two contrasting clauses with a comma.', 'But joins clauses; however usually starts a separate statement.', 'The design is ready, but the budget is not.', 'The design is ready,', 'the budget is not.'],
    ['because', 'reason', 'porque', 'Introduce the reason with a subject and verb.', 'Because gives a cause; so gives its result.', 'We paused the release because the test failed.', 'We paused the release', 'the test failed.'],
    ['so', 'result', 'así que', 'Put the result after so.', 'So is conversational; therefore is more formal.', 'The test failed, so we paused the release.', 'The test failed,', 'we paused the release.'],
    ['although', 'concession', 'aunque', 'Use although + clause; do not add but to the main clause.', 'Although makes one idea subordinate; but joins equal clauses.', 'Although time is short, we can test the core feature.', '', 'time is short, we can test the core feature.'],
    ['however', 'contrast across statements', 'sin embargo', 'Use a new sentence or a semicolon, then however with a comma.', 'Unlike but, however is not a coordinating conjunction.', 'The draft is ready; however, the figures need checking.', 'The draft is ready; ', ', the figures need checking.'],
    ['therefore', 'logical consequence', 'por lo tanto', 'Use with commas after a full stop or semicolon.', 'Therefore stresses a logical conclusion; because gives its cause.', 'Approval is required; therefore, testing must wait.', 'Approval is required; ', ', testing must wait.'],
    ['first', 'initial step', 'primero', 'Place at the start of the first step, usually with a comma.', 'First opens a sequence; finally closes it.', 'First, read the project summary.', '', ', read the project summary.'],
    ['next', 'following step', 'después / a continuación', 'Introduce the following action in a sequence.', 'Next usually marks an ordered step; meanwhile marks overlapping actions.', 'Next, check the open risks.', '', ', check the open risks.'],
    ['then', 'subsequent action', 'luego', 'Place before the action that follows.', 'Then orders actions; also simply adds information.', 'Read the summary; then check the figures.', 'Read the summary; ', 'check the figures.'],
    ['finally', 'last step', 'finalmente', 'Introduce the last step of a sequence.', 'Finally means last; it does not mean a consequence like therefore.', 'Finally, confirm the owner and date.', '', ', confirm the owner and date.'],
    ['also', 'addition', 'también', 'Put before a main verb or after be; sentence-initial Also is possible.', 'Also adds another fact; for example illustrates a fact.', 'We also need a backup plan.', 'We', 'need a backup plan.'],
    ['in addition', 'further point', 'además', 'Use at the start of a sentence with a comma.', 'In addition adds a point; on the other hand presents a competing view.', 'In addition, we need budget approval.', '', ', we need budget approval.'],
    ['for example', 'illustration', 'por ejemplo', 'Introduce a specific example of a general statement.', 'For example illustrates; because explains a cause.', 'Some tasks can wait; for example, the optional chart can wait.', 'Some tasks can wait; ', ', the optional chart can wait.'],
    ['as a result', 'outcome', 'como resultado', 'Use as a result with a comma to introduce a consequence.', 'As a result shows an outcome; meanwhile shows concurrent activity.', 'We reduced the scope. As a result, we finished on time.', 'We reduced the scope. ', ', we finished on time.'],
    ['meanwhile', 'simultaneous activity', 'mientras tanto', 'Introduce something happening during the same period.', 'Meanwhile means at the same time; next means afterward.', 'The designer is revising the draft. Meanwhile, we are checking costs.', 'The designer is revising the draft. ', ', we are checking costs.'],
    ['on the other hand', 'alternative perspective', 'por otro lado', 'Introduce a competing consideration, often after one side of a choice.', 'On the other hand weighs perspectives; in addition supports the same direction.', 'A fast release brings feedback. On the other hand, support needs preparation time.', 'A fast release brings feedback. ', ', support needs preparation time.']
].map(([word, meaning, spanish, usage, contrast, example, before, after]) => ({ word, meaning, spanish, usage, contrast, example, before, after }));
