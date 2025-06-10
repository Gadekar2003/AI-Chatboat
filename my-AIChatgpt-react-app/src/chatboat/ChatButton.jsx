// ChatButton.jsx
import React from "react";
import { MessageSquare, X } from "lucide-react";
import { twMerge } from "tailwind-merge";

const ChatButton = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "fixed bottom-4 left-4 w-14 h-14 rounded-full shadow-xl border border-white/20",
        "flex items-center justify-center transition-all duration-300 ease-in-out",
        "hover:scale-110 active:scale-95",
        isOpen
          ? "bg-gray-800 hover:bg-gray-700"
          : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 animate-pulse"
      )}
    >
      {isOpen ? (
        <X className="w-6 h-6 text-white" />
      ) : (
        <MessageSquare className="w-6 h-6 text-white" />
      )}
    </button>
  );
};

export default ChatButton;