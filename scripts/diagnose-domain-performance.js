// scripts/diagnose-domain-performance.js
require('dotenv').config({ path: '.env.local' });

const { Resend } = require('resend');

async function diagnoseDomainPerformance() {
  console.log('🔍 Domain Performance Diagnosis\n');

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found');
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const testEmail = `diagnostic-${Date.now()}@example.com`;

  const domains = [
    { domain: 'gettherma.ai', fromEmail: 'hello@gettherma.ai', priority: 1 },
    { domain: 'therma.one', fromEmail: 'hello@therma.one', priority: 2 },
    { domain: 'get-therma.com', fromEmail: 'hello@get-therma.com', priority: 3 }
  ];

  console.log('📊 Testing each domain individually...\n');

  const results = [];

  for (const domainConfig of domains) {
    console.log(`🔍 Testing ${domainConfig.domain}...`);
    const startTime = Date.now();
    
    try {
      const emailResult = await resend.emails.send({
        from: `Therma <${domainConfig.fromEmail}>`,
        to: [testEmail],
        subject: `Performance Test - ${domainConfig.domain}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Performance Test</h2>
            <p><strong>Domain:</strong> ${domainConfig.domain}</p>
            <p><strong>From:</strong> ${domainConfig.fromEmail}</p>
            <p><strong>Test Time:</strong> ${new Date().toISOString()}</p>
            <p><strong>Priority:</strong> ${domainConfig.priority}</p>
          </div>
        `
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      if (emailResult.data?.id) {
        console.log(`   ✅ SUCCESS - ${duration}ms`);
        console.log(`   📧 Email ID: ${emailResult.data.id}`);
        console.log(`   ⚡ Response Time: ${duration}ms`);
        
        results.push({
          domain: domainConfig.domain,
          status: 'success',
          duration,
          emailId: emailResult.data.id,
          priority: domainConfig.priority
        });
      } else {
        console.log(`   ❌ FAILED - ${duration}ms`);
        console.log(`   📋 Error:`, emailResult.error);
        
        results.push({
          domain: domainConfig.domain,
          status: 'failed',
          duration,
          error: emailResult.error,
          priority: domainConfig.priority
        });
      }
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`   ❌ ERROR - ${duration}ms`);
      console.log(`   📋 Error:`, error.message);
      
      results.push({
        domain: domainConfig.domain,
        status: 'error',
        duration,
        error: error.message,
        priority: domainConfig.priority
      });
    }
    
    console.log('');
    
    // Add delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Analyze results
  console.log('📊 Performance Analysis:\n');
  
  const successful = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status !== 'success');
  
  if (successful.length > 0) {
    console.log('✅ Working Domains:');
    successful.forEach(result => {
      console.log(`   • ${result.domain}: ${result.duration}ms (Priority ${result.priority})`);
    });
    console.log('');
  }
  
  if (failed.length > 0) {
    console.log('❌ Problematic Domains:');
    failed.forEach(result => {
      console.log(`   • ${result.domain}: ${result.status} (${result.duration}ms)`);
      if (result.error) {
        console.log(`     Error: ${result.error}`);
      }
    });
    console.log('');
  }

  // Performance recommendations
  console.log('💡 Recommendations:\n');
  
  if (successful.length === 1) {
    const workingDomain = successful[0];
    console.log(`🎯 Primary Domain: ${workingDomain.domain} is working perfectly`);
    console.log(`   • Use this as your primary domain`);
    console.log(`   • Configure DNS to point other domains to this one`);
    console.log(`   • Update domain priorities in domain-config.ts\n`);
  }
  
  if (failed.length > 0) {
    console.log('🔧 Fix Issues:');
    failed.forEach(result => {
      console.log(`   • ${result.domain}:`);
      if (result.error?.includes('not verified')) {
        console.log(`     - Domain needs verification in Resend`);
        console.log(`     - Add DNS records as instructed`);
      } else if (result.error?.includes('rate_limit')) {
        console.log(`     - Rate limit exceeded, wait and retry`);
      } else if (result.error?.includes('not found')) {
        console.log(`     - Domain not added to Resend yet`);
      } else {
        console.log(`     - Check DNS configuration`);
        console.log(`     - Verify domain ownership`);
      }
    });
    console.log('');
  }

  // DNS Check
  console.log('🌐 DNS Configuration Check:\n');
  console.log('For each domain, ensure these DNS records exist:');
  console.log('1. TXT Record: resend._domainkey.{domain}');
  console.log('2. MX Record: {domain} -> feedback-smtp.us-east-1.amazonses.com');
  console.log('3. SPF Record: v=spf1 include:amazonses.com ~all');
  console.log('4. DKIM Record: (provided by Resend)\n');

  // Quick fix suggestions
  console.log('🚀 Quick Fixes:\n');
  console.log('1. Verify all domains in Resend dashboard');
  console.log('2. Use the fastest domain as primary');
  console.log('3. Configure fallback system to use working domain');
  console.log('4. Update domain priorities based on performance\n');

  return results;
}

// Run diagnosis
diagnoseDomainPerformance().catch(console.error);
