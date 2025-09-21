const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Bella's Voice ID

let currentAudio: HTMLAudioElement | null = null;

export const textToSpeech = async (text: string): Promise<void> => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = '';
    currentAudio = null;
  }

  if (!ELEVENLABS_API_KEY) {
    console.error('ElevenLabs API key not found.');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    currentAudio = audio;
    audio.play();
    audio.onended = () => {
      currentAudio = null;
    };
  } catch (error) {
    console.error('Error with ElevenLabs API:', error);
    currentAudio = null;
  }
};
