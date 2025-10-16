// scripts/check-specific-email.js
require('dotenv').config({ path: '.env.local' });

async function checkSpecificEmail() {
  console.log('🔍 Checking Specific Email Submission\n');

  const email = 'santamonicacannabis@gmail.com';
  console.log(`📧 Checking email: ${email}\n`);

  if (!process.env.BEEHIIV_API_KEY || !process.env.BEEHIIV_PUBLICATION_ID) {
    console.error('❌ Beehiv API key or Publication ID not found');
    return;
  }

  try {
    // Check if email exists in Beehiv
    console.log('🔍 Checking Beehiv for this email...');
    const beehiivResponse = await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Beehiv Response Status:', beehiivResponse.status);
    
    if (beehiivResponse.ok) {
      const beehiivData = await beehiivResponse.json();
      if (beehiivData.data && beehiivData.data.length > 0) {
        const subscriber = beehiivData.data[0];
        console.log('✅ Found in Beehiv:');
        console.log('   Email:', subscriber.email);
        console.log('   Status:', subscriber.status);
        console.log('   Created:', new Date(subscriber.created * 1000).toISOString());
        console.log('   Source:', subscriber.source || 'Unknown');
        console.log('   ID:', subscriber.id);
      } else {
        console.log('❌ NOT FOUND in Beehiv');
        console.log('   This email was not recorded in Beehiv');
      }
    } else {
      const errorText = await beehiivResponse.text();
      console.log('❌ Error checking Beehiv:', errorText);
    }
    console.log('');

    // Test creating this email in Beehiv
    console.log('🧪 Testing Beehiv creation for this email...');
    const createResponse = await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`
      },
      body: JSON.stringify({
        email: email,
        reactivate_existing: true,
        double_opt_in: true,
        source: 'Manual Check Test'
      })
    });

    console.log('📊 Create Response Status:', createResponse.status);
    
    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('✅ Successfully created in Beehiv:');
      console.log('   Email:', createData.data?.email);
      console.log('   Status:', createData.data?.status);
      console.log('   ID:', createData.data?.id);
      console.log('   Created:', new Date(createData.data?.created * 1000).toISOString());
    } else {
      const errorText = await createResponse.text();
      console.log('❌ Error creating in Beehiv:', errorText);
    }
    console.log('');

    // Test Resend email
    console.log('📧 Testing Resend email...');
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {
      const resendResult = await resend.emails.send({
        from: 'Therma <hello@therma.one>',
        to: [email],
        subject: 'Therma Welcome Email Test',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>Welcome to Therma!</h1>
            <p>This is a test email to verify delivery to ${email}</p>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
            <p>If you receive this email, Resend is working correctly.</p>
          </div>
        `
      });
      
      if (resendResult.data?.id) {
        console.log('✅ Resend email sent successfully:');
        console.log('   Email ID:', resendResult.data.id);
        console.log('   Check inbox for:', email);
      } else {
        console.log('❌ Resend email failed:', resendResult.error);
      }
    } catch (resendError) {
      console.log('❌ Resend error:', resendError.message);
    }
    console.log('');

    // Test API endpoint
    console.log('🌐 Testing API endpoint...');
    const apiResponse = await fetch('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        source: 'Specific Email Test',
        utm_source: 'test',
        utm_medium: 'script',
        utm_campaign: 'specific-check'
      })
    });

    const apiResult = await apiResponse.json();
    console.log('📊 API Response:');
    console.log('   Status:', apiResponse.status);
    console.log('   Beehiv Success:', apiResult.beehiivSuccess);
    console.log('   Email Success:', apiResult.emailSuccess);
    console.log('   Domain:', apiResult.domain);
    console.log('   Message:', apiResult.message);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run check
checkSpecificEmail().catch(console.error);
