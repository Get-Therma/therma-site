import { NextRequest, NextResponse } from 'next/server';

interface AssistantRequest {
  message: string;
  sessionId: string;
  consentType?: 'session' | 'anonymous' | 'account';
  conversationHistory: Array<{
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
  }>;
  currentFlow?: 'idle' | 'faq' | 'product';
}

// Product-focused system prompt for Therma Assistant
const SYSTEM_PROMPT = `You are Therma Assistant, a helpful product information guide for Therma (privacy-first journaling & pattern recognition app). Your goals:

- Provide clear, accurate information about Therma's product, features, and company vision
- Be concise and helpful in short replies (1–3 sentences by default)
- Focus on product information, launch timeline, features, integrations, and company details
- When unsure about specific details, direct users to official sources or support
- Use professional, friendly tone; avoid medical or clinical jargon
- Always prioritize accuracy and direct users to official channels when needed

Key areas to cover:
- Product features and capabilities
- Launch timeline and status
- Integrations (Apple Health, Oura, etc.)
- Company vision and mission
- Team information
- Support contacts
- Privacy and security approach

Keep responses focused on product and company information.`;

// Product-focused conversation templates
const CONVERSATION_TEMPLATES = {
  product: {
    start: "I'd be happy to tell you about Therma's features and capabilities. What specific aspect interests you most?",
    followup: "Is there anything else about Therma you'd like to know?",
    save: "Information provided for your reference."
  },
  launch: {
    start: "I can help you with launch information. What would you like to know about our timeline?",
    followup: "Would you like to join our waitlist for the latest updates?",
    save: "Launch information noted."
  },
  support: {
    start: "I can help connect you with our support team. What's your question about?",
    followup: "Would you like me to create a support ticket for you?",
    save: "Support request logged."
  }
};

export async function POST(req: NextRequest) {
  try {
    const body: AssistantRequest = await req.json();
    const { message, sessionId, consentType, conversationHistory, currentFlow } = body;

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Determine message type and response based on content and flow
    let messageType = 'general';
    let response = '';

    // Check for specific intents
    const lowerMessage = message.toLowerCase();

    // Product information flow
    if (lowerMessage.includes('features') || lowerMessage.includes('capabilities') || lowerMessage.includes('what does')) {
      messageType = 'product';
      response = CONVERSATION_TEMPLATES.product.start;
    }
    // Launch information flow
    else if (lowerMessage.includes('launch') || lowerMessage.includes('when') || lowerMessage.includes('timeline')) {
      messageType = 'launch';
      response = CONVERSATION_TEMPLATES.launch.start;
    }
    // Support flow
    else if (lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('contact')) {
      messageType = 'support';
      response = CONVERSATION_TEMPLATES.support.start;
    }
    // Privacy information
    else if (lowerMessage.includes('privacy') || lowerMessage.includes('security') || lowerMessage.includes('data')) {
      messageType = 'privacy';
      response = "Therma is privacy-first. We use encryption at rest and in transit, maintain auditable consent logs, and never store PHI without explicit consent. Would you like more details about our privacy approach?";
    }
    // Pricing queries
    else if (lowerMessage.includes('pricing') || lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('subscription')) {
      messageType = 'pricing';
      response = "Pricing details are still being finalized and will be announced closer to our official launch. We're committed to making Therma accessible while ensuring sustainable development. Join our waitlist to be the first to know about pricing when it's announced.";
    }
    // General product support
    else {
      messageType = 'general';
      response = generateProductResponse(message, conversationHistory);
    }

    // Log the interaction for analytics (respecting consent)
    if (consentType !== 'session') {
      try {
        await logInteraction({
          sessionId,
          message,
          response,
          messageType,
          consentType,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Failed to log interaction:', error);
      }
    }

    // No journal entry saving needed for product-focused assistant

    return NextResponse.json({
      response,
      messageType,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Assistant API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateProductResponse(message: string, history: any[]): string {
  const lowerMessage = message.toLowerCase();
  
  // General product questions
  if (lowerMessage.includes('what') || lowerMessage.includes('how') || lowerMessage.includes('tell me')) {
    return "I'd be happy to tell you about Therma! We're a privacy-first journaling and pattern recognition platform. What specific aspect interests you most - our features, launch timeline, or company vision?";
  }
  
  // General company questions
  if (lowerMessage.includes('company') || lowerMessage.includes('about') || lowerMessage.includes('who')) {
    return "Therma is founded by Omar Ranti and a team combining expertise in AI, product design, and behavioral science. We're focused on helping people understand their daily patterns. What would you like to know?";
  }
  
  // Default product response
  return "I'm here to help with questions about Therma's product, features, launch timeline, and company information. What would you like to know?";
}

async function logInteraction(data: any) {
  // In production, this would log to your analytics system
  console.log('Interaction logged:', data);
}
