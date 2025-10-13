'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ThermaChatbotProps {
  apiEndpoint?: string;
  welcomeMessage?: string;
  placeholder?: string;
  theme?: 'light' | 'dark';
}

export default function ThermaChatbot({
  apiEndpoint = '/api/chatbot',
  welcomeMessage = "Hi! I'm Therma's AI assistant. How can I help you today?",
  placeholder = "Ask me anything about Therma...",
  theme = 'dark'
}: ThermaChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: welcomeMessage,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          conversationHistory: messages.slice(-10) // Send last 10 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Premium Floating Chat Badge */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Main Chat Button */}
        <button
          onClick={toggleChat}
          className="group relative w-16 h-16 rounded-2xl bg-gradient-to-br from-white to-gray-100 shadow-2xl border border-gray-200/50 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:shadow-3xl hover:border-orange-300/50 flex items-center justify-center overflow-hidden"
          aria-label="Open Therma AI Assistant"
        >
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
          
          {/* Icon Container */}
          <div className="relative z-10 flex items-center justify-center">
            {isOpen ? (
              <svg className="w-7 h-7 text-gray-700 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-7 h-7 text-gray-700 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            )}
          </div>
          
          {/* Subtle Glow Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400/20 to-red-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </button>
        
        {/* Premium Status Indicator */}
        {!isOpen && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full shadow-lg border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        )}
        
        {/* Floating Label */}
        {!isOpen && (
          <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-xl rounded-xl px-4 py-2 shadow-xl border border-gray-200/50 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
            <div className="text-sm font-semibold text-gray-800">AI Assistant</div>
            <div className="text-xs text-gray-500">Ask me anything</div>
            {/* Arrow */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-l-8 border-l-white/95 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </div>
        )}
      </div>

      {/* Premium Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 z-40 w-96 h-[500px] rounded-3xl shadow-2xl border border-gray-200/50 bg-white/95 backdrop-blur-xl transition-all duration-500 flex flex-col overflow-hidden">
          {/* Premium Header */}
          <div className="p-6 rounded-t-3xl bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Therma AI</h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                    Online now
                  </p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-gray-50/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl shadow-sm border ${
                    message.isUser
                      ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white border-orange-300/50'
                      : 'bg-white text-gray-900 border-gray-200/50'
                  }`}
                >
                  <p className="text-sm leading-relaxed font-medium">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.isUser 
                      ? 'text-orange-100' 
                      : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-4 rounded-2xl bg-white border border-gray-200/50 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Premium Input */}
          <div className="p-6 border-t border-gray-200/50 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex space-x-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                disabled={isLoading}
                className="flex-1 p-4 rounded-2xl border border-gray-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
