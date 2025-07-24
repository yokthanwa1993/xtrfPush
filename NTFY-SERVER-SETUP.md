# ntfy Server Setup on CapRover

## 🎯 Overview
ติดตั้ง ntfy server บนโดเมนตัวเองเพื่อความเป็นส่วนตัวและควบคุมได้เต็มที่

## 📋 Prerequisites
- CapRover instance
- Domain name (เช่น yourdomain.com)
- SSL certificate (CapRover จัดการให้อัตโนมัติ)

## 🚀 Installation Steps

### 1. เตรียมไฟล์
```bash
# แก้ไข domain ใน server.yml
sed -i 's/ntfy.yourdomain.com/ntfy.yourdomain.com/g' server.yml

# หรือใช้ script
./setup-ntfy-server.sh
```

### 2. สร้าง App ใน CapRover
1. ไปที่ CapRover Dashboard
2. สร้าง App ใหม่: `ntfy-server`
3. Enable HTTPS
4. ตั้ง Custom Domain: `ntfy.yourdomain.com`

### 3. Deploy
1. ไปที่ Deployment tab
2. เลือก "Upload tar file" หรือ "Deploy from GitHub"
3. อัปโหลด project หรือใส่ git URL
4. ตั้ง Dockerfile path: `./Dockerfile.ntfy`

### 4. ตั้งค่า Environment Variables
```
NTFY_BASE_URL=https://ntfy.yourdomain.com
NTFY_LISTEN_HTTP=:80
NTFY_CACHE_FILE=/var/lib/ntfy/cache.db
NTFY_AUTH_FILE=/var/lib/ntfy/auth.db
NTFY_AUTH_DEFAULT_ACCESS=read-write
NTFY_BEHIND_PROXY=true
```

### 5. Enable Persistent Data
1. ไปที่ App Settings
2. เปิด "Has Persistent Data"
3. Mount path: `/var/lib/ntfy`

## 🧪 Testing

### Health Check
```bash
curl https://ntfy.yourdomain.com/v1/health
```

### Send Test Message
```bash
curl -d "Hello from your own server!" https://ntfy.yourdomain.com/push
```

### Web Interface
เปิด `https://ntfy.yourdomain.com` ในเบราว์เซอร์

## 📱 Mobile App Setup
1. ติดตั้งแอป ntfy
2. ไปที่ Settings
3. เปลี่ยน Default server เป็น: `https://ntfy.yourdomain.com`
4. เพิ่ม subscription: `push`

## 🔧 Configuration Options

### Authentication (Optional)
```bash
# สร้าง user
curl -X PUT https://ntfy.yourdomain.com/v1/account \
  -u ":password" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your-password"}'
```

### Private Topics
```bash
# ตั้ง topic เป็น private
curl -X POST https://ntfy.yourdomain.com/v1/access \
  -u "admin:password" \
  -H "Content-Type: application/json" \
  -d '{"topic": "push", "read": true, "write": true}'
```

## 🔄 Update Push Service
อัปเดต .env ของ push service:
```env
NTFY_SERVER=https://ntfy.yourdomain.com
NTFY_TOPIC=push
NTFY_TOKEN=  # ใส่ token ถ้าใช้ authentication
```

## 🛠️ Troubleshooting

### ตรวจสอบ logs
```bash
# ใน CapRover
docker logs ntfy-server
```

### ตรวจสอบ config
```bash
curl https://ntfy.yourdomain.com/v1/config
```

### Reset data
```bash
# ลบ persistent data และ restart app
```

## 🔒 Security Best Practices
1. เปิด authentication สำหรับ production
2. ใช้ strong passwords
3. ตั้ง rate limiting
4. Monitor logs
5. Backup persistent data

## 📚 Resources
- [ntfy Documentation](https://docs.ntfy.sh/)
- [CapRover Documentation](https://caprover.com/docs/)
- [Docker Hub - ntfy](https://hub.docker.com/r/binwiederhier/ntfy)