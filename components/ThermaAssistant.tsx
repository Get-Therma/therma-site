'use client';

import { useState, useRef, useEffect } from 'react';
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
  welcomeMessage = "Hi! I'm Therma. I can answer questions about our product, launch timeline, features, integrations, and company vision. What would you like to know?",
  placeholder = "Ask about Therma's product, features, or launch..."
}: ThermaAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<'idle' | 'faq' | 'product'>('idle');
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWelcomeContinue = () => {
    setShowWelcome(false);
    setMessages([
      {
        id: '1',
        text: welcomeMessage,
        isUser: false,
        timestamp: new Date()
      }
    ]);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
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
    if (!inputValue.trim() || isLoading) return;

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
        {/* Glow Effect */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          left: '-20px',
          right: '-20px',
          bottom: '-20px',
          background: 'radial-gradient(circle, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(20px)',
          animation: 'pulse 2s infinite'
        }} />
        
        {/* Main Chat Button */}
        <button
          onClick={toggleChat}
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
            border: '2px solid rgba(0, 0, 0, 0.8)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.8)';
          }}
          aria-label="Open Therma Assistant"
        >
          {/* Logo */}
          <img 
            src="/therma-logo.png" 
            alt="Therma Logo" 
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'contain',
              filter: 'brightness(1.2)'
            }}
            onError={(e) => {
              // Fallback to text if logo fails to load
              e.currentTarget.style.display = 'none';
              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
              if (nextElement) {
                nextElement.style.display = 'block';
              }
            }}
          />
          <span style={{
            display: 'none',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#ffffff',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>T</span>
        </button>
        
        {/* Status Indicator */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
          border: '2px solid rgba(0, 0, 0, 0.9)',
          boxShadow: '0 2px 8px rgba(0, 255, 136, 0.6)',
          animation: 'pulse 2s infinite'
        }} />
        
        {/* Floating Label */}
        {!isOpen && (
          <div style={{
            position: 'absolute',
            right: '80px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            borderRadius: '12px',
            padding: '8px 16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(0, 0, 0, 0.6)',
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
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>Therma</div>
            <div style={{ fontSize: '12px', color: '#00ff88' }}>AI — Private</div>
          </div>
        )}
      </div>


      {/* Dark Mysterious Chat Window */}
      {isOpen && (
        <div 
          className="therma-chatbot-window"
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            width: isExpanded ? '800px' : '520px',
            height: isExpanded ? '700px' : '650px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
            border: '2px solid rgba(0, 0, 0, 0.8)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            zIndex: 10001,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transform: 'scale(1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: 'slideUp 0.3s ease-out'
          }}
          role="log"
          aria-label="Therma Chat"
        >
          {/* Dark Glow Effect Around Window */}
          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '-10px',
            right: '-10px',
            bottom: '-10px',
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.9) 100%)',
            borderRadius: '32px',
            filter: 'blur(15px)',
            zIndex: -1,
            animation: 'pulse 3s infinite'
          }} />
          
          {/* Dark Header */}
          <div style={{
            padding: '24px',
            borderRadius: '24px 24px 0 0',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(0, 0, 0, 0.8)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}>
                <img 
                  src="/therma-logo.png" 
                  alt="Therma Logo" 
                  style={{
                    width: '24px',
                    height: '24px',
                    objectFit: 'contain',
                    filter: 'brightness(1.2)'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'block';
                    }
                  }}
                />
                <span style={{
                  display: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#ffffff'
                }}>T</span>
              </div>
              <div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  color: '#ffffff', 
                  margin: 0,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
                }}>
                  Therma AI
                </h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#00ff88', 
                  margin: 0,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#00ff88',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite',
                    boxShadow: '0 0 8px rgba(0, 255, 136, 0.6)'
                  }}></div>
                  Private & Secure
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                border: '1px solid rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: 'rgba(255, 255, 255, 0.8)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
              }}
              aria-label={isExpanded ? "Minimize chat" : "Expand chat"}
            >
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {isExpanded ? '−' : '⛶'}
              </span>
            </button>
          </div>

          {/* Quick Actions */}
          {!showWelcome && (
            <div style={{
              padding: '16px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.8)',
              background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
            }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isExpanded ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
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
                        padding: '12px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                        border: '1px solid rgba(0, 0, 0, 0.8)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        color: 'rgba(255, 255, 255, 0.8)',
                        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #2d2d2d 0%, #3a3a3a 100%)';
                        e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.9)';
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
                        e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.8)';
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      aria-label={action.label}
                    >
                      <span style={{ fontSize: '18px', marginBottom: '4px', transition: 'transform 0.2s ease' }}>{action.icon}</span>
                      <span style={{ fontSize: '12px', fontWeight: '500', textAlign: 'center' }}>{action.label}</span>
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
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }} aria-live="polite">
            {showWelcome ? (
              // Welcome Page
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                padding: '40px 20px'
              }}>
                {/* Welcome Icon */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.8)',
                  border: '2px solid rgba(0, 0, 0, 0.8)'
                }}>
                  <img 
                    src="/therma-logo.png" 
                    alt="Therma Logo" 
                    style={{
                      width: '48px',
                      height: '48px',
                      objectFit: 'contain',
                      filter: 'brightness(1.2)'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = 'block';
                      }
                    }}
                  />
                  <span style={{
                    display: 'none',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#ffffff'
                  }}>T</span>
                </div>

                {/* Welcome Title */}
                <h2 style={{
                  fontSize: isExpanded ? '32px' : '28px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '20px',
                  lineHeight: '1.2',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
                }}>
                  Welcome to Therma AI
                </h2>

                {/* Welcome Description */}
                <div style={{
                  fontSize: isExpanded ? '18px' : '16px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.6',
                  marginBottom: '40px',
                  maxWidth: '450px',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
                }}>
                  <p style={{ marginBottom: '20px' }}>
                    I'm your personal Therma assistant, here to help you discover everything about our intelligent climate control platform.
                  </p>
                  <p style={{ marginBottom: '20px' }}>
                    I can answer questions about our product features, launch timeline, integrations, company vision, and more.
                  </p>
                  <p>
                    Ready to explore what Therma can do for you?
                  </p>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleWelcomeContinue}
                  style={{
                    padding: '20px 40px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
                    color: '#000000',
                    border: 'none',
                    fontSize: isExpanded ? '18px' : '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 25px rgba(0, 255, 136, 0.4)',
                    minWidth: '200px',
                    textShadow: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 255, 136, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 255, 136, 0.4)';
                  }}
                >
                  Let's Get Started →
                </button>

                {/* Features Preview */}
                <div style={{
                  marginTop: '40px',
                  display: 'grid',
                  gridTemplateColumns: isExpanded ? 'repeat(2, 1fr)' : '1fr',
                  gap: '16px',
                  width: '100%',
                  maxWidth: '450px'
                }}>
                  <div style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                    border: '1px solid rgba(0, 0, 0, 0.8)',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'center',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}>
                    🚀 Launch Timeline
                  </div>
                  <div style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                    border: '1px solid rgba(0, 0, 0, 0.8)',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'center',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}>
                    ⚡ Product Features
                  </div>
                  <div style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                    border: '1px solid rgba(0, 0, 0, 0.8)',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'center',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}>
                    🔗 Integrations
                  </div>
                  <div style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                    border: '1px solid rgba(0, 0, 0, 0.8)',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'center',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}>
                    🎯 Company Vision
                  </div>
                </div>
              </div>
            ) : (
              // Regular Chat Messages
              <>
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
                        maxWidth: '85%',
                        padding: '20px',
                        borderRadius: '20px',
                        border: message.isUser 
                          ? '1px solid rgba(0, 255, 136, 0.3)' 
                          : '1px solid rgba(0, 0, 0, 0.8)',
                        background: message.isUser
                          ? 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)'
                          : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                        color: message.isUser ? '#000000' : '#ffffff',
                        boxShadow: message.isUser 
                          ? '0 4px 15px rgba(0, 255, 136, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                          : '0 4px 15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <p style={{ 
                        fontSize: isExpanded ? '18px' : '16px', 
                        lineHeight: '1.6', 
                        fontWeight: '500', 
                        margin: 0,
                        textShadow: message.isUser ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.8)'
                      }}>{message.text}</p>
                      <p style={{ 
                        fontSize: '12px', 
                        marginTop: '12px', 
                        margin: '12px 0 0 0',
                        color: message.isUser ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.6)',
                        fontWeight: '400'
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
                      padding: '20px',
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                      border: '1px solid rgba(0, 0, 0, 0.8)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#00ff88',
                          borderRadius: '50%',
                          animation: 'bounce 1.4s infinite ease-in-out',
                          animationDelay: '0ms'
                        }}></div>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#00ff88',
                          borderRadius: '50%',
                          animation: 'bounce 1.4s infinite ease-in-out',
                          animationDelay: '150ms'
                        }}></div>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#00ff88',
                          borderRadius: '50%',
                          animation: 'bounce 1.4s infinite ease-in-out',
                          animationDelay: '300ms'
                        }}></div>
                        <span style={{
                          marginLeft: '12px',
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontWeight: '500'
                        }}>Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Dark Input */}
          {!showWelcome && (
            <div style={{
              padding: '24px',
              borderTop: '1px solid rgba(0, 0, 0, 0.8)',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
            }}>
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
                      padding: '20px',
                      borderRadius: '20px',
                      border: '1px solid rgba(0, 0, 0, 0.8)',
                      fontSize: isExpanded ? '18px' : '16px',
                      outline: 'none',
                      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                      color: '#ffffff',
                      transition: 'all 0.2s ease',
                      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                      fontWeight: '400',
                      lineHeight: '1.5'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.5)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 255, 136, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.8)';
                      e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                    }}
                    aria-label="Type your message"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    style={{
                      padding: '20px 28px',
                      borderRadius: '20px',
                      background: !inputValue.trim() || isLoading 
                        ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' 
                        : 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
                      border: '1px solid rgba(0, 0, 0, 0.8)',
                      cursor: !inputValue.trim() || isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: !inputValue.trim() || isLoading ? 'rgba(255, 255, 255, 0.5)' : '#000000',
                      boxShadow: !inputValue.trim() || isLoading ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1)' : '0 10px 15px -3px rgba(0, 255, 136, 0.3)',
                      minWidth: '60px'
                    }}
                    onMouseEnter={(e) => {
                      if (inputValue.trim() && !isLoading) {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 255, 136, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = !inputValue.trim() || isLoading ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1)' : '0 10px 15px -3px rgba(0, 255, 136, 0.3)';
                    }}
                    aria-label="Send message"
                  >
                    <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
        </div>
      )}
    </>
  );
}
