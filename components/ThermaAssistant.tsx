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

// Chat scroll utility
function setupChatAutoscroll(container: HTMLElement) {
  let atBottom = true;
  const onScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = container;
    atBottom = scrollTop + clientHeight >= scrollHeight - 8;
  };
  container.addEventListener('scroll', onScroll, { passive: true });

  return function onNewMessage(el: HTMLElement) {
    container.appendChild(el);
    if (atBottom) container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  };
}

// Quick reply chips for guided discovery
const QUICK_REPLY_CHIPS = [
  { text: "What can Therma do?", query: "What can Therma do?" },
  { text: "How are patterns found?", query: "How does Therma find patterns in my habits?" },
  { text: "Is my data private?", query: "How does Therma protect my privacy and data?" },
  { text: "Pricing / beta access", query: "What is Therma's pricing and how can I get beta access?" }
];

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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [announcements, setAnnouncements] = useState<string[]>([]);

  // Auto-scroll setup
  useEffect(() => {
    if (messagesContainerRef.current) {
      const addMessage = setupChatAutoscroll(messagesContainerRef.current);
      // Store the addMessage function for later use
      (messagesContainerRef.current as any).addMessage = addMessage;
    }
  }, []);

  // Accessibility: Announce new messages
  const announceMessage = (message: string) => {
    setAnnouncements(prev => [...prev, message]);
    // Clear announcement after a delay
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1));
    }, 3000);
  };

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
        timestamp: new Date(),
        type: 'product'
      }
    ]);
    announceMessage('Welcome message displayed');
  };

  const handleChipClick = (chip: typeof QUICK_REPLY_CHIPS[0]) => {
    setInputValue(chip.query);
    handleSendMessage(chip.query);
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    announceMessage(`You said: ${text}`);

    try {
      // Try FAQ search first
      const faqResults = await faqSearch(text);
      
      if (faqResults.results.length > 0) {
        const faqMessage: Message = {
          id: `bot_${Date.now()}`,
          text: faqResults.results[0].answer,
          isUser: false,
          timestamp: new Date(),
          type: 'faq',
          faqData: faqResults.results[0]
        };
        setMessages(prev => [...prev, faqMessage]);
        announceMessage('FAQ answer provided');
        return;
      }

      // Try launch status
      if (text.toLowerCase().includes('launch') || text.toLowerCase().includes('beta')) {
        const launchStatus = await getLaunchStatus();
        const statusText = `Therma is currently in ${launchStatus.status} status. ${launchStatus.notes || 'We\'re working hard to bring you the best habit tracking experience.'}`;
        const launchMessage: Message = {
          id: `bot_${Date.now()}`,
          text: statusText,
          isUser: false,
          timestamp: new Date(),
          type: 'launch'
        };
        setMessages(prev => [...prev, launchMessage]);
        announceMessage('Launch status provided');
        return;
      }

      // Default product response
      const productMessage: Message = {
        id: `bot_${Date.now()}`,
        text: getProductResponse(text),
        isUser: false,
        timestamp: new Date(),
        type: 'product'
      };
      setMessages(prev => [...prev, productMessage]);
      announceMessage('Product information provided');

    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: `bot_${Date.now()}`,
        text: "I'm having trouble processing your request right now. Please try again or contact support.",
        isUser: false,
        timestamp: new Date(),
        type: 'support'
      };
      setMessages(prev => [...prev, errorMessage]);
      announceMessage('Error occurred, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const getProductResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('what can') || lowerQuery.includes('features')) {
      return "Therma is a habit tracking app that helps you discover patterns in your daily routines to optimize for more energy, clarity, and confidence. Key features include:\n\n• Pattern recognition and insights\n• Energy level tracking\n• Routine optimization suggestions\n• Privacy-focused data handling\n• Beautiful, intuitive interface";
    }
    
    if (lowerQuery.includes('pattern') || lowerQuery.includes('how')) {
      return "Therma finds patterns by analyzing your daily habits, energy levels, and activities over time. It uses machine learning to identify correlations between your behaviors and how you feel, then provides actionable insights to help you optimize your routines for better outcomes.";
    }
    
    if (lowerQuery.includes('privacy') || lowerQuery.includes('data')) {
      return "Your privacy is our top priority. Therma uses end-to-end encryption for all personal data, never shares your information with third parties, and gives you complete control over your data. You can export or delete your data at any time.";
    }
    
    if (lowerQuery.includes('pricing') || lowerQuery.includes('beta')) {
      return "Therma is currently in beta with limited early access. We're offering free beta access to early users who join our waitlist. Pricing for the full version will be announced closer to launch, but beta users will receive special pricing.";
    }
    
    return "I'd be happy to help you learn more about Therma! You can ask me about our features, how pattern recognition works, privacy and data protection, pricing and beta access, or anything else about our product.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Live region for accessibility announcements */}
      <div 
        role="log" 
        aria-live="polite" 
        aria-label="Chat announcements"
        className="sr-only"
      >
        {announcements.map((announcement, index) => (
          <div key={index}>{announcement}</div>
        ))}
      </div>

      {/* Chat Launcher Button */}
      <button 
        className="chat-launcher" 
        aria-label="Open Therma chat"
        onClick={toggleChat}
        aria-expanded={isOpen}
      >
        <span className="chat-launcher__avatar" aria-hidden="true">
          <img
            src="/therma-logo.svg"
            alt="Therma Logo"
            decoding="async"
            loading="eager"
          />
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="chatbot"
          role="dialog"
          aria-label="Therma Assistant Chat"
          aria-modal="true"
        >
          {/* Chat Header */}
          <div className="chatbot__header">
            <div className="chatbot__avatar">
              <img
                src="/therma-logo.svg"
                alt="Therma Logo"
                decoding="async"
              />
            </div>
            <div className="chatbot__info">
              <h3>Therma Assistant</h3>
              <p className="chatbot__meta">Online</p>
            </div>
            <button 
              className="chat__icon-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Welcome Screen */}
          {showWelcome && (
            <div className="chatbot__welcome">
              <div className="chatbot__welcome-content">
                <h2>Welcome to Therma!</h2>
                <p>I'm here to help you learn about our habit tracking platform and answer any questions you have.</p>
                <button 
                  className="chatbot__continue-btn"
                  onClick={handleWelcomeContinue}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Messages Container */}
          {!showWelcome && (
            <>
              <div 
                ref={messagesContainerRef}
                className="chatbot__messages"
                role="log"
                aria-label="Chat messages"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`chatbot__bubble chatbot__bubble--${message.isUser ? 'user' : 'bot'}`}
                    role="listitem"
                  >
                    <div className="chatbot__message-content">
                      {message.text.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                    <div className="chatbot__meta">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="chatbot__bubble chatbot__bubble--bot">
                    <div className="chatbot__typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Chips */}
              {messages.length <= 1 && (
                <div className="chatbot__chips" role="list">
                  {QUICK_REPLY_CHIPS.map((chip, index) => (
                    <button 
                      key={index}
                      className="chatbot__chip" 
                      role="listitem"
                      onClick={() => handleChipClick(chip)}
                    >
                      {chip.text}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Input Bar */}
          {!showWelcome && (
            <div className="chatbot__input">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                disabled={isLoading}
                aria-label="Type your message"
              />
              <button 
                className="chat__send-btn"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                aria-label="Send message"
              >
                ➤
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}