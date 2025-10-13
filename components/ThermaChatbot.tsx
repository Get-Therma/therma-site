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
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' 
            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
        } text-white flex items-center justify-center group`}
        aria-label="Open Therma Chatbot"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        
        {/* Notification Badge */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
            !
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-24 right-6 z-40 w-96 h-[500px] rounded-2xl shadow-2xl border transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-white border-gray-200'
        } flex flex-col`}>
          {/* Header */}
          <div className={`p-4 rounded-t-2xl border-b ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-orange-500' : 'bg-blue-500'
              }`}>
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <div>
                <h3 className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Therma Assistant
                </h3>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  AI-powered help
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isUser
                      ? theme === 'dark'
                        ? 'bg-orange-500 text-white'
                        : 'bg-blue-500 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-800 text-gray-100'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser 
                      ? 'text-orange-100' 
                      : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
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
                <div className={`p-3 rounded-2xl ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <div className="flex space-x-1">
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'
                    }`} style={{ animationDelay: '0ms' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'
                    }`} style={{ animationDelay: '150ms' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'
                    }`} style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`p-4 border-t ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                disabled={isLoading}
                className={`flex-1 p-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-orange-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
                }`}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className={`px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                  theme === 'dark'
                    ? 'bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-600 disabled:cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
