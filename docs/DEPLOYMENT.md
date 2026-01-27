# Deployment Guide

Complete guide for deploying Resume Buddy to production.

## 🎯 Deployment Checklist

- [ ] MongoDB Atlas cluster configured
- [ ] Cloudinary account setup
- [ ] Google AI API key obtained
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Production server ready
- [ ] Domain/DNS configured (optional)
- [ ] SSL certificate installed
- [ ] Monitoring setup

## 🏗️ Architecture Overview

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ HTTPS
       ▼
┌─────────────┐
│   Server    │
│ Node.js +   │
│  Express    │
└──────┬──────┘
       │
       ├──────────► MongoDB Atlas (Database)
       │
       ├──────────► Cloudinary (File Storage)
       │
       └──────────► Google AI (Gemini API)
```

## 📋 Prerequisites

### 1. Node.js & npm

```bash
# Verify installation
node --version  # v18.x or higher
npm --version   # v10.x or higher
```

**Install if needed**:
```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 18
nvm use 18
```

### 2. MongoDB Atlas

**Setup Steps**:

1. **Create Account** → [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Create Cluster**:
   - Choose free tier (M0) or paid
   - Select region close to your server
   - Cluster name: `resume-buddy-cluster`

3. **Configure Network Access**:
   - IP Whitelist → Add IP Address
   - Allow access from anywhere: `0.0.0.0/0` (for simplicity)
   - Or specific server IP for security

4. **Create Database User**:
   - Database Access → Add New User
   - Username: `resume-buddy-admin`
   - Password: Generate strong password
   - Permissions: `Atlas admin` or `Read and write to any database`

5. **Get Connection String**:
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

### 3. Cloudinary

**Setup Steps**:

1. **Create Account** → [Cloudinary](https://cloudinary.com/)

2. **Get Credentials**:
   - Dashboard → Account Details
   - Note down:
     - Cloud Name
     - API Key
     - API Secret

3. **Create Upload Preset** (Optional):
   - Settings → Upload → Upload Presets
   - Add preset for resumes

### 4. Google AI (Gemini)

**Setup Steps**:

1. **Get API Key** → [Google AI Studio](https://makersuite.google.com/app/apikey)

2. **Create Project**:
   - Enable Generative AI API
   - Create API key
   - Copy key

3. **Verify Quota**:
   - Check rate limits
   - Free tier: 60 requests/minute

## 🔐 Environment Variables

Create `.env` file in `apps/server/`:

```env
# Server
PORT=3000
NODE_ENV=production

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-buddy?retryWrites=true&w=majority
# For MongoDB 7.0+, ensure your cluster is using compatible version

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google AI
GOOGLE_AI_API_KEY=your_gemini_api_key

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRE=7d

# Cookies
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=15

# Opportunity API (Optional)
OPPORTUNITY_API_URL=https://api.example.com/jobs
OPPORTUNITY_API_KEY=your_opportunity_api_key
```

**Security Best Practices**:
- Never commit `.env` to version control
- Use strong, random secrets (32+ characters)
- Rotate secrets regularly
- Use different secrets for dev/staging/prod

**Generate Secrets**:
```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🏗️ Build Process

### 1. Install Dependencies

```bash
# From project root
npm install
```

### 2. Build Packages

```bash
# Build all packages
npm run build

# Or build individually
cd packages/schemas && npm run build
cd packages/utils && npm run build
cd packages/ai-engine && npm run build
```

### 3. Build Server

```bash
cd apps/server
npm run build
```

**Output**: `apps/server/dist/` folder with compiled JavaScript

### 4. Verify Build

```bash
# Check build output
ls -la apps/server/dist/

# Should see:
# - index.js
# - app.js
# - config/
# - controllers/
# - models/
# - routes/
# - services/
# - middleware/
```

## 🚀 Deployment Options

### Option 1: Traditional Server (VPS)

#### Platforms
- DigitalOcean
- Linode
- AWS EC2
- Google Cloud Compute Engine
- Azure Virtual Machines

#### Setup Steps

**1. Server Setup** (Ubuntu 22.04):

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install build tools
sudo apt-get install -y build-essential

# Verify
node --version
npm --version
```

**2. Clone Repository**:

```bash
# Create app directory
sudo mkdir -p /var/www/resume-buddy
sudo chown $USER:$USER /var/www/resume-buddy

# Clone code
cd /var/www/resume-buddy
git clone https://github.com/yourusername/resume-buddy.git .

# Or upload via SCP
scp -r ./resume-buddy user@server:/var/www/
```

**3. Install & Build**:

```bash
cd /var/www/resume-buddy

# Install dependencies
npm install

# Build
npm run build
```

**4. Configure Environment**:

```bash
# Create .env file
nano apps/server/.env

# Add production environment variables
# (See Environment Variables section above)
```

**5. Start with PM2** (Process Manager):

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application
cd apps/server
pm2 start dist/index.js --name resume-buddy

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# (Follow the displayed command)

# Monitor
pm2 logs resume-buddy
pm2 status
```

**6. Setup Nginx** (Reverse Proxy):

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/resume-buddy
```

**Nginx Config**:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Increase upload size for resume files
    client_max_body_size 10M;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/resume-buddy /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

**7. SSL Certificate** (Let's Encrypt):

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (automatic)
sudo certbot renew --dry-run
```

### Option 2: Platform as a Service (PaaS)

#### Render

**1. Create Account** → [Render](https://render.com)

**2. New Web Service**:
- Connect GitHub repository
- Name: `resume-buddy`
- Environment: `Node`
- Build Command: `npm install && npm run build`
- Start Command: `cd apps/server && node dist/index.js`

**3. Environment Variables**:
- Add all variables from `.env`

**4. Deploy**:
- Click "Create Web Service"
- Automatic deployments on git push

#### Railway

**1. Create Account** → [Railway](https://railway.app)

**2. New Project**:
- Deploy from GitHub
- Select repository

**3. Configuration**:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd apps/server && node dist/index.js"
  }
}
```

**4. Environment Variables**:
- Settings → Variables
- Add all from `.env`

#### Heroku

**1. Install Heroku CLI**:
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

**2. Login & Create App**:
```bash
heroku login
heroku create resume-buddy-app
```

**3. Add Procfile**:
```
web: cd apps/server && node dist/index.js
```

**4. Deploy**:
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

**5. Configure**:
```bash
heroku config:set MONGO_URI="your_mongo_uri"
heroku config:set JWT_SECRET="your_secret"
# ... (all environment variables)
```

### Option 3: Containerized (Docker)

**Dockerfile** (`apps/server/Dockerfile`):

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/server/ ./apps/server/

# Install dependencies
RUN npm install

# Build
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built files
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package*.json ./
COPY --from=builder /app/apps/server/src/static ./src/static

# Install production dependencies only
RUN npm install --production

# Expose port
EXPOSE 3000

# Start
CMD ["node", "dist/index.js"]
```

**Build & Run**:
```bash
# Build image
docker build -t resume-buddy:latest -f apps/server/Dockerfile .

# Run container
docker run -d \
  -p 3000:3000 \
  --env-file apps/server/.env \
  --name resume-buddy \
  resume-buddy:latest

# View logs
docker logs -f resume-buddy
```

**Docker Compose** (`docker-compose.yml`):

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: apps/server/Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - apps/server/.env
    restart: unless-stopped
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

**Deploy with Compose**:
```bash
docker-compose up -d
```

## 🔍 Post-Deployment Verification

### 1. Health Check

```bash
# Check server status
curl https://yourdomain.com/api/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Database Connection

```bash
# Check MongoDB connection
# Should see "Connected to database" in logs

pm2 logs resume-buddy | grep "Connected"
```

### 3. API Endpoints

```bash
# Test signup
curl -X POST https://yourdomain.com/api/auth/signup \
  -H "Content-Type: multipart/form-data" \
  -F "name=Test User" \
  -F "email=test@example.com" \
  -F "password=password123" \
  -F "file=@resume.pdf"

# Should return 201 Created
```

### 4. File Upload

- Upload a test resume
- Check Cloudinary dashboard for uploaded file
- Verify database has resume record

## 📊 Monitoring

### Application Monitoring

**PM2 Monitoring**:
```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs resume-buddy --lines 100

# Memory/CPU usage
pm2 status
```

**PM2 Plus** (Advanced):
- Sign up: [PM2 Plus](https://pm2.io/)
- Link app: `pm2 plus`
- Dashboard with metrics, logs, alerts

### Server Monitoring

**System Resources**:
```bash
# CPU & Memory
htop

# Disk usage
df -h

# Network
netstat -tuln
```

**Log Monitoring**:
```bash
# Application logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System logs
journalctl -u nginx -f
```

### Error Tracking

**Sentry Integration**:

```bash
npm install @sentry/node
```

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Error middleware
app.use(Sentry.Handlers.errorHandler());
```

## 🔄 CI/CD Pipeline

### GitHub Actions

**`.github/workflows/deploy.yml`**:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/resume-buddy
            git pull origin main
            npm install
            npm run build
            pm2 restart resume-buddy
```

**GitHub Secrets**:
- Settings → Secrets → Actions
- Add: `SERVER_HOST`, `SERVER_USER`, `SSH_PRIVATE_KEY`

## 🛡️ Security Hardening

### 1. Firewall

```bash
# UFW (Ubuntu)
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### 2. Fail2Ban (Brute Force Protection)

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Security Headers

```typescript
import helmet from 'helmet';

app.use(helmet());
app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true
}));
```

### 4. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

## 📈 Performance Optimization

### 1. Gzip Compression

```typescript
import compression from 'compression';

app.use(compression());
```

### 2. Caching

```typescript
// Static files caching
app.use(express.static('static', {
  maxAge: '1d', // Cache for 1 day
  etag: true
}));
```

### 3. Database Indexing

```typescript
// Create indexes on frequently queried fields
UserModel.schema.index({ email: 1 });
ResumeModel.schema.index({ userId: 1 });
```

## 🔧 Troubleshooting

### Issue 1: Server Not Starting

**Symptoms**: PM2 shows app in error state

**Solutions**:
```bash
# Check logs
pm2 logs resume-buddy --err

# Common causes:
# - Missing environment variables
# - Port already in use
# - Database connection failed

# Fix: Check .env file, restart
pm2 restart resume-buddy
```

### Issue 2: Database Connection Failed

**Symptoms**: "MongoServerError: Authentication failed"

**Solutions**:
- Verify MongoDB URI format
- Check username/password
- Whitelist server IP in Atlas
- Test connection: `mongosh "your_connection_string"`

### Issue 3: File Upload Failing

**Symptoms**: 413 Payload Too Large

**Solutions**:
```nginx
# Nginx config
client_max_body_size 10M;
```

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 📚 Related Documentation

- [Getting Started](./GETTING_STARTED.md)
- [Architecture](./ARCHITECTURE.md)
- [API Reference](./API_REFERENCE.md)

---

**Deployment Philosophy**: Reliable, secure, and scalable production deployment.
