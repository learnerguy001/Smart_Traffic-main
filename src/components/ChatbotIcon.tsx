import React from 'react';
import { MessageSquare } from 'lucide-react';

interface ChatbotIconProps {
  onClick: () => void;
}

const ChatbotIcon: React.FC<ChatbotIconProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform transform hover:scale-110 z-50"
      aria-label="Open chat"
    >
      <MessageSquare size={28} />
    </button>
  );
};

export default ChatbotIcon;
