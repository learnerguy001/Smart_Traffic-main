const AIMLAPI_KEY = import.meta.env.VITE_AIMLAPI_KEY;
const TTS_API_URL = 'https://api.aimlapi.com/v1/tts';

export const textToSpeech = async (text: string): Promise<HTMLAudioElement | null> => {
  if (!AIMLAPI_KEY) {
    console.error('AIMLAPI key not found.');
    return null;
  }

  try {
    const response = await fetch(TTS_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIMLAPI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'elevenlabs/v3_alpha',
        text: text,
        voice: 'Alice'
      })
    });

    if (!response.ok || !response.body) {
      throw new Error(`TTS API error! status: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    return audio;
  } catch (error) {
    console.error('Error with AIMLAPI TTS:', error);
    return null;
  }
};
