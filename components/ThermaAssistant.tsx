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
          zIndex: 10000,
          isolation: 'isolate'
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

      {/* Background Overlay */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(2px)',
            zIndex: 9999,
            pointerEvents: 'auto'
          }}
          onClick={toggleChat}
        />
      )}

      {/* Premium Chat Window */}
      {isOpen && (
        <div 
          className="therma-chatbot-window"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '420px',
            height: '600px',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(229, 231, 235, 0.3)',
            zIndex: 10001,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transform: 'scale(1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: 'slideUp 0.3s ease-out'
          }}
          role="log"
          aria-label="Therma Assistant Chat"
        >
          {/* Premium Header */}
          <div style={{
            padding: '24px',
            borderRadius: '24px 24px 0 0',
            background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
            borderBottom: '1px solid rgba(229, 231, 235, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #f97316 0%, #dc2626 50%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>T</span>
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Therma Assistant</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                  }}></div>
                  AI — Private
                </p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '12px',
                background: '#f3f4f6',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                color: '#6b7280'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              aria-label="Minimize chat"
            >
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>−</span>
            </button>
          </div>

          {/* Quick Actions */}
          {consentState.hasConsented && (
            <div style={{
              padding: '16px',
              borderBottom: '1px solid rgba(229, 231, 235, 0.3)',
              background: 'rgba(249, 250, 251, 0.5)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px'
              }}>
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '8px',
                      borderRadius: '12px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease, transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    aria-label={action.label}
                  >
                    <span style={{ fontSize: '18px', marginBottom: '4px', transition: 'transform 0.2s ease' }}>{action.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563', textAlign: 'center' }}>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            background: 'linear-gradient(180deg, #ffffff 0%, rgba(249, 250, 251, 0.5) 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }} aria-live="polite">
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.isUser ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '16px',
                    borderRadius: '16px',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    border: message.isUser 
                      ? '1px solid rgba(251, 146, 60, 0.3)' 
                      : '1px solid rgba(229, 231, 235, 0.3)',
                    background: message.isUser
                      ? 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)'
                      : '#ffffff',
                    color: message.isUser ? '#ffffff' : '#111827'
                  }}
                >
                  <p style={{ fontSize: '14px', lineHeight: '1.5', fontWeight: '500', margin: 0 }}>{message.text}</p>
                  <p style={{ 
                    fontSize: '12px', 
                    marginTop: '8px', 
                    margin: '8px 0 0 0',
                    color: message.isUser ? 'rgba(255, 255, 255, 0.8)' : '#9ca3af'
                  }}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: '#ffffff',
                  border: '1px solid rgba(229, 231, 235, 0.3)',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#9ca3af',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite ease-in-out',
                      animationDelay: '0ms'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#9ca3af',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite ease-in-out',
                      animationDelay: '150ms'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#9ca3af',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite ease-in-out',
                      animationDelay: '300ms'
                    }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Premium Input */}
          <div style={{
            padding: '24px',
            borderTop: '1px solid rgba(229, 231, 235, 0.3)',
            background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)'
          }}>
            {consentState.hasConsented ? (
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={placeholder}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px solid rgba(229, 231, 235, 0.3)',
                    fontSize: '14px',
                    outline: 'none',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(4px)',
                    color: '#111827',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(251, 146, 60, 0.5)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(251, 146, 60, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(229, 231, 235, 0.3)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  aria-label="Type your message"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  style={{
                    padding: '16px 24px',
                    borderRadius: '16px',
                    background: !inputValue.trim() || isLoading 
                      ? '#e5e7eb' 
                      : 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
                    border: 'none',
                    cursor: !inputValue.trim() || isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: !inputValue.trim() || isLoading ? '#9ca3af' : '#ffffff',
                    boxShadow: !inputValue.trim() || isLoading ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (inputValue.trim() && !isLoading) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = !inputValue.trim() || isLoading ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }}
                  aria-label="Send message"
                >
                  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Please complete privacy consent to continue</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
