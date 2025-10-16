# Domain Verification Guide for Resend

This guide will help you verify all 3 domains in Resend to ensure they can send emails properly.

## Domains to Verify

1. **gettherma.ai** - Primary domain
2. **therma.one** - Main website domain  
3. **get-therma.com** - Alternative domain

## Step-by-Step Verification

### 1. Access Resend Dashboard
- Go to [https://resend.com/domains](https://resend.com/domains)
- Log in with your Resend account
- Click "Add Domain"

### 2. Add Each Domain
For each domain, follow these steps:

#### gettherma.ai
1. Enter domain: `gettherma.ai`
2. Click "Add Domain"
3. Copy the DNS records provided
4. Add these records to your DNS provider:
   - **TXT Record**: `resend._domainkey.gettherma.ai`
   - **MX Record**: `feedback-smtp.us-east-1.amazonses.com`
5. Wait for verification (usually 5-10 minutes)

#### therma.one
1. Enter domain: `therma.one`
2. Click "Add Domain"
3. Copy the DNS records provided
4. Add these records to your DNS provider:
   - **TXT Record**: `resend._domainkey.therma.one`
   - **MX Record**: `feedback-smtp.us-east-1.amazonses.com`
5. Wait for verification

#### get-therma.com
1. Enter domain: `get-therma.com`
2. Click "Add Domain"
3. Copy the DNS records provided
4. Add these records to your DNS provider:
   - **TXT Record**: `resend._domainkey.get-therma.com`
   - **MX Record**: `feedback-smtp.us-east-1.amazonses.com`
5. Wait for verification

### 3. Verify Domain Status
Run this command to check verification status:
```bash
npm run verify:domains
```

### 4. Test All Domains
Run this command to test email sending from all domains:
```bash
npm run test:all-domains
```

## DNS Record Examples

Here's what the DNS records typically look like:

### TXT Record (Domain Verification)
```
Name: resend._domainkey.gettherma.ai
Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
```

### MX Record (Bounce Handling)
```
Name: gettherma.ai
Value: 10 feedback-smtp.us-east-1.amazonses.com
```

## Troubleshooting

### Domain Not Verifying
1. **Check DNS Propagation**: Use [whatsmydns.net](https://www.whatsmydns.net) to check if records are propagated
2. **Verify Record Format**: Ensure TXT records are exactly as provided by Resend
3. **Wait Longer**: DNS changes can take up to 24 hours to propagate

### Email Sending Fails
1. **Check Domain Status**: Ensure domain shows "Verified" in Resend dashboard
2. **Test with Different Domain**: The system will automatically fallback to verified domains
3. **Check API Key**: Ensure `RESEND_API_KEY` is correct in `.env.local`

### Common Issues
- **CNAME Conflicts**: Remove any existing CNAME records for `resend._domainkey`
- **TTL Settings**: Set DNS record TTL to 300 seconds (5 minutes) for faster propagation
- **Subdomain Issues**: Don't add `www.` prefix when adding domains

## Testing Commands

```bash
# Check domain verification status
npm run verify:domains

# Test email sending from all domains
npm run test:all-domains

# Test complete email flow
npm run test:complete-flow

# Test individual services
npm run test:resend
npm run test:beehiv
```

## Expected Behavior

Once all domains are verified:

1. **Automatic Domain Selection**: The system will automatically choose the best domain based on the request
2. **Fallback System**: If the primary domain fails, it will automatically try verified domains
3. **Consistent Experience**: All domains will send the same welcome email template
4. **Duplicate Prevention**: Email addresses are tracked across all domains to prevent duplicates

## Support

If you encounter issues:
1. Check the Resend dashboard for domain status
2. Run the test commands to identify specific problems
3. Check DNS records using online DNS lookup tools
4. Contact Resend support if domains remain unverified after 24 hours
