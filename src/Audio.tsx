import { useEffect, useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import { englishVoices, preferredVoice, readVoicePreference, saveVoicePreference, VOICE_SAMPLE } from './voices';
export function Audio({ text, translation, onHelp }: {
    text: string;
    translation?: string;
    onHelp?: (kind: 'transcript' | 'translation') => void;
}) {
    const supported = 'speechSynthesis' in window;
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [saved, setSaved] = useState(readVoicePreference);
    const [candidate, setCandidate] = useState(readVoicePreference);
    const [rate, setRate] = useState('1');
    const [status, setStatus] = useState('');
    const [preferenceStatus, setPreferenceStatus] = useState('');
    const [transcript, setTranscript] = useState(false);
    const [translated, setTranslated] = useState(false);
    useEffect(() => { if (!supported)
        return; const update = () => setVoices(englishVoices(speechSynthesis.getVoices())); const sync = () => { const preference = readVoicePreference(); setSaved(preference); setCandidate(preference); }; update(); speechSynthesis.addEventListener('voiceschanged', update); window.addEventListener('compass-voice-changed', sync); return () => { speechSynthesis.removeEventListener('voiceschanged', update); window.removeEventListener('compass-voice-changed', sync); speechSynthesis.cancel(); }; }, [supported]);
    function play(sample = false) { if (!supported)
        return; speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(sample ? VOICE_SAMPLE : text); u.lang = 'en-US'; u.rate = Number(rate); const selected = preferredVoice(voices, sample ? candidate : saved); if (selected) {
        u.voice = selected;
        u.lang = selected.lang;
    } u.onstart = () => setStatus(sample ? 'Playing voice sample…' : 'Playing…'); u.onend = () => setStatus(sample ? 'Sample finished. Use this voice if you like it.' : 'Finished. Play again any time.'); u.onerror = e => setStatus(`Audio unavailable (${e.error}). Reveal the text, or try another installed English voice.`); setStatus('Starting audio. If it stays silent, reveal the text and try another voice or browser.'); speechSynthesis.speak(u); }
    const selected = preferredVoice(voices, candidate);
    const current = preferredVoice(voices, saved);
    const missing = Boolean(saved) && !voices.some(v => v.voiceURI === saved);
    return <div className="audio"><div className="audio-controls"><button className="listen" onClick={() => play()} disabled={!supported}><Volume2 size={20}/> Play / replay</button><button className="icon-button" aria-label="Stop audio" disabled={!supported} onClick={() => { speechSynthesis.cancel(); setStatus('Stopped.'); }}><Square size={16}/></button><label>Speed<select value={rate} onChange={e => setRate(e.target.value)}><option value="1">1.0× — normal</option><option value="0.85">0.85× — slower</option></select></label></div>
 {supported && <details className="voice-picker"><summary>Voice: {current?.name ?? 'browser default'}</summary><label>Available English voices<select value={selected?.voiceURI ?? ''} onChange={e => { setCandidate(e.target.value); setPreferenceStatus('Preview the sample, then choose Use this voice.'); }}>{voices.length === 0 && <option value="">No English voice available</option>}{voices.map((v, i) => <option key={v.voiceURI} value={v.voiceURI}>{v.name} · {v.lang}{i === 0 ? ' · recommended' : ''}</option>)}</select></label><div className="button-row"><button disabled={!selected} onClick={() => play(true)}>Preview voice sample</button><button disabled={!selected} onClick={() => { if (!selected)
        return; setSaved(selected.voiceURI); setCandidate(selected.voiceURI); const persisted = saveVoicePreference(selected.voiceURI); if (persisted)
        window.dispatchEvent(new Event('compass-voice-changed')); setPreferenceStatus(persisted ? 'Voice saved for this browser.' : 'Voice applied for now. Browser storage is unavailable, so it cannot be saved.'); }}>Use this voice</button></div><p role="status" className="muted">{preferenceStatus}</p><small>US English voices are listed first. “Recommended” uses voice names as hints; preview to choose what sounds best. Naturalness depends on your browser and installed voices.</small></details>}
 <small>Browser-generated speech. Some voices need an internet connection. No paid service or microphone is used.</small>{(!supported || voices.length === 0 || missing) && <p role="status">{!supported ? 'Speech is unavailable here. Use the text alternative or try another browser.' : missing ? 'Your saved voice is unavailable on this device. Using the best available English voice; you can choose another.' : 'No suitable English voice is listed. Install an English system voice or use the text alternative.'}</p>}<span role="status" className="audio-status">{status}</span><div className="button-row"><button className="text-button" aria-expanded={transcript} onClick={() => { if (!transcript)
        onHelp?.('transcript'); setTranscript(!transcript); }}>{transcript ? 'Hide transcript' : 'Show transcript / text fallback'}</button>{translation && <button className="text-button" aria-expanded={translated} onClick={() => { if (!translated)
        onHelp?.('translation'); setTranslated(!translated); }}>{translated ? 'Hide Spanish translation' : 'Show Spanish translation'}</button>}</div>{transcript && <p className="transcript">{text}</p>}{translated && <p className="spanish">{translation}</p>}</div>;
}
