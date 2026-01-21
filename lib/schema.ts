import { pgTable, text, timestamp, serial, jsonb } from 'drizzle-orm/pg-core';
import { z } from 'zod';

// Waitlist table
export const waitlist = pgTable('waitlist', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  attribution: text('attribution'),
  referer: text('referer'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Contact table
export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Email events table - tracks opens, clicks, bounces from Resend webhooks
export const emailEvents = pgTable('email_events', {
  id: serial('id').primaryKey(),
  emailId: text('email_id').notNull(), // Resend email ID
  recipientEmail: text('recipient_email'),
  eventType: text('event_type').notNull(), // sent, delivered, opened, clicked, bounced, complained
  linkUrl: text('link_url'), // For click events
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  metadata: jsonb('metadata'), // Full event payload from Resend
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Zod schemas for validation
export const waitlistSchema = z.object({
  email: z.string().email(),
  utm_campaign: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_source: z.string().optional(),
  referrer: z.string().optional(),
  hp: z.string().optional(), // honeypot
});

export const contactSchema = z.object({
  type: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});
