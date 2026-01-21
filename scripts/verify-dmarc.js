// scripts/verify-dmarc.js
const dns = require('dns').promises;

const domains = [
  'gettherma.ai',
  'therma.one',
  'get-therma.com'
];

async function verifyDMARC(domain) {
  const dmarcRecord = `_dmarc.${domain}`;
  
  try {
    console.log(`🔍 Checking DMARC for ${domain}...`);
    
    // Try to resolve TXT records for _dmarc subdomain
    const records = await dns.resolveTxt(dmarcRecord);
    
    if (records && records.length > 0) {
      // Flatten the array (TXT records can be arrays of strings)
      const txtValue = records.map(r => Array.isArray(r) ? r.join('') : r).join('');
      
      console.log(`   ✅ DMARC record found:`);
      console.log(`   📝 Record: ${txtValue}`);
      
      // Parse DMARC record
      const dmarcParts = txtValue.split(';').map(p => p.trim());
      const dmarcData = {};
      
      dmarcParts.forEach(part => {
        const [key, value] = part.split('=').map(s => s.trim());
        if (key && value) {
          dmarcData[key] = value;
        }
      });
      
      // Validate DMARC record
      console.log(`   📊 DMARC Analysis:`);
      console.log(`      Version: ${dmarcData.v || '❌ Missing'}`);
      console.log(`      Policy: ${dmarcData.p || '❌ Missing (defaults to none)'}`);
      console.log(`      Aggregate Reports: ${dmarcData.rua || '❌ Not configured'}`);
      console.log(`      Forensic Reports: ${dmarcData.ruf || '❌ Not configured'}`);
      
      // Check policy
      if (dmarcData.p === 'none') {
        console.log(`      ⚠️  Policy is 'none' (monitoring mode) - Good for initial setup`);
      } else if (dmarcData.p === 'quarantine') {
        console.log(`      ✅ Policy is 'quarantine' - Failing emails go to spam`);
      } else if (dmarcData.p === 'reject') {
        console.log(`      🔒 Policy is 'reject' - Failing emails are rejected`);
      }
      
      // Recommendations
      if (!dmarcData.rua) {
        console.log(`      💡 Recommendation: Add rua=mailto:dmarc-reports@gettherma.ai`);
      }
      if (!dmarcData.ruf) {
        console.log(`      💡 Recommendation: Add ruf=mailto:dmarc-reports@gettherma.ai`);
      }
      
      return { domain, found: true, record: txtValue, data: dmarcData };
    } else {
      console.log(`   ❌ No DMARC record found for ${domain}`);
      console.log(`   💡 Add this TXT record:`);
      console.log(`      Name: _dmarc.${domain}`);
      console.log(`      Value: v=DMARC1; p=none; rua=mailto:dmarc-reports@gettherma.ai; ruf=mailto:dmarc-reports@gettherma.ai; fo=1; aspf=r; adkim=r`);
      return { domain, found: false };
    }
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      console.log(`   ❌ No DMARC record found for ${domain}`);
      console.log(`   💡 Add this TXT record:`);
      console.log(`      Name: _dmarc.${domain}`);
      console.log(`      Value: v=DMARC1; p=none; rua=mailto:dmarc-reports@gettherma.ai; ruf=mailto:dmarc-reports@gettherma.ai; fo=1; aspf=r; adkim=r`);
      return { domain, found: false };
    } else {
      console.log(`   ❌ Error checking DMARC for ${domain}: ${error.message}`);
      return { domain, found: false, error: error.message };
    }
  }
}

async function verifyAllDMARC() {
  console.log('🔐 DMARC Record Verification Tool\n');
  console.log('This tool checks if DMARC records are properly configured for your domains.\n');
  
  const results = [];
  
  for (const domain of domains) {
    const result = await verifyDMARC(domain);
    results.push(result);
    console.log('');
  }
  
  // Summary
  console.log('📊 Summary:');
  const foundCount = results.filter(r => r.found).length;
  const missingCount = results.filter(r => !r.found).length;
  
  console.log(`   ✅ Domains with DMARC: ${foundCount}/${domains.length}`);
  console.log(`   ❌ Domains missing DMARC: ${missingCount}/${domains.length}`);
  
  if (missingCount > 0) {
    console.log('\n💡 Next Steps:');
    console.log('   1. Add DMARC TXT records to your DNS provider for missing domains');
    console.log('   2. Use the records shown above for each domain');
    console.log('   3. Wait 5-10 minutes for DNS propagation');
    console.log('   4. Run this script again to verify');
    console.log('\n📖 For more information, see DOMAIN_VERIFICATION.md');
  } else {
    console.log('\n🎉 All domains have DMARC records configured!');
    console.log('💡 After 1-2 weeks of monitoring, consider changing policy from "none" to "quarantine"');
  }
}

// Run verification
verifyAllDMARC().catch(console.error);
