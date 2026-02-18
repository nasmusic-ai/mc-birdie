
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Simple cache for AudioBuffers to reduce API calls for repetitive phrases
const audioBufferCache = new Map<string, AudioBuffer>();

// Audio Decoding Helper
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Fallback to native browser speech synthesis if Gemini API is unavailable (e.g., 429 Quota Exceeded)
 */
const speakNativeFallback = (text: string) => {
  if (!window.speechSynthesis) return;
  
  // Clean the text of prompt-specific instructions like "Say cheerfully:"
  const cleanText = text.replace(/^(Say \w+: )/i, '').trim();
  
  const utterance = new SpeechSynthesisUtterance(cleanText);
  // Try to find a voice that sounds okay, or just use default
  const voices = window.speechSynthesis.getVoices();
  // 'en-GB' often sounds slightly more appropriate for our Scottish theme than 'en-US'
  const britishVoice = voices.find(v => v.lang.startsWith('en-GB'));
  if (britishVoice) utterance.voice = britishVoice;
  
  utterance.pitch = 0.9; // Slightly lower pitch for a grittier feel
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
};

export const speakCommentary = async (event: 'START' | 'SCORE' | 'DEATH' | 'LEVEL_UP', score?: number, level?: number) => {
  const prompts = {
    START: "Say cheerfully: Aye, let's see if this wee birdie can actually fly! Good luck, lad!",
    SCORE: `Say sarcastically: ${score} points? Not bad for a featherweight, but don't get cocky!`,
    DEATH: "Say mockingly: Down in the dirt! That's a classic Scottish crash landing, that is. Try again, ya numpty!",
    LEVEL_UP: `Say excitedly: Level ${level}! Look at ya go, flyin' faster than a highland gale!`
  };

  const promptText = prompts[event];

  // 1. Check Cache first
  if (audioBufferCache.has(promptText)) {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const cachedBuffer = audioBufferCache.get(promptText)!;
    const source = audioCtx.createBufferSource();
    source.buffer = cachedBuffer;
    source.connect(audioCtx.destination);
    source.start();
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: promptText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      speakNativeFallback(promptText);
      return;
    }

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const audioBuffer = await decodeAudioData(
      decodeBase64(base64Audio),
      audioCtx,
      24000,
      1
    );

    // Store in cache for future use (useful for START and DEATH which repeat exactly)
    audioBufferCache.set(promptText, audioBuffer);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();
  } catch (error: any) {
    console.warn("Gemini TTS Unavailable (likely quota), using fallback:", error?.message || error);
    // 2. Fallback to native browser Speech Synthesis
    speakNativeFallback(promptText);
  }
};
