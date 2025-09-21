import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Mic, MicOff, Volume2, VolumeX, Waves } from 'lucide-react';
import { getChatResponse } from '../utils/aimlApi';
import { textToSpeech } from '../utils/voiceApi';

// Type declaration for the Web Speech API
interface IWindow extends Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}
const { SpeechRecognition, webkitSpeechRecognition } = window as unknown as IWindow;

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your SmartTrafficAI assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [conversationMode, setConversationMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize speech recognition and text-to-speech
  useEffect(() => {
    // Check for speech recognition support
    if (SpeechRecognition || webkitSpeechRecognition) {
      setVoiceSupported(true);
      recognitionRef.current = new (SpeechRecognition || webkitSpeechRecognition)();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        startAudioVisualization();
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        stopAudioVisualization();
        
        // Auto-send in conversation mode
        if (conversationMode) {
          handleSendMessage(transcript);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        stopAudioVisualization();
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        stopAudioVisualization();
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Audio visualization for voice input
  const startAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
          setAudioLevel(average / 255 * 100);
          if (isListening) {
            requestAnimationFrame(updateAudioLevel);
          }
        }
      };
      updateAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopAudioVisualization = () => {
    setAudioLevel(0);
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };


  // Play audio with ElevenLabs or fallback to browser TTS
  const playVoiceResponse = async (text: string) => {
    if (isMuted) return;

    // Stop any currently playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    setIsPlaying(true);

    try {
      const audio = await textToSpeech(text);
      if (audio) {
        currentAudioRef.current = audio;
        audio.play();
        audio.onended = () => {
          setIsPlaying(false);
          if (conversationMode && !isListening) {
            setTimeout(() => startListening(), 500);
          }
        };
      } else {
        // Fallback to browser TTS if ElevenLabs fails
        fallbackToSpeechSynthesis(text);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsPlaying(false);
      // Fallback to browser TTS
      fallbackToSpeechSynthesis(text);
    }
  };

  // Fallback to browser speech synthesis
  const fallbackToSpeechSynthesis = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Rachel') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Google US English')
    ) || voices[0];
    
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      if (conversationMode && !isListening) {
        setTimeout(() => startListening(), 500);
      }
    };
    utterance.onerror = () => setIsPlaying(false);

    speechSynthesis.speak(utterance);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: input,
        isUser: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      
      try {
        const response = await fetchAndPlayVoiceResponse(input);
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response,
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('Error getting response:', error);
      } finally {
        setIsLoading(false);
        setInput('');
      }
    }
  };

  // Enhanced API call with live conversation support
  const fetchAndPlayVoiceResponse = async (text: string) => {
    try {
      const aiResponse = await getChatResponse(text);

      if (aiResponse) {
        // Play the voice response using the voice API
        await playVoiceResponse(aiResponse);
        return aiResponse;
      }
      return "Sorry, I couldn't get a response.";
    } catch (error) {
      console.error('AI API error:', error);
      const errorMessage = "I'm experiencing technical difficulties. Please try again.";
      await playVoiceResponse(errorMessage);
      return errorMessage;
    }
  };

  // Start listening function
  const startListening = () => {
    if (!voiceSupported || isListening) return;
    recognitionRef.current?.start();
  };

  // Handle message sending (used by both text and voice)
  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');
    
    try {
      const response = await fetchAndPlayVoiceResponse(textToSend);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm experiencing technical difficulties. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    if (!voiceSupported) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      startListening();
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      // Stop current audio when muting
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const toggleConversationMode = () => {
    const newMode = !conversationMode;
    setConversationMode(newMode);
    
    if (newMode && !isListening && !isPlaying) {
      // Auto-start listening when entering conversation mode
      setTimeout(() => startListening(), 500);
    } else if (!newMode) {
      // Stop listening when exiting conversation mode
      if (isListening) {
        recognitionRef.current?.stop();
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Container */}
      <div 
        className={`
          bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
          backdrop-blur-xl bg-opacity-95 
          rounded-2xl shadow-2xl border border-gray-700
          transition-all duration-500 ease-out transform
          ${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'}
          overflow-hidden
        `}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 140, 0, 0.1)'
        }}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Animated Status Indicator */}
            <div className="relative">
              <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                conversationMode ? 'bg-green-400 animate-pulse' : 
                isConnected ? 'bg-blue-400 animate-pulse' : 'bg-gray-400'
              }`}></div>
              <div className={`absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-75 ${
                conversationMode ? 'bg-green-400' : 
                isConnected ? 'bg-blue-400' : 'bg-gray-400'
              }`}></div>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg tracking-wide">AI Assistant</h2>
              <p className="text-orange-100 text-xs opacity-90">
                {conversationMode ? 'Live Conversation Mode' : 'SmartTrafficAI'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Live Conversation Toggle */}
            <button
              onClick={toggleConversationMode}
              className={`
                px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300
                ${conversationMode 
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30' 
                  : 'bg-white/20 hover:bg-white/30 text-white'
                }
              `}
              title={conversationMode ? 'Exit Live Mode' : 'Enter Live Mode'}
            >
              {conversationMode ? 'LIVE' : 'TEXT'}
            </button>

            {/* Voice Input Button */}
            <button
              onClick={handleVoiceToggle}
              disabled={!voiceSupported}
              className={`
                p-2 rounded-lg transition-all duration-300 relative overflow-hidden
                ${isListening 
                  ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 animate-pulse' 
                  : voiceSupported 
                    ? 'bg-white/20 hover:bg-white/30' 
                    : 'bg-gray-500/50 cursor-not-allowed opacity-50'
                }
              `}
              title={!voiceSupported ? 'Speech recognition not supported' : isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? (
                <div className="relative">
                  <MicOff size={18} className="text-white relative z-10" />
                  {/* Audio visualization */}
                  <div 
                    className="absolute inset-0 bg-white/20 rounded-full transition-all duration-100"
                    style={{ 
                      transform: `scale(${1 + audioLevel * 0.01})`,
                      opacity: audioLevel * 0.01
                    }}
                  ></div>
                </div>
              ) : (
                <Mic size={18} className="text-white" />
              )}
              
              {/* Listening indicator */}
              {isListening && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
              )}
            </button>
            
            {/* Audio Output Toggle */}
            <button
              onClick={handleMuteToggle}
              className={`
                p-2 rounded-lg transition-all duration-300 relative
                ${isMuted ? 'bg-red-500/20 hover:bg-red-500/30' : 'bg-white/20 hover:bg-white/30'}
              `}
              title={isMuted ? 'Unmute audio output' : 'Mute audio output'}
            >
              {isMuted ? <VolumeX size={18} className="text-white" /> : <Volume2 size={18} className="text-white" />}
              
              {/* Playing indicator */}
              {isPlaying && !isMuted && (
                <div className="absolute -top-1 -right-1">
                  <Waves size={12} className="text-green-400 animate-bounce" />
                </div>
              )}
            </button>
            
            {/* Voice Status Indicator */}
            <div className="flex items-center space-x-1 px-2 py-1 bg-white/10 rounded-lg">
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                isListening ? 'bg-red-400 animate-pulse' :
                isPlaying ? 'bg-green-400 animate-pulse' :
                conversationMode ? 'bg-blue-400 animate-pulse' :
                voiceSupported ? 'bg-gray-400' : 'bg-red-500'
              }`}></div>
              <span className="text-xs text-white/80">
                {conversationMode && isListening ? 'Listening...' : 
                 conversationMode && isPlaying ? 'Speaking...' :
                 conversationMode ? 'Ready...' :
                 isListening ? 'Listening...' : 
                 isPlaying ? 'Speaking...' : 
                 voiceSupported ? 'Ready' : 'No Voice'}
              </span>
            </div>
            
            {/* Minimize/Maximize */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-300"
            >
              <div className={`w-4 h-0.5 bg-white transition-transform duration-300 ${isMinimized ? 'rotate-0' : 'rotate-45'}`}></div>
            </button>
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="p-2 rounded-lg bg-white/20 hover:bg-red-500 transition-all duration-300 group"
            >
              <X size={18} className="text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent h-px top-0"></div>
        </div>

        {/* Messages Container */}
        {!isMinimized && (
          <div className="flex-1 p-4 h-[440px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`
                    flex items-start space-x-3 animate-fadeInUp
                    ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}
                  `}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Avatar */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                    ${message.isUser 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                    }
                  `}>
                    {message.isUser ? 'U' : 'AI'}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={`
                    max-w-[75%] p-3 rounded-2xl relative
                    ${message.isUser 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto' 
                      : 'bg-gray-700/80 text-gray-100 backdrop-blur-sm'
                    }
                    shadow-lg transition-all duration-300 hover:shadow-xl
                  `}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {formatTime(message.timestamp)}
                    </span>
                    
                    {/* Message Tail */}
                    <div className={`
                      absolute top-4 w-0 h-0
                      ${message.isUser 
                        ? 'right-full border-l-0 border-r-8 border-r-blue-500' 
                        : 'left-full border-r-0 border-l-8 border-l-gray-700'
                      }
                      border-t-4 border-b-4 border-t-transparent border-b-transparent
                    `}></div>
                  </div>
                </div>
              ))}
              
              {/* Loading Animation */}
              {isLoading && (
                <div className="flex items-center space-x-3 animate-fadeInUp">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-xs font-bold text-white">
                    AI
                  </div>
                  <div className="bg-gray-700/80 p-3 rounded-2xl backdrop-blur-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        {!isMinimized && (
          <div className="p-4 border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={
                    conversationMode 
                      ? (isListening ? "Speak now..." : "Live mode active - Click mic or speak") 
                      : (isListening ? "Speak now..." : "Type your message or click the mic...")
                  }
                  className="
                    w-full px-4 py-3 pr-12 bg-gray-700/80 text-white placeholder-gray-400
                    rounded-xl border border-gray-600 focus:border-orange-500
                    focus:outline-none focus:ring-2 focus:ring-orange-500/30
                    transition-all duration-300 backdrop-blur-sm
                  "
                  disabled={isLoading || isListening}
                />
                
                {/* Listening Indicator */}
                {isListening && (
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse"></div>
                      <div className="w-1 h-6 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 h-5 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-7 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                    <span className="text-xs text-red-400 font-medium">Listening...</span>
                  </div>
                )}

                {/* Voice Input Button in Input Field */}
                <button
                  onClick={handleVoiceToggle}
                  disabled={!voiceSupported}
                  className={`
                    absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-all duration-300
                    ${isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : voiceSupported 
                        ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' 
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              </div>
              
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim() || (conversationMode && !isListening)}
                className="
                  bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-xl
                  hover:from-orange-600 hover:to-orange-700 focus:outline-none 
                  focus:ring-2 focus:ring-orange-500/50 disabled:opacity-50
                  transition-all duration-300 transform hover:scale-105 active:scale-95
                  shadow-lg shadow-orange-500/30 disabled:hover:scale-100
                "
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Chatbot;
