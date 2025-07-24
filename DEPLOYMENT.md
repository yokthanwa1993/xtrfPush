# 🚀 CapRover Deployment Guide

## Overview
โปรเจคนี้จะติดตั้ง 2 services พร้อมกัน:
1. **ntfy Server** - Self-hosted notification server
2. **Push Service** - API service สำหรับส่งการแจ้งเตือน

## 📋 Prerequisites
- CapRover instance
- Domain name (เช่น yourdomain.com)
- 2 subdomains:
  - `ntfy.yourdomain.com` (สำหรับ ntfy server)
  - `push.yourdomain.com` (สำหรับ push service)

## 🎯 Deployment Steps

### Step 1: Deploy ntfy Server

1. **สร้าง App ใหม่:**
   - ชื่อ: `ntfy-server`
   - Enable HTTPS
   - Custom Domain: `ntfy.yourdomain.com`

2. **Deploy from GitHub:**
   - Repository: `https://github.com/yokthanwa1993/xtrfPush.git`
   - Branch: `master`
   - Dockerfile Path: `./Dockerfile.ntfy`

3. **Environment Variables:**
   ```
   NTFY_BASE_URL=https://ntfy.yourdomain.com
   NTFY_LISTEN_HTTP=:80
   NTFY_CACHE_FILE=/var/lib/ntfy/cache.db
   NTFY_AUTH_FILE=/var/lib/ntfy/auth.db
   NTFY_AUTH_DEFAULT_ACCESS=read-write
   NTFY_BEHIND_PROXY=true
   NTFY_ENABLE_SIGNUP=true
   NTFY_ENABLE_LOGIN=true
   ```

4. **Enable Persistent Data:**
   - Has Persistent Data: ✅
   - Path: `/var/lib/ntfy`

### Step 2: Deploy Push Service

1. **สร้าง App ใหม่:**
   - ชื่อ: `push-service`
   - Enable HTTPS
   - Custom Domain: `push.yourdomain.com`

2. **Deploy from GitHub:**
   - Repository: `https://github.com/yokthanwa1993/xtrfPush.git`
   - Branch: `master`
   - Dockerfile Path: `./Dockerfile`

3. **Environment Variables:**
   ```
   NTFY_SERVER=https://ntfy.yourdomain.com
   NTFY_TOPIC=push
   NTFY_TOKEN=
   PORT=3000
   ```

## 🧪 Testing

### 1. Test ntfy Server
```bash
# Health check
curl https://ntfy.yourdomain.com/v1/health

# Send test message
curl -d "Hello from your server!" https://ntfy.yourdomain.com/push

# Web interface
open https://ntfy.yourdomain.com
```

### 2. Test Push Service
```bash
# Health check
curl https://push.yourdomain.com/health

# Test notification
curl https://push.yourdomain.com/test

# Send custom notification
curl -X POST https://push.yourdomain.com/notify \
  -H "Content-Type: application/json" \
  -d '{
    "message": "ทดสอบจาก self-hosted server! 🎉",
    "title": "Success",
    "priority": "high"
  }'
```

## 📱 Mobile App Setup

1. **ติดตั้งแอป ntfy**
2. **ตั้งค่า Custom Server:**
   - Settings → Default Server
   - ใส่: `https://ntfy.yourdomain.com`
3. **Subscribe to topic:** `push`

## 🔧 Alternative: Single App Deployment

หากต้องการ deploy ทั้งคู่ในแอปเดียว:

1. **สร้าง App:** `ntfy-complete`
2. **Deploy from GitHub** (same repository)
3. **Use docker-compose:**
   - Dockerfile Path: `./docker-compose.yml`
4. **Port Mapping:**
   - ntfy Server: port 8080
   - Push Service: port 3000
5. **Custom Domains:**
   - `ntfy.yourdomain.com` → port 8080
   - `push.yourdomain.com` → port 3000

## 🔄 Environment Variables Reference

### ntfy Server
| Variable | Value | Description |
|----------|-------|-------------|
| `NTFY_BASE_URL` | `https://ntfy.yourdomain.com` | Base URL |
| `NTFY_LISTEN_HTTP` | `:80` | Listen port |
| `NTFY_BEHIND_PROXY` | `true` | Behind reverse proxy |
| `NTFY_ENABLE_SIGNUP` | `true` | Allow user registration |

### Push Service
| Variable | Value | Description |
|----------|-------|-------------|
| `NTFY_SERVER` | `https://ntfy.yourdomain.com` | ntfy server URL |
| `NTFY_TOPIC` | `push` | Default topic |
| `NTFY_TOKEN` | (empty) | Auth token |
| `PORT` | `3000` | Service port |

## 🎉 Usage Examples

### JavaScript
```javascript
const sendNotification = async (message) => {
  const response = await fetch('https://push.yourdomain.com/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: message,
      title: 'My App',
      priority: 'default'
    })
  });
  return response.json();
};
```

### cURL
```bash
curl -X POST https://push.yourdomain.com/notify \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello World!","title":"Test"}'
```

## �️M Troubleshooting

### Common Issues
1. **Connection refused**: ตรวจสอบ NTFY_SERVER URL
2. **CORS errors**: ตรวจสอบ domain settings
3. **Authentication errors**: ตรวจสอบ NTFY_TOKEN

### Logs
```bash
# CapRover logs
docker logs srv-captain--ntfy-server
docker logs srv-captain--push-service
```

## 🔒 Security Notes
- ใช้ HTTPS เสมอ
- ตั้ง authentication สำหรับ production
- Monitor logs สำหรับ suspicious activity
- Backup persistent data

---

🎯 **Result**: Self-hosted notification system ที่ควบคุมได้เต็มที่!