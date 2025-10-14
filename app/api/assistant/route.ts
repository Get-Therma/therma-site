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
  currentFlow?: 'idle' | 'journaling' | 'mood' | 'insights';
}

// Enhanced system prompt for Therma Assistant
const SYSTEM_PROMPT = `You are Therma Assistant, a calm, concise, non-judgmental wellness guide and journaling companion for Therma (privacy-first journaling & pattern recognition app). Your goals:

- Be empathetic, clear, and actionable in short replies (1–3 sentences by default)
- Never diagnose. Offer supportive guidance, evidence-based suggestions, and recommend seeking clinical help when risk is detected
- Respect privacy: never ask for sensitive health details unless required and only store them if user explicitly opts in with consent
- Support journaling flows, mood check-ins, habit insights, weekly summaries, and simple behavior prompts
- Provide options / quick replies; avoid open-ended questions that can derail flow
- Use plain language; avoid medical or clinical jargon unless user asks
- When unsure, be transparent: "I'm not sure — would you like me to… (a) suggest resources, (b) link to human support, (c) save an anonymous note?"
- Tone: calm, warm, minimal; use 1–2 emojis sparingly (only to convey warmth)

Key Therma features to guide users toward:
- Journaling: Quick daily check-ins, pattern recognition
- Mood tracking: Simple mood scales and follow-up questions
- Insights: Pattern summaries, trend analysis, actionable suggestions
- Privacy: Data control, export/delete options, consent management

Always prioritize user safety and privacy.`;

// Conversation templates for different flows
const CONVERSATION_TEMPLATES = {
  journaling: {
    start: "Great! What's the strongest feeling you had today? Share just one line — I'll help you reflect.",
    followup: "Thanks for sharing. Would you like a short reflection on this, or an insight into patterns this week?",
    save: "Saved privately — you can download or delete anytime."
  },
  mood: {
    start: "On a scale of 1–10, how intense is what you're feeling right now?",
    followup: "Thanks for sharing. Would you like a breathing prompt or a quick reflection?",
    save: "Mood logged — this helps build your pattern insights."
  },
  insights: {
    start: "I can help you see patterns in your recent entries. What timeframe interests you most?",
    followup: "Here's what I'm noticing in your patterns...",
    save: "Insights saved to your private dashboard."
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

    // Journaling flow
    if (lowerMessage.includes('journal') || lowerMessage.includes('write') || lowerMessage.includes('entry')) {
      messageType = 'journal';
      response = CONVERSATION_TEMPLATES.journaling.start;
    }
    // Mood check flow
    else if (lowerMessage.includes('mood') || lowerMessage.includes('feel') || lowerMessage.includes('emotion')) {
      messageType = 'mood';
      response = CONVERSATION_TEMPLATES.mood.start;
    }
    // Insights flow
    else if (lowerMessage.includes('insight') || lowerMessage.includes('pattern') || lowerMessage.includes('trend')) {
      messageType = 'insight';
      response = CONVERSATION_TEMPLATES.insights.start;
    }
    // Data export
    else if (lowerMessage.includes('export') || lowerMessage.includes('download')) {
      messageType = 'export';
      response = "I can help you export your data. This includes all your journal entries, mood logs, and insights. Would you like to proceed with the export?";
    }
    // Human support
    else if (lowerMessage.includes('human') || lowerMessage.includes('support') || lowerMessage.includes('help')) {
      messageType = 'support';
      response = "I can connect you with our human support team. They're available during business hours and can provide more personalized assistance. Would you like me to create a support ticket?";
    }
    // Privacy/data management
    else if (lowerMessage.includes('privacy') || lowerMessage.includes('delete') || lowerMessage.includes('data')) {
      messageType = 'privacy';
      response = "Your privacy is important to us. You can download your data, delete specific entries, or delete all your data anytime. What would you like to do?";
    }
    // General wellness support
    else {
      messageType = 'general';
      response = generateWellnessResponse(message, conversationHistory);
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

    // Save journal entry if appropriate
    if (messageType === 'journal' && consentType !== 'session') {
      try {
        await saveJournalEntry({
          sessionId,
          content: message,
          messageType: 'journal',
          consentType
        });
      } catch (error) {
        console.error('Failed to save journal entry:', error);
      }
    }

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

function generateWellnessResponse(message: string, history: any[]): string {
  const lowerMessage = message.toLowerCase();
  
  // Stress/anxiety responses
  if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
    return "I hear that you're feeling stressed. Would you like to try a quick breathing exercise, or would you prefer to journal about what's on your mind?";
  }
  
  // Energy/fatigue responses
  if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted') || lowerMessage.includes('energy')) {
    return "It sounds like your energy is low. Have you noticed any patterns in what drains or energizes you? I can help you track this.";
  }
  
  // Sleep responses
  if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || lowerMessage.includes('rest')) {
    return "Sleep affects everything. Would you like to start tracking your sleep patterns, or do you want to explore what might be affecting your rest?";
  }
  
  // General wellness
  return "I'm here to help you understand your patterns and build better habits. What's on your mind today? You can journal, check your mood, or explore insights.";
}

async function logInteraction(data: any) {
  // In production, this would log to your analytics system
  console.log('Interaction logged:', data);
}

async function saveJournalEntry(data: any) {
  // In production, this would save to your database
  console.log('Journal entry saved:', data);
}
