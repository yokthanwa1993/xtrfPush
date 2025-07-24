#!/bin/bash

# CapRover Deployment Script
# Usage: ./deploy-to-caprover.sh yourdomain.com

DOMAIN=${1:-"yourdomain.com"}
NTFY_DOMAIN="ntfy.${DOMAIN}"
PUSH_DOMAIN="push.${DOMAIN}"

echo "🚀 Deploying ntfy Complete System to CapRover"
echo "📋 Configuration:"
echo "  - Domain: ${DOMAIN}"
echo "  - ntfy Server: https://${NTFY_DOMAIN}"
echo "  - Push Service: https://${PUSH_DOMAIN}"
echo ""

# Update server.yml with actual domain
echo "📝 Updating configuration files..."
sed -i.bak "s/ntfy.yourdomain.com/${NTFY_DOMAIN}/g" server.yml
sed -i.bak "s/ntfy.yourdomain.com/${NTFY_DOMAIN}/g" docker-compose.yml

echo "✅ Configuration updated!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1️⃣  Deploy ntfy Server:"
echo "   - App name: ntfy-server"
echo "   - Domain: ${NTFY_DOMAIN}"
echo "   - Dockerfile: ./Dockerfile.ntfy"
echo "   - Repository: https://github.com/yokthanwa1993/xtrfPush.git"
echo ""
echo "2️⃣  Deploy Push Service:"
echo "   - App name: push-service"
echo "   - Domain: ${PUSH_DOMAIN}"
echo "   - Dockerfile: ./Dockerfile"
echo "   - Repository: https://github.com/yokthanwa1993/xtrfPush.git"
echo ""
echo "3️⃣  Environment Variables:"
echo ""
echo "   ntfy-server:"
echo "   NTFY_BASE_URL=https://${NTFY_DOMAIN}"
echo "   NTFY_LISTEN_HTTP=:80"
echo "   NTFY_BEHIND_PROXY=true"
echo ""
echo "   push-service:"
echo "   NTFY_SERVER=https://${NTFY_DOMAIN}"
echo "   NTFY_TOPIC=push"
echo "   PORT=3000"
echo ""
echo "4️⃣  Test Commands:"
echo "   curl https://${NTFY_DOMAIN}/v1/health"
echo "   curl https://${PUSH_DOMAIN}/health"
echo "   curl https://${PUSH_DOMAIN}/test"
echo ""
echo "📱 Mobile App Setup:"
echo "   - Server: https://${NTFY_DOMAIN}"
echo "   - Topic: push"
echo ""
echo "🎉 Ready to deploy!"