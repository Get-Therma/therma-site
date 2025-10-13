import { NextRequest, NextResponse } from 'next/server';
import { thermaChatbot, validateChatbotConfig } from '../../../lib/chatbot';

// This is where you'll integrate your chatbot library
// Replace the basic implementation below with your chatbot library

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotRequest {
  message: string;
  conversationHistory: ChatMessage[];
}

// Basic knowledge base for Therma
const thermaKnowledge = {
  "what is therma": "Therma is a personal growth app that helps you identify patterns in your daily life and turn them into clear, actionable insights. It guides you through tracking habits, moods, and decisions to optimize your energy, clarity, and confidence.",
  
  "how does therma work": "Therma works through a simple 3-step process: 1) Check In - Log your key habits, moods, or moments in seconds, 2) Reflect - See your progress and discover trends through pattern visualization, 3) Feel Supported - Get gentle nudges and personalized tips when you need them.",
  
  "therma features": "Therma offers pattern recognition, habit tracking, mood analysis, personalized insights, gentle coaching nudges, progress visualization, and privacy-focused design. It's like having a coach in your pocket that helps you understand your own behavior patterns.",
  
  "therma pricing": "Therma is currently in beta and available through our waitlist. Join the waitlist to get early access and be among the first to experience the app when we launch.",
  
  "therma privacy": "Privacy is core to Therma's design. Your data stays private and secure. We don't sell your information, and you have full control over your data. The app works locally on your device with optional cloud sync for convenience.",
  
  "therma waitlist": "You can join the Therma waitlist by entering your email on our landing page. We'll notify you when the app is ready for early access. No spam, unsubscribe anytime.",
  
  "therma launch": "Therma is currently in development. We're working hard to bring you the best personal growth experience. Join our waitlist to be notified when we launch and get early access.",
  
  "therma support": "For support, you can contact us through our contact page or email us directly. We're here to help and would love to hear from you.",
  
  "therma team": "Therma is built by a team passionate about personal growth and helping people understand their own patterns. We believe that with the right insights, everyone can optimize their daily habits for better outcomes."
};

// Simple keyword matching function (replace with your chatbot library)
function findBestResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Check for exact matches first
  for (const [key, response] of Object.entries(thermaKnowledge)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  // Check for related keywords
  if (lowerMessage.includes('energy') || lowerMessage.includes('energized')) {
    return "Therma helps you identify what activities give you lasting energy and which ones drain you. By tracking your energy patterns, you can optimize your daily routine for peak performance.";
  }
  
  if (lowerMessage.includes('clarity') || lowerMessage.includes('focus')) {
    return "Therma cuts through the noise by highlighting patterns in your daily routine. This helps you spend less time guessing and more time making progress on your goals with a clear mind.";
  }
  
  if (lowerMessage.includes('confidence') || lowerMessage.includes('confident')) {
    return "As you see consistent improvement week after week with Therma, you'll gain confidence that you're in control of your habits and capable of achieving your biggest goals.";
  }
  
  if (lowerMessage.includes('habit') || lowerMessage.includes('habits')) {
    return "Therma helps you track and analyze your habits to identify which ones boost your energy and which ones hold you back. It's all about understanding your personal patterns.";
  }
  
  if (lowerMessage.includes('pattern') || lowerMessage.includes('patterns')) {
    return "Therma specializes in finding hidden patterns in your daily life. By visualizing your behavior over time, you can understand what boosts or drains you and make informed changes.";
  }
  
  if (lowerMessage.includes('track') || lowerMessage.includes('tracking')) {
    return "Therma makes tracking simple with quick daily check-ins. No lengthy journaling required - just capture your day's key signals in seconds to build a comprehensive picture over time.";
  }
  
  if (lowerMessage.includes('app') || lowerMessage.includes('application')) {
    return "Therma is a mobile app designed to help you understand and optimize your daily patterns. It combines habit tracking, mood analysis, and pattern recognition to give you actionable insights.";
  }
  
  if (lowerMessage.includes('beta') || lowerMessage.includes('early access')) {
    return "Therma is currently in beta development. Join our waitlist to get early access and be among the first to experience the app when we launch.";
  }
  
  // Default response
  return "I'd be happy to help you learn more about Therma! You can ask me about how Therma works, its features, privacy, pricing, or anything else about the app. What would you like to know?";
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatbotRequest = await req.json();
    const { message, conversationHistory } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Use the configured chatbot (replace with your chatbot library)
    let response: string;
    
    try {
      // Check if chatbot is properly configured
      if (validateChatbotConfig()) {
        // Use your chatbot library here
        response = await thermaChatbot.processMessage(message, conversationHistory);
      } else {
        // Fallback to knowledge base if chatbot not configured
        response = findBestResponse(message);
      }
    } catch (error) {
      console.error('Chatbot processing error:', error);
      // Fallback to knowledge base on error
      response = findBestResponse(message);
    }

    // Log the interaction for analytics (optional)
    console.log('Chatbot interaction:', {
      message,
      response,
      timestamp: new Date().toISOString(),
      userAgent: req.headers.get('user-agent'),
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
    });

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add analytics endpoint
export async function GET(req: NextRequest) {
  try {
    // Return basic chatbot info
    return NextResponse.json({
      name: 'Therma Assistant',
      version: '1.0.0',
      capabilities: [
        'Answer questions about Therma',
        'Explain features and benefits',
        'Provide support information',
        'Help with waitlist signup'
      ],
      status: 'active'
    });
  } catch (error) {
    console.error('Chatbot info error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
