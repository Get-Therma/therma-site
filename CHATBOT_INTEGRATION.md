# Therma Chatbot Integration Guide

## Overview
This guide explains how to integrate your chatbot library with the Therma website. The chatbot system is designed to be flexible and work with various AI providers.

## Files Created

### 1. `components/ThermaChatbot.tsx`
- Main chatbot UI component
- Floating chat button with modern design
- Responsive chat window
- Message history and typing indicators
- Configurable theme (light/dark)

### 2. `app/api/chatbot/route.ts`
- API endpoint for chatbot interactions
- Handles message processing
- Includes fallback knowledge base
- Logs interactions for analytics

### 3. `lib/chatbot.ts`
- Chatbot configuration and integration
- Ready-to-use integration examples
- Environment variable validation
- Support for multiple chatbot libraries

## Integration Steps

### Step 1: Choose Your Chatbot Library
The system supports various chatbot libraries:

- **OpenAI GPT** (GPT-3.5, GPT-4)
- **Anthropic Claude**
- **Google Gemini**
- **Custom chatbot API**
- **Local AI models**

### Step 2: Install Required Dependencies
```bash
# For OpenAI
npm install openai

# For Anthropic Claude
npm install @anthropic-ai/sdk

# For Google Gemini
npm install @google/generative-ai

# Add your specific chatbot library
```

### Step 3: Configure Environment Variables
Create or update your `.env.local` file:

```env
# Required: Your chatbot library API key
CHATBOT_API_KEY=your_api_key_here

# Optional: Additional configuration
CHATBOT_MODEL=gpt-3.5-turbo
CHATBOT_TEMPERATURE=0.7
CHATBOT_MAX_TOKENS=500
```

### Step 4: Update Chatbot Configuration
Edit `lib/chatbot.ts` and replace the placeholder implementation:

```typescript
// Example: OpenAI Integration
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.CHATBOT_API_KEY,
});

export class ThermaChatbot {
  async processMessage(message: string, conversationHistory: any[] = []): Promise<string> {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: this.config.systemPrompt },
        ...conversationHistory.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        })),
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content;
  }
}
```

### Step 5: Customize the Chatbot
You can customize the chatbot behavior by:

1. **Updating the system prompt** in `lib/chatbot.ts`
2. **Modifying the knowledge base** in `app/api/chatbot/route.ts`
3. **Styling the UI** in `components/ThermaChatbot.tsx`
4. **Adding features** like file uploads, voice input, etc.

## Features Included

### ✅ Ready-to-Use Features
- **Floating chat button** with notification badge
- **Responsive chat window** that works on mobile and desktop
- **Message history** with timestamps
- **Typing indicators** and loading states
- **Error handling** with fallback responses
- **Analytics logging** for conversation tracking
- **Dark/light theme** support
- **Accessibility** features (ARIA labels, keyboard navigation)

### ✅ Customization Options
- **Configurable welcome message**
- **Custom placeholder text**
- **Theme selection** (light/dark)
- **API endpoint** configuration
- **Styling** through CSS classes
- **Behavior** through props

## Usage Examples

### Basic Usage
```tsx
import ThermaChatbot from '../components/ThermaChatbot';

// In your layout or page
<ThermaChatbot />
```

### Advanced Configuration
```tsx
<ThermaChatbot
  apiEndpoint="/api/chatbot"
  welcomeMessage="Hi! I'm Therma's AI assistant. How can I help you today?"
  placeholder="Ask me anything about Therma..."
  theme="dark"
/>
```

## Testing

### 1. Test the API Endpoint
```bash
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "What is Therma?"}'
```

### 2. Test the UI Component
- Start the development server: `npm run dev`
- Look for the floating chat button in the bottom-right corner
- Click to open the chat window
- Send a test message

## Deployment

### Environment Variables
Make sure to set the following environment variables in your deployment platform:

- `CHATBOT_API_KEY` - Your chatbot library API key
- `CHATBOT_MODEL` - Model to use (optional)
- `CHATBOT_TEMPERATURE` - Response creativity (optional)
- `CHATBOT_MAX_TOKENS` - Maximum response length (optional)

### Vercel Deployment
The chatbot will automatically deploy with your site. Just make sure to:
1. Add environment variables in Vercel dashboard
2. Redeploy if needed

## Troubleshooting

### Common Issues

1. **Chatbot not responding**
   - Check if `CHATBOT_API_KEY` is set correctly
   - Verify your chatbot library is properly integrated
   - Check browser console for errors

2. **Styling issues**
   - Ensure Tailwind CSS is properly configured
   - Check for CSS conflicts
   - Verify responsive design on mobile

3. **API errors**
   - Check server logs for detailed error messages
   - Verify API endpoint is accessible
   - Test with curl or Postman

### Debug Mode
Enable debug logging by adding to your environment:
```env
DEBUG_CHATBOT=true
```

## Next Steps

1. **Integrate your chatbot library** following the examples in `lib/chatbot.ts`
2. **Customize the system prompt** for Therma-specific responses
3. **Add analytics tracking** for conversation insights
4. **Implement conversation persistence** if needed
5. **Add advanced features** like file uploads or voice input

## Support

If you need help integrating your specific chatbot library, please provide:
- The chatbot library you're using
- Your current implementation
- Any error messages you're seeing

The system is designed to be flexible and work with most chatbot libraries with minimal modifications.
