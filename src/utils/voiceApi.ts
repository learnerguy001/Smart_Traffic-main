const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'g8xvkBu0oV7JNCyHaiWS'; // Replace with your preferred voice ID

export const textToSpeech = async (text: string) => {
  if (!ELEVENLABS_API_KEY) {
    console.error('ElevenLabs API key not found.');
    return;
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
  const headers = {
    'Accept': 'audio/mpeg',
    'Content-Type': 'application/json',
    'xi-api-key': ELEVENLABS_API_KEY,
  };
  const body = JSON.stringify({
    text,
    model_id: 'eleven_monolingual_v1',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.5,
    },
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  } catch (error) {
    console.error('Error with ElevenLabs API:', error);
  }
};
