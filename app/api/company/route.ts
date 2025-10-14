import { NextRequest, NextResponse } from 'next/server';
import { contentfulAPI } from '../../../lib/contentful';

export async function GET(req: NextRequest) {
  try {
    const companyInfo = await contentfulAPI.getCompanyInfo();
    const features = await contentfulAPI.getFeatures();
    const integrations = await contentfulAPI.getIntegrations();

    return NextResponse.json({
      company: companyInfo,
      features,
      integrations,
    });
  } catch (error) {
    console.error('Company info API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company information' },
      { status: 500 }
    );
  }
}
