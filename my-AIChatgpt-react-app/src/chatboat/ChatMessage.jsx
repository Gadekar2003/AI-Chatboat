// ChatMessage.jsx
import { Bot } from 'lucide-react';
import React from 'react';
import ReactMarkdown from 'react-markdown';

const ChatMessage = ({ message, isBot, timestamp }) => {
  return (
    <div
      className={`rounded-xl px-4 py-3 max-w-[90%] w-fit shadow-md text-white text-sm whitespace-pre-wrap break-words transition-all duration-300 relative
      ${isBot ? "bg-gray-800 ml-2 animate-fadeIn" : "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 self-end mr-2 animate-fadeIn"}`}
    >
      {isBot && (
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 animate-pop">
            <Bot size={14} />
          </div>
          <span className="text-xs font-semibold text-white/80">Masai AI</span>
        </div>
      )}
      <div className={`${isBot ? "ml-8" : "ml-0"} markdown-body`}>
        <ReactMarkdown>{message}</ReactMarkdown>
      </div>
      {/* Timestamp */}
      <div className="absolute text-[10px] text-white/40 bottom-1 right-2 mt-1">
        {timestamp}
      </div>
    </div>
  );
};

export default ChatMessage;