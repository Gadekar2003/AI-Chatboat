import { GoogleGenAI } from "@google/genai";
import { Loader2, Maximize2, Minimize2, Send, Sparkle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";

const genAI = new GoogleGenAI({
  apiKey: "AIzaSyD3byKy5uUaobfD6SVpOk2EyjLCwdsoSAI",
});

const ChatWindow = ({ isOpen, onClose }) => {
  const [userName, setUserName] = useState("Guest");
  const [userInitial, setUserInitial] = useState("G");
  const [message, setMessage] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const chatWindowRef = useRef(null);
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = () => {
      const userDetails = JSON.parse(
        localStorage.getItem("name") || '{"name":"Guest"}'
      );
      setUserName(userDetails?.name || "Guest");
      setUserInitial(
        (userDetails.name || "G").charAt(0).toUpperCase()
      );
      setMessage([
        {
          text: `Hi ${
            userDetails.name || "Guest"
          }! I'm your AI assistant powered by Masai. How can I help you today?`,
          isBot: true,
        },
      ]);
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatWindowRef.current &&
        !chatWindowRef.current.contains(event.target)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessage((prev) => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    try {
      const result = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: userMessage,
      });
      const reply = result.text;
      setMessage((prev) => [...prev, { text: reply, isBot: true }]);
    } catch (error) {
      console.error("Error:", error);
      setMessage((prev) => [
        ...prev,
        { text: "I am sorry, I ran into an error", isBot: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={chatWindowRef}
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-gray-900 rounded-2xl shadow-2xl border-gray-700 overflow-hidden transition-all duration-300 ease-in-out backdrop-blur-lg border ${
        isMinimized ? "h-14" : "h-[500px]"
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Sparkle size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-medium text-sm">AI Assistant</h3>
            <p>
              Welcome,{" "}
              {userName.length > 15
                ? `${userName.slice(0, 15)}....`
                : userName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Message section */}
          <div className="h-[calc(100%-8rem)] overflow-y-auto p-3 space-y-3 bg-gray-900">
            {message.map((msg, index) => (
              <div key={index} className="flex items-start gap-2 text-white">
                {msg.isBot ? (
                  <ChatMessage message={msg.text} isBot={true} />
                ) : (
                  <div className="flex items-start gap-2 justify-end w-full text-white">
                    <div className="flex-1">
                      <ChatMessage message={msg.text} isBot={false} />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 text-xs">
                      {userInitial}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-white p-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">AI is thinking....</span>
              </div>
            )}
            <div ref={messageEndRef}></div>
          </div>

          {/* Input Section */}
          <form onSubmit={handleSubmit} className="relative p-2 bg-gray-800">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{ maxHeight: "100px" }}
              placeholder="Type your query"
              className="w-full pr-10 pl-3 py-2 rounded-xl border border-gray-600 bg-gray-700 text-white resize-none focus:outline-none"
            ></textarea>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-4 top-3 text-white"
            >
              <Send size={16} />
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatWindow;
