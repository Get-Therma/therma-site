#!/usr/bin/env node

/**
 * Contentful Migration Script
 * 
 * This script helps migrate FAQ data from the mock server to Contentful CMS.
 * Run this after setting up your Contentful space and content types.
 * 
 * Usage: node scripts/migrate-to-contentful.js
 */

import { createClient } from 'contentful';

// Configuration - update these with your Contentful credentials
const config = {
  space: process.env.CONTENTFUL_SPACE_ID || 'your_space_id',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'your_access_token',
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
};

const client = createClient(config);

// Sample FAQ data from the mock server
const faqData = [
  {
    question: 'When is Therma launching?',
    answer: 'Therma is targeting a phased rollout: early beta (invite-only) followed by public launch. For the most accurate dates, check the launch status page or join the waitlist.',
    tags: ['launch', 'timeline'],
    isVerified: false,
    verifiedAt: null,
    sourceUrl: 'https://therma.one/press',
    category: 'launch'
  },
  {
    question: 'What is Therma\'s vision?',
    answer: 'Therma is a privacy-first journaling and pattern-recognition platform that helps users turn daily behavior, habits, and biometrics into actionable patterns so they can create steadier, healthier days. We combine passive signals and active journaling to surface both positive and negative patterns and suggest small, sustainable habit adjustments.',
    tags: ['vision', 'mission'],
    isVerified: true,
    verifiedAt: new Date().toISOString(),
    sourceUrl: null,
    category: 'vision'
  },
  {
    question: 'What is Therma\'s mission?',
    answer: 'Mission: empower people to understand and improve their mental well-being through privacy-first AI, transparent data controls, and small, science-backed behavior nudges.',
    tags: ['vision', 'mission'],
    isVerified: true,
    verifiedAt: new Date().toISOString(),
    sourceUrl: null,
    category: 'mission'
  },
  {
    question: 'What features does Therma offer?',
    answer: 'Core features: AI-guided journaling (on-app only), mood & habit tracking, long-term pattern recognition (opt-in memory), wearable integrations (read-only Apple Health, Oura), privacy controls, export & delete tools, and a premium tier for deeper AI insights.',
    tags: ['features'],
    isVerified: true,
    verifiedAt: new Date().toISOString(),
    sourceUrl: null,
    category: 'features'
  },
  {
    question: 'What integrations does Therma support?',
    answer: 'Therma supports Apple Health (read-only), Oura for sleep tracking, and has planned partner integrations for select wearables and clinics. Enterprise/custom integrations available via partner program.',
    tags: ['integrations'],
    isVerified: false,
    verifiedAt: null,
    sourceUrl: 'mailto:partnerships@gettherma.ai',
    category: 'integrations'
  },
  {
    question: 'What is Therma\'s pricing?',
    answer: 'Pricing details are still being finalized and will be announced closer to our official launch. We\'re committed to making Therma accessible while ensuring sustainable development. Join our waitlist to be the first to know about pricing when it\'s announced.',
    tags: ['pricing'],
    isVerified: false,
    verifiedAt: null,
    sourceUrl: null,
    category: 'pricing'
  },
  {
    question: 'How does Therma handle data & privacy?',
    answer: 'Therma is privacy-first. Short-term session data is ephemeral unless you opt into long-term memory. PHI is never stored without explicit consent; we use encryption at rest and in transit and maintain an auditable consent log.',
    tags: ['privacy', 'security'],
    isVerified: true,
    verifiedAt: new Date().toISOString(),
    sourceUrl: null,
    category: 'privacy'
  },
  {
    question: 'How do I contact Therma support?',
    answer: 'For product questions and support, email support@gettherma.ai. For partnerships and press inquiries, contact partnerships@gettherma.ai or press@gettherma.ai.',
    tags: ['support', 'press'],
    isVerified: true,
    verifiedAt: new Date().toISOString(),
    sourceUrl: null,
    category: 'support'
  },
  {
    question: 'Who is behind Therma?',
    answer: 'Therma is founded by Omar Ranti and a small founding team combining expertise in AI, product design, and behavioral science. For bios and team info, see the About page or press kit.',
    tags: ['team'],
    isVerified: true,
    verifiedAt: new Date().toISOString(),
    sourceUrl: 'https://therma.one/about',
    category: 'team'
  }
];

const launchStatusData = {
  status: 'planned',
  announcedDate: null,
  expectedDate: null,
  liveDate: null,
  notes: 'Unverified / may have changed — join the waitlist for latest updates.'
};

const companyInfoData = {
  vision: 'Therma is a privacy-first journaling and pattern-recognition platform that helps users turn daily behavior, habits, and biometrics into actionable patterns so they can create steadier, healthier days. We combine passive signals and active journaling to surface both positive and negative patterns and suggest small, sustainable habit adjustments.',
  mission: 'Empower people to understand and improve their mental well-being through privacy-first AI, transparent data controls, and small, science-backed behavior nudges.',
  teamDescription: 'Therma is founded by Omar Ranti and a small founding team combining expertise in AI, product design, and behavioral science.',
  foundedBy: 'Omar Ranti'
};

async function migrateFAQData() {
  console.log('🚀 Starting FAQ data migration to Contentful...');
  
  try {
    // Test connection
    await client.getContentTypes();
    console.log('✅ Connected to Contentful successfully');
    
    // Migrate FAQ items
    console.log('📝 Migrating FAQ items...');
    for (const faq of faqData) {
      try {
        const entry = await client.createEntry('faqItem', {
          fields: {
            question: { 'en-US': faq.question },
            answer: { 'en-US': faq.answer },
            tags: { 'en-US': faq.tags },
            isVerified: { 'en-US': faq.isVerified },
            verifiedAt: { 'en-US': faq.verifiedAt },
            sourceUrl: { 'en-US': faq.sourceUrl },
            category: { 'en-US': faq.category }
          }
        });
        
        // Publish the entry
        await client.publishEntry(entry);
        console.log(`✅ Created FAQ: "${faq.question}"`);
      } catch (error) {
        console.error(`❌ Failed to create FAQ: "${faq.question}"`, error.message);
      }
    }
    
    // Migrate launch status
    console.log('🚀 Migrating launch status...');
    try {
      const launchEntry = await client.createEntry('launchStatus', {
        fields: {
          status: { 'en-US': launchStatusData.status },
          announcedDate: { 'en-US': launchStatusData.announcedDate },
          expectedDate: { 'en-US': launchStatusData.expectedDate },
          liveDate: { 'en-US': launchStatusData.liveDate },
          notes: { 'en-US': launchStatusData.notes }
        }
      });
      
      await client.publishEntry(launchEntry);
      console.log('✅ Created launch status');
    } catch (error) {
      console.error('❌ Failed to create launch status', error.message);
    }
    
    // Migrate company info
    console.log('🏢 Migrating company info...');
    try {
      const companyEntry = await client.createEntry('companyInfo', {
        fields: {
          vision: { 'en-US': companyInfoData.vision },
          mission: { 'en-US': companyInfoData.mission },
          teamDescription: { 'en-US': companyInfoData.teamDescription },
          foundedBy: { 'en-US': companyInfoData.foundedBy }
        }
      });
      
      await client.publishEntry(companyEntry);
      console.log('✅ Created company info');
    } catch (error) {
      console.error('❌ Failed to create company info', error.message);
    }
    
    console.log('🎉 Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Update your .env.local with Contentful credentials');
    console.log('2. Test the integration in your application');
    console.log('3. Remove the mock server if everything works correctly');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check your Contentful Space ID and Access Token');
    console.log('2. Ensure content types are created correctly');
    console.log('3. Verify your API token has the correct permissions');
  }
}

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateFAQData();
}

export { migrateFAQData };
