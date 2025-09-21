const AIMLAPI_KEY = import.meta.env.VITE_AIMLAPI_KEY;
const CHAT_API_URL = 'https://api.aimlapi.com/v1/chat/completions';

// Function to get a text response from the chat model
export const getChatResponse = async (text: string): Promise<string | null> => {
  if (!AIMLAPI_KEY) {
    console.error('AIMLAPI key not found.');
    return null;
  }

  const systemMessage = {
    role: 'system',
    content: 'You are a helpful assistant for the Smart Traffic application. This application is designed to monitor traffic, detect violations such as speeding, and provide a dashboard for reviewing and managing these violations. Users can upload video footage for analysis, view a live feed of traffic, and browse a gallery of evidence for each violation. Your role is to answer user questions about the application\'s features and functionality.'
  };

  try {
    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIMLAPI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-5-chat-latest',
        messages: [systemMessage, { role: 'user', content: text }]
      })
    });

    if (!response.ok) {
      throw new Error(`Chat API error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'I am sorry, I could not find an answer.';
  } catch (error) {
    console.error('Error fetching chat response from AIMLAPI:', error);
    return 'There was an error processing your request.';
  }
};
