#!/bin/bash

echo "🚀 Setting up ntfy server on CapRover"

# Variables
DOMAIN="yourdomain.com"
NTFY_SUBDOMAIN="ntfy"
NTFY_DOMAIN="${NTFY_SUBDOMAIN}.${DOMAIN}"

echo "📝 Configuration:"
echo "  - Domain: ${NTFY_DOMAIN}"
echo "  - Base URL: https://${NTFY_DOMAIN}"

# Update server.yml with actual domain
sed -i.bak "s/ntfy.yourdomain.com/${NTFY_DOMAIN}/g" server.yml
sed -i.bak "s/ntfy.yourdomain.com/${NTFY_DOMAIN}/g" docker-compose.ntfy.yml

echo "✅ Configuration files updated"

# Instructions
echo ""
echo "📋 Next steps:"
echo "1. Create new app in CapRover: 'ntfy-server'"
echo "2. Enable HTTPS and set custom domain: ${NTFY_DOMAIN}"
echo "3. Deploy using Dockerfile.ntfy"
echo "4. Update your push service .env:"
echo "   NTFY_SERVER=https://${NTFY_DOMAIN}"
echo "5. Redeploy push service"
echo ""
echo "🔧 Test commands:"
echo "curl https://${NTFY_DOMAIN}/v1/health"
echo "curl -d 'Test message' https://${NTFY_DOMAIN}/push"