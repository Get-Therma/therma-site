# Contentful CMS Integration Setup Guide

This guide will help you set up Contentful CMS to replace the mock server for your Therma Assistant FAQ system.

## 1. Create Contentful Account

1. Go to [contentful.com](https://contentful.com) and sign up
2. Create a new space for your Therma project
3. Note your Space ID from the API section

## 2. Generate API Keys

1. Go to **Settings** → **API keys**
2. Create a new **Content Delivery API** key
3. Copy the **Space ID** and **Content Delivery API - access token**

## 3. Create Content Types

### FAQ Item Content Type
Create a content type called `faqItem` with these fields:

```
- question (Short text, required)
- answer (Long text, required)
- tags (Short text, list)
- isVerified (Boolean, default: false)
- verifiedAt (Date & time, optional)
- sourceUrl (Short text, optional)
- category (Short text, required, validation: one of: launch, vision, mission, features, integrations, pricing, privacy, support, team)
```

### Launch Status Content Type
Create a content type called `launchStatus` with these fields:

```
- status (Short text, required, validation: one of: planned, beta, live, delayed)
- announcedDate (Date & time, optional)
- expectedDate (Date & time, optional)
- liveDate (Date & time, optional)
- notes (Long text, optional)
```

### Company Info Content Type
Create a content type called `companyInfo` with these fields:

```
- vision (Long text, required)
- mission (Long text, required)
- teamDescription (Long text, required)
- foundedBy (Short text, required)
```

### Feature Content Type
Create a content type called `feature` with these fields:

```
- name (Short text, required)
- description (Long text, required)
- category (Short text, required, validation: one of: core, premium, enterprise)
- isAvailable (Boolean, default: false)
```

### Integration Content Type
Create a content type called `integration` with these fields:

```
- name (Short text, required)
- description (Long text, required)
- status (Short text, required, validation: one of: available, planned, beta)
- type (Short text, required, validation: one of: wearable, health, productivity, enterprise)
```

## 4. Add Sample Content

### FAQ Items
Add these sample FAQ entries:

**Launch Category:**
- Question: "When is Therma launching?"
- Answer: "Therma is targeting a phased rollout: early beta (invite-only) followed by public launch. For the most accurate dates, check the launch status page or join the waitlist."
- Category: launch
- isVerified: false

**Vision Category:**
- Question: "What is Therma's vision?"
- Answer: "Therma is a privacy-first journaling and pattern-recognition platform that helps users turn daily behavior, habits, and biometrics into actionable patterns so they can create steadier, healthier days."
- Category: vision
- isVerified: true

**Features Category:**
- Question: "What features does Therma offer?"
- Answer: "Core features: AI-guided journaling (on-app only), mood & habit tracking, long-term pattern recognition (opt-in memory), wearable integrations (read-only Apple Health, Oura), privacy controls, export & delete tools, and a premium tier for deeper AI insights."
- Category: features
- isVerified: true

**Pricing Category:**
- Question: "What is Therma's pricing?"
- Answer: "Pricing details are still being finalized and will be announced closer to our official launch. We're committed to making Therma accessible while ensuring sustainable development. Join our waitlist to be the first to know about pricing when it's announced."
- Category: pricing
- isVerified: false

### Launch Status
Add one launch status entry:
- Status: planned
- Notes: "Unverified / may have changed — join the waitlist for latest updates."

### Company Info
Add company information:
- Vision: "Therma is a privacy-first journaling and pattern-recognition platform that helps users turn daily behavior, habits, and biometrics into actionable patterns so they can create steadier, healthier days."
- Mission: "Empower people to understand and improve their mental well-being through privacy-first AI, transparent data controls, and small, science-backed behavior nudges."
- Team Description: "Therma is founded by Omar Ranti and a small founding team combining expertise in AI, product design, and behavioral science."
- Founded By: "Omar Ranti"

## 5. Environment Variables

Add these to your `.env.local` file:

```bash
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here
CONTENTFUL_ENVIRONMENT=master
```

## 6. Test the Integration

1. Start your development server: `npm run dev`
2. Open the Therma Assistant chat
3. Try asking questions like:
   - "When is Therma launching?"
   - "What features does Therma offer?"
   - "What is Therma's vision?"

## 7. Content Management

### Adding New FAQ Items
1. Go to Contentful web app
2. Create new FAQ Item entries
3. Fill in all required fields
4. Publish the content
5. Test in your application

### Updating Launch Status
1. Edit the launch status entry
2. Update dates and notes as needed
3. Publish changes
4. The assistant will automatically reflect updates

### Managing Features and Integrations
1. Add new feature entries as you develop them
2. Update integration status as partnerships develop
3. Mark features as available when ready

## 8. Advanced Features

### Preview Mode (Optional)
For draft content preview, add these environment variables:
```bash
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token
CONTENTFUL_PREVIEW_SECRET=your_preview_secret
```

### Webhooks (Optional)
Set up webhooks to automatically rebuild your site when content changes:
1. Go to Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/revalidate`
3. Select content types to trigger rebuilds

## 9. Troubleshooting

### Common Issues
- **Empty results**: Check that content is published, not just saved as draft
- **API errors**: Verify your Space ID and Access Token are correct
- **Missing content**: Ensure content types match exactly (case-sensitive)

### Debug Mode
Add this to your `.env.local` for detailed logging:
```bash
CONTENTFUL_DEBUG=true
```

## 10. Production Considerations

- Use different spaces for staging/production
- Set up proper webhook security
- Consider caching strategies for better performance
- Monitor API usage limits

## Support

- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [Contentful Community](https://www.contentful.com/community/)
- [API Reference](https://www.contentful.com/developers/docs/references/content-delivery-api/)
