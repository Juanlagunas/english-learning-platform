export const VOICE_KEY = 'compass-english-voice';
export const VOICE_SAMPLE = 'What are you working on this week? I am reviewing the UX design for Project Orion. We can finish by Friday.';
export type VoiceInfo = Pick<SpeechSynthesisVoice, 'name' | 'lang' | 'voiceURI' | 'default'>;
// SpeechSynthesis has no standardized naturalness flag. These are name hints,
// not a promise about quality; the learner can audition every available voice.
export function voiceRank(v: VoiceInfo): number {
    const us = /^en[-_]US$/i.test(v.lang), english = /^en(?:[-_]|$)/i.test(v.lang);
    return (us ? 10000 : english ? 1000 : 0) + (/natural|neural|enhanced|premium/i.test(v.name) ? 500 : 0) + (/google/i.test(v.name) ? 100 : 0) + (v.default ? 10 : 0);
}
export function englishVoices<T extends VoiceInfo>(voices: T[]): T[] { return voices.filter(v => /^en(?:[-_]|$)/i.test(v.lang)).sort((a, b) => voiceRank(b) - voiceRank(a) || a.name.localeCompare(b.name)); }
export function preferredVoice<T extends VoiceInfo>(voices: T[], uri: string): T | undefined { return voices.find(v => v.voiceURI === uri) ?? englishVoices(voices)[0]; }
export function readVoicePreference(storage?: Pick<Storage, 'getItem'>): string { try {
    return (storage??localStorage).getItem(VOICE_KEY) ?? '';
}
catch {
    return '';
} }
export function saveVoicePreference(uri: string, storage?: Pick<Storage, 'setItem'>): boolean { try {
    (storage??localStorage).setItem(VOICE_KEY, uri);
    return true;
}
catch {
    return false;
} }
