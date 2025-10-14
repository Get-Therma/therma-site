'use client';

import { useState, useRef, useEffect } from 'react';
import { useConsent } from '../lib/useConsent';
import ConsentModal from './ConsentModal';
import { faqSearch, getLaunchStatus, FAQItem } from '../lib/faq-api';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'faq' | 'launch' | 'product' | 'support';
  attachments?: Array<{ url: string; type: string; name: string }>;
  faqData?: FAQItem;
}

interface ThermaAssistantProps {
  apiEndpoint?: string;
  welcomeMessage?: string;
  placeholder?: string;
}

// Product-focused assistant - no safety escalation needed

export default function ThermaAssistant({
  apiEndpoint = '/api/assistant',
  welcomeMessage = "Hi! I'm Therma Assistant. I can answer questions about our product, launch timeline, features, integrations, and company vision. What would you like to know?",
  placeholder = "Ask about Therma's product, features, or launch..."
}: ThermaAssistantProps) {
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
  const [currentFlow, setCurrentFlow] = useState<'idle' | 'faq' | 'product'>('idle');
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { consentState, showConsentModal, setShowConsentModal, createConsent } = useConsent(sessionId);

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

  // Product-focused assistant - no safety escalation needed

  const handleFAQQuery = async (message: string): Promise<Message | null> => {
    try {
      const faqResults = await faqSearch(message);
      
      if (faqResults.results.length > 0) {
        const firstResult = faqResults.results[0];
        const prefix = firstResult.isVerified ? '' : 'Unverified / may have changed — ';
        
        return {
          id: `faq_${Date.now()}`,
          text: prefix + firstResult.answer,
          isUser: false,
          timestamp: new Date(),
          type: 'faq',
          faqData: firstResult
        };
      }
      
      // Check for launch status queries
      if (message.toLowerCase().includes('launch') || message.toLowerCase().includes('when')) {
        const launchStatus = await getLaunchStatus();
        return {
          id: `launch_${Date.now()}`,
          text: launchStatus.notes || 'Launch information is not currently available.',
          isUser: false,
          timestamp: new Date(),
          type: 'launch'
        };
      }
      
      return null;
    } catch (error) {
      console.error('FAQ query error:', error);
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !consentState.hasConsented) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Check for FAQ questions first
    const faqResponse = await handleFAQQuery(messageText);
    if (faqResponse) {
      setMessages(prev => [...prev, faqResponse]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          sessionId,
          consentType: consentState.consentType,
          conversationHistory: messages.slice(-10),
          currentFlow
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
        timestamp: new Date(),
        type: data.messageType
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Update flow state based on response
      if (data.messageType === 'product') {
        setCurrentFlow('product');
      } else if (data.messageType === 'faq') {
        setCurrentFlow('faq');
      }

    } catch (error) {
      console.error('Assistant error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again later, or if you need immediate help, please reach out to a trusted person or professional.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    const quickActions: { [key: string]: string } = {
      launch: "When is Therma launching?",
      features: "What features does Therma offer?",
      pricing: "What is Therma's pricing?",
      integrations: "What integrations does Therma support?",
      vision: "What is Therma's vision?",
      mission: "What is Therma's mission?",
      team: "Who is behind Therma?",
      support: "How do I contact Therma support?",
      privacy: "How does Therma handle privacy?"
    };

    setInputValue(quickActions[action] || action);
    handleSendMessage();
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

  const quickActions = [
    { id: 'launch', label: 'Launch Info', icon: '🚀' },
    { id: 'features', label: 'Features', icon: '⚡' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
    { id: 'vision', label: 'Vision', icon: '🎯' },
    { id: 'mission', label: 'Mission', icon: '🌟' },
    { id: 'team', label: 'Team', icon: '👥' },
    { id: 'support', label: 'Support', icon: '💬' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' }
  ];

  return (
    <>
      {/* Consent Modal */}
      <ConsentModal
        isOpen={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        onConsent={createConsent}
      />

      {/* Premium Floating Chat Badge */}
      <div 
        className="therma-chatbot-container"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999
        }}
      >
        {/* Main Chat Button */}
        <button
          onClick={toggleChat}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
            border: '1px solid rgba(229, 231, 235, 0.5)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 35px 60px -12px rgba(0, 0, 0, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
          }}
          aria-label="Open Therma AI Assistant"
        >
          {/* Icon */}
          <div style={{ 
            color: '#374151',
            transition: 'color 0.3s ease',
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            {isOpen ? '✕' : '💬'}
          </div>
        </button>
        
        {/* Premium Status Indicator */}
        {!isOpen && (
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '24px',
            height: '24px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '50%',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: 'white',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}></div>
          </div>
        )}
        
        {/* Floating Label */}
        {!isOpen && (
          <div style={{
            position: 'absolute',
            right: '80px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            padding: '8px 16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(229, 231, 235, 0.5)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0';
          }}
          >
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>Therma Assistant</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>AI — Private</div>
          </div>
        )}
      </div>

      {/* Premium Chat Window */}
      {isOpen && (
        <div 
          className="therma-chatbot-window w-96 h-[500px] rounded-3xl shadow-2xl border border-gray-200/50 bg-white/95 backdrop-blur-xl transition-all duration-500 flex flex-col overflow-hidden"
          style={{
            position: 'fixed',
            bottom: '112px',
            right: '24px',
            zIndex: 9998
          }}
          role="log"
          aria-label="Therma Assistant Chat"
        >
          {/* Premium Header */}
          <div className="p-6 rounded-t-3xl bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Therma Assistant</h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                    AI — Private
                  </p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                aria-label="Close chat"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          {consentState.hasConsented && (
            <div className="p-4 border-b border-gray-200/50 bg-gray-50/50">
              <div className="grid grid-cols-3 gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    className="flex flex-col items-center p-2 rounded-xl hover:bg-white transition-colors duration-200 group"
                    aria-label={action.label}
                  >
                    <span className="text-lg mb-1 group-hover:scale-110 transition-transform">{action.icon}</span>
                    <span className="text-xs text-gray-600 font-medium text-center">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-gray-50/50" aria-live="polite">
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
            {consentState.hasConsented ? (
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
                  aria-label="Type your message"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center"
                  aria-label="Send message"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">Please complete privacy consent to continue</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
