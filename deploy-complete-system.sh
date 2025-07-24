#!/bin/bash

echo "🚀 Deploying Complete ntfy System to CapRover"
echo "=============================================="

# Configuration
DOMAIN=${1:-"yourdomain.com"}
NTFY_SUBDOMAIN="ntfy"
PUSH_SUBDOMAIN="push"
TOPIC=${2:-"push"}

NTFY_DOMAIN="${NTFY_SUBDOMAIN}.${DOMAIN}"
PUSH_DOMAIN="${PUSH_SUBDOMAIN}.${DOMAIN}"
NTFY_BASE_URL="https://${NTFY_DOMAIN}"

echo "📝 Configuration:"
echo "  - ntfy Server: ${NTFY_DOMAIN}"
echo "  - Push Service: ${PUSH_DOMAIN}"
echo "  - Topic: ${TOPIC}"
echo "  - Base URL: ${NTFY_BASE_URL}"
echo ""

# Update environment variables
echo "🔧 Updating configuration files..."

# Update docker-compose.yml
sed -i.bak "s|NTFY_BASE_URL=.*|NTFY_BASE_URL=${NTFY_BASE_URL}|g" docker-compose.yml
sed -i.bak "s|NTFY_TOPIC=.*|NTFY_TOPIC=${TOPIC}|g" docker-compose.yml

echo "✅ Configuration updated"
echo ""

echo "📋 Deployment Instructions:"
echo ""
echo "1. Create TWO apps in CapRover:"
echo "   a) App name: ntfy-server"
echo "      - Custom domain: ${NTFY_DOMAIN}"
echo "      - Enable HTTPS"
echo "      - Has persistent data: YES"
echo "      - Persistent path: /var/lib/ntfy"
echo ""
echo "   b) App name: push-service"  
echo "      - Custom domain: ${PUSH_DOMAIN}"
echo "      - Enable HTTPS"
echo ""
echo "2. Deploy ntfy-server first:"
echo "   - Method: Deploy from GitHub"
echo "   - Repository: https://github.com/yokthanwa1993/xtrfPush.git"
echo "   - Branch: master"
echo "   - Dockerfile: ./Dockerfile.ntfy"
echo "   - Environment Variables:"
echo "     NTFY_BASE_URL=${NTFY_BASE_URL}"
echo "     NTFY_LISTEN_HTTP=:80"
echo "     NTFY_BEHIND_PROXY=true"
echo ""
echo "3. Deploy push-service second:"
echo "   - Method: Deploy from GitHub"
echo "   - Repository: https://github.com/yokthanwa1993/xtrfPush.git"
echo "   - Branch: master"
echo "   - Dockerfile: ./Dockerfile"
echo "   - Environment Variables:"
echo "     NTFY_SERVER=${NTFY_BASE_URL}"
echo "     NTFY_TOPIC=${TOPIC}"
echo ""
echo "🧪 Test commands after deployment:"
echo "curl ${NTFY_BASE_URL}/v1/health"
echo "curl https://${PUSH_DOMAIN}/health"
echo "curl https://${PUSH_DOMAIN}/test"
echo ""
echo "📱 Mobile app setup:"
echo "1. Install ntfy app"
echo "2. Set server: ${NTFY_BASE_URL}"
echo "3. Subscribe to topic: ${TOPIC}"
echo ""
echo "🌐 Web interfaces:"
echo "- ntfy Web UI: ${NTFY_BASE_URL}"
echo "- Push API: https://${PUSH_DOMAIN}"