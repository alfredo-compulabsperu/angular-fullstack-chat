# Firewall Whitelist - Required FQDNs

## Overview
This document lists the Fully Qualified Domain Names (FQDNs) that need to be whitelisted at the firewall level for the CollabSpace application testing environment to function properly.

## Chrome Headless Testing Requirements

The following domains are required by Chrome Headless during Karma test execution. These DNS requests are triggered by Chrome's background services for updates, safe browsing, and other features.

### Required FQDNs

1. **accounts.google.com**
   - Purpose: Google account services
   - Used by: Chrome Headless browser
   - Required for: Authentication and account-related features

2. **clients2.google.com**
   - Purpose: Chrome update services
   - Used by: Chrome Headless browser
   - Required for: Browser update checks

3. **clientservices.googleapis.com**
   - Purpose: Google client services API
   - Used by: Chrome Headless browser
   - Required for: Various Chrome features and services

4. **redirector.gvt1.com**
   - Purpose: Google Video Technology redirector
   - Used by: Chrome Headless browser
   - Required for: Content delivery and updates

5. **safebrowsingohttpgateway.googleapis.com**
   - Purpose: Google Safe Browsing service
   - Used by: Chrome Headless browser
   - Required for: Safe browsing checks and security features

6. **www.google.com**
   - Purpose: Google main domain
   - Used by: Chrome Headless browser
   - Required for: Various Chrome features and connectivity checks

## Firewall Configuration

### Recommended Firewall Rules

```bash
# Allow outbound HTTPS (443) to Google domains
iptables -A OUTPUT -p tcp --dport 443 -d accounts.google.com -j ACCEPT
iptables -A OUTPUT -p tcp --dport 443 -d clients2.google.com -j ACCEPT
iptables -A OUTPUT -p tcp --dport 443 -d clientservices.googleapis.com -j ACCEPT
iptables -A OUTPUT -p tcp --dport 443 -d redirector.gvt1.com -j ACCEPT
iptables -A OUTPUT -p tcp --dport 443 -d safebrowsingohttpgateway.googleapis.com -j ACCEPT
iptables -A OUTPUT -p tcp --dport 443 -d www.google.com -j ACCEPT

# Allow outbound HTTP (80) to Google domains (if needed)
iptables -A OUTPUT -p tcp --dport 80 -d accounts.google.com -j ACCEPT
iptables -A OUTPUT -p tcp --dport 80 -d clients2.google.com -j ACCEPT
iptables -A OUTPUT -p tcp --dport 80 -d clientservices.googleapis.com -j ACCEPT
iptables -A OUTPUT -p tcp --dport 80 -d redirector.gvt1.com -j ACCEPT
iptables -A OUTPUT -p tcp --dport 80 -d safebrowsingohttpgateway.googleapis.com -j ACCEPT
iptables -A OUTPUT -p tcp --dport 80 -d www.google.com -j ACCEPT
```

### For DNS Resolution

Ensure DNS resolution is allowed for these domains:

```bash
# Allow DNS queries (UDP port 53)
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
iptables -A INPUT -p udp --sport 53 -j ACCEPT
```

## Alternative: Disable Chrome Features

If firewall whitelisting is not possible, you can disable these Chrome features by modifying the Karma configuration:

```javascript
// karma.conf.js
module.exports = function(config) {
  config.set({
    // ... other config
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--disable-extensions',
          '--disable-background-networking',
          '--disable-default-apps',
          '--disable-sync',
          '--disable-translate',
          '--disable-features=TranslateUI',
          '--no-first-run',
          '--metrics-recording-only',
          '--mute-audio',
          '--no-default-browser-check',
          '--safebrowsing-disable-auto-update',
          '--disable-client-side-phishing-detection',
          '--disable-component-update',
        ]
      }
    }
  });
};
```

## Impact Analysis

### If Domains Are Blocked
- Tests will still run successfully (as evidenced by 11/11 passing tests)
- Chrome will log DNS resolution failures (visible in CI logs)
- No functional impact on test execution
- Slight delay during test startup due to connection timeouts

### If Domains Are Whitelisted
- Cleaner CI logs without DNS block warnings
- Potentially faster test startup
- Chrome features will function as designed
- Better alignment with production Chrome behavior

## Environment-Specific Notes

### CI/CD Environment (GitHub Actions)
- DNS blocks observed in Ubuntu runners
- Tests pass despite blocks
- Whitelisting not strictly required but recommended for cleaner logs

### Local Development
- DNS blocks less common
- Local network configuration may vary
- Consider using Chrome flags to disable background networking if issues occur

## Source

These FQDNs were extracted from Karma test logs during Chrome Headless execution:
- Test run on: December 19, 2025
- Environment: GitHub Actions Ubuntu runner
- Chrome version: 143.0.0.0
- Karma test execution: Frontend Angular tests

## Recommendations

1. **For production-like testing**: Whitelist all domains to ensure Chrome behaves as in production
2. **For isolated testing**: Use Chrome flags to disable background networking
3. **For CI/CD**: Either approach works; whitelisting provides cleaner logs
4. **Security consideration**: All listed domains are legitimate Google services

## Contact

For questions or issues related to firewall configuration, contact the DevOps team or see the [CONTRIBUTING.md](./CONTRIBUTING.md) guide.
