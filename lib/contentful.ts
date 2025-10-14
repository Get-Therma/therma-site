import { createClient } from 'contentful';

// Contentful configuration
const contentfulConfig = {
  space: process.env.CONTENTFUL_SPACE_ID || 'fallback',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'fallback',
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
};

// Check if Contentful is properly configured
const isContentfulConfigured = () => {
  return process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN;
};

// Create Contentful client only if configured
export const contentfulClient = isContentfulConfigured() ? createClient(contentfulConfig) : null;

// Content types
export const CONTENT_TYPES = {
  FAQ_ITEM: 'faqItem',
  LAUNCH_STATUS: 'launchStatus',
  COMPANY_INFO: 'companyInfo',
  FEATURE: 'feature',
  INTEGRATION: 'integration',
} as const;

// FAQ Item interface
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  isVerified: boolean;
  verifiedAt?: string | null;
  sourceUrl?: string | null;
  category: 'launch' | 'vision' | 'mission' | 'features' | 'integrations' | 'pricing' | 'privacy' | 'support' | 'team';
}

// Launch Status interface
export interface LaunchStatus {
  id: string;
  status: 'planned' | 'beta' | 'live' | 'delayed';
  announcedDate?: string;
  expectedDate?: string;
  liveDate?: string;
  notes?: string;
  lastUpdated: string;
}

// Company Info interface
export interface CompanyInfo {
  id: string;
  vision: string;
  mission: string;
  teamDescription: string;
  foundedBy: string;
  lastUpdated: string;
}

// Feature interface
export interface Feature {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'premium' | 'enterprise';
  isAvailable: boolean;
  lastUpdated: string;
}

// Integration interface
export interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'planned' | 'beta';
  type: 'wearable' | 'health' | 'productivity' | 'enterprise';
  lastUpdated: string;
}

// Simplified Contentful API functions
export class ContentfulAPI {
  private client = contentfulClient;

  // Check if Contentful is available
  private isAvailable(): boolean {
    return this.client !== null && !!isContentfulConfigured();
  }

  // FAQ Methods
  async getFAQItems(category?: string): Promise<FAQItem[]> {
    if (!this.isAvailable()) {
      console.warn('Contentful not configured, returning empty FAQ items');
      return [];
    }

    try {
      const query: any = {
        content_type: CONTENT_TYPES.FAQ_ITEM,
      };

      if (category) {
        query['fields.category'] = category;
      }

      const response = await this.client!.getEntries(query);
      
      return response.items.map((item: any) => ({
        id: item.sys.id,
        question: item.fields.question,
        answer: item.fields.answer,
        tags: item.fields.tags || [],
        isVerified: item.fields.isVerified || false,
        verifiedAt: item.fields.verifiedAt,
        sourceUrl: item.fields.sourceUrl,
        category: item.fields.category,
      }));
    } catch (error) {
      console.error('Error fetching FAQ items:', error);
      return [];
    }
  }

  async searchFAQItems(query: string): Promise<FAQItem[]> {
    if (!this.isAvailable()) {
      console.warn('Contentful not configured, returning empty search results');
      return [];
    }

    try {
      // For now, get all items and filter locally
      // Contentful's search API is more complex
      const allItems = await this.getFAQItems();
      const lowerQuery = query.toLowerCase();
      
      return allItems.filter(item => 
        item.question.toLowerCase().includes(lowerQuery) ||
        item.answer.toLowerCase().includes(lowerQuery) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('Error searching FAQ items:', error);
      return [];
    }
  }

  // Launch Status Methods
  async getLaunchStatus(): Promise<LaunchStatus | null> {
    if (!this.isAvailable()) {
      console.warn('Contentful not configured, returning null launch status');
      return null;
    }

    try {
      const response = await this.client!.getEntries({
        content_type: CONTENT_TYPES.LAUNCH_STATUS,
        limit: 1,
      });

      if (response.items.length === 0) {
        return null;
      }

      const item = response.items[0] as any;
      return {
        id: item.sys.id,
        status: item.fields.status,
        announcedDate: item.fields.announcedDate,
        expectedDate: item.fields.expectedDate,
        liveDate: item.fields.liveDate,
        notes: item.fields.notes,
        lastUpdated: item.sys.updatedAt,
      };
    } catch (error) {
      console.error('Error fetching launch status:', error);
      return null;
    }
  }

  // Company Info Methods
  async getCompanyInfo(): Promise<CompanyInfo | null> {
    if (!this.isAvailable()) {
      console.warn('Contentful not configured, returning null company info');
      return null;
    }

    try {
      const response = await this.client!.getEntries({
        content_type: CONTENT_TYPES.COMPANY_INFO,
        limit: 1,
      });

      if (response.items.length === 0) {
        return null;
      }

      const item = response.items[0] as any;
      return {
        id: item.sys.id,
        vision: item.fields.vision,
        mission: item.fields.mission,
        teamDescription: item.fields.teamDescription,
        foundedBy: item.fields.foundedBy,
        lastUpdated: item.sys.updatedAt,
      };
    } catch (error) {
      console.error('Error fetching company info:', error);
      return null;
    }
  }

  // Feature Methods
  async getFeatures(): Promise<Feature[]> {
    if (!this.isAvailable()) {
      console.warn('Contentful not configured, returning empty features');
      return [];
    }

    try {
      const response = await this.client!.getEntries({
        content_type: CONTENT_TYPES.FEATURE,
      });

      return response.items.map((item: any) => ({
        id: item.sys.id,
        name: item.fields.name,
        description: item.fields.description,
        category: item.fields.category,
        isAvailable: item.fields.isAvailable || false,
        lastUpdated: item.sys.updatedAt,
      }));
    } catch (error) {
      console.error('Error fetching features:', error);
      return [];
    }
  }

  // Integration Methods
  async getIntegrations(): Promise<Integration[]> {
    if (!this.isAvailable()) {
      console.warn('Contentful not configured, returning empty integrations');
      return [];
    }

    try {
      const response = await this.client!.getEntries({
        content_type: CONTENT_TYPES.INTEGRATION,
      });

      return response.items.map((item: any) => ({
        id: item.sys.id,
        name: item.fields.name,
        description: item.fields.description,
        status: item.fields.status,
        type: item.fields.type,
        lastUpdated: item.sys.updatedAt,
      }));
    } catch (error) {
      console.error('Error fetching integrations:', error);
      return [];
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      await this.client!.getContentTypes();
      return true;
    } catch (error) {
      console.error('Contentful health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const contentfulAPI = new ContentfulAPI();
