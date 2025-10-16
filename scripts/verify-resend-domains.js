// scripts/verify-resend-domains.js
require('dotenv').config({ path: '.env.local' });

const { Resend } = require('resend');

async function verifyDomains() {
  console.log('🔍 Resend Domain Verification Tool\n');

  // Check if API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in .env.local');
    return;
  }

  console.log('✅ Resend API Key found');
  console.log('🔑 API Key:', process.env.RESEND_API_KEY.substring(0, 10) + '...\n');

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // List all domains
    console.log('📋 Fetching all domains...');
    const domainsResponse = await resend.domains.list();
    
    if (domainsResponse.data) {
      console.log('📊 Found domains:');
      domainsResponse.data.forEach((domain, index) => {
        console.log(`   ${index + 1}. ${domain.name}`);
        console.log(`      Status: ${domain.status}`);
        console.log(`      ID: ${domain.id}`);
        console.log(`      Created: ${domain.created_at}`);
        console.log('');
      });
    } else {
      console.log('📭 No domains found');
    }

    // Your domains to verify
    const domainsToVerify = [
      'gettherma.ai',
      'therma.one', 
      'get-therma.com'
    ];

    console.log('🎯 Checking verification status for your domains...\n');

    for (const domainName of domainsToVerify) {
      try {
        console.log(`🔍 Checking ${domainName}...`);
        
        // Try to get domain details
        const domainResponse = await resend.domains.get(domainName);
        
        if (domainResponse.data) {
          const domain = domainResponse.data;
          console.log(`   ✅ Domain found: ${domain.name}`);
          console.log(`   📊 Status: ${domain.status}`);
          console.log(`   🆔 ID: ${domain.id}`);
          
          if (domain.status === 'verified') {
            console.log(`   🎉 ${domainName} is already verified!`);
          } else if (domain.status === 'pending') {
            console.log(`   ⏳ ${domainName} is pending verification`);
            console.log(`   📧 DNS records needed:`);
            if (domain.dns_records) {
              domain.dns_records.forEach(record => {
                console.log(`      ${record.type}: ${record.name} = ${record.value}`);
              });
            }
          } else {
            console.log(`   ❓ Status: ${domain.status}`);
          }
        }
      } catch (error) {
        if (error.message.includes('not found')) {
          console.log(`   ❌ Domain ${domainName} not found in Resend`);
          console.log(`   💡 You may need to add it first`);
        } else {
          console.log(`   ❌ Error checking ${domainName}:`, error.message);
        }
      }
      console.log('');
    }

    // Instructions for adding new domains
    console.log('📝 To add a new domain to Resend:');
    console.log('   1. Go to https://resend.com/domains');
    console.log('   2. Click "Add Domain"');
    console.log('   3. Enter your domain name');
    console.log('   4. Follow the DNS verification steps');
    console.log('   5. Run this script again to check status\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the verification
verifyDomains().catch(console.error);
