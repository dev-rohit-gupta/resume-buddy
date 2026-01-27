# Getting Started Guide

This guide will help you set up Resume Buddy locally for development.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** >= 10.0.0
- **MongoDB** >= 7.0.0 (local or cloud)
- **Git**

### Required Accounts & API Keys

1. **Google Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Free tier available

2. **MongoDB Database**
   - Local installation OR
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)

3. **Cloudinary Account** (for file uploads)
   - Sign up at [Cloudinary](https://cloudinary.com/)
   - Get Cloud Name, API Key, and API Secret

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/dev-rohit-gupta/resume-buddy.git
cd resume-buddy
```

### 2. Install Dependencies

```bash
npm install
```

This will install dependencies for all workspaces (apps and packages) using npm workspaces.

### 3. Environment Configuration

Create a `.env` file in the `apps/server` directory:

```bash
cp .env.sample apps/server/.env
```

Edit `apps/server/.env` with your configuration:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/resume-buddy
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-buddy

# Google Gemini AI
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here

# JWT Authentication
ACCESS_TOKEN_SECRET=your_super_secret_jwt_key_here
ACCESS_TOKEN_EXPIRY=7d

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Static Files Directory (optional)
STATIC_DIR=static
```

### 4. Generate Secrets

For `ACCESS_TOKEN_SECRET`, generate a secure random string:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OR using OpenSSL
openssl rand -hex 64
```

### 5. Build the Project

```bash
npm run build
```

This command:
- Builds Tailwind CSS
- Compiles TypeScript for all packages and apps
- Uses Turbo for optimized builds

### 6. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:4000`

### 7. Access the Application

Open your browser and navigate to:
- **Home**: http://localhost:4000
- **Login**: http://localhost:4000/login
- **Signup**: http://localhost:4000/signup
- **Dashboard**: http://localhost:4000/dashboard (requires authentication)

## 🛠️ Development Workflow

### Running Individual Workspaces

```bash
# Run server only
npm run dev --workspace=@resume-buddy/server

# Build specific package
npm run build --workspace=@resume-buddy/schemas

# Watch CSS changes
npm run dev:css
```

### Project Structure

```
resume-buddy/
├── apps/
│   └── server/              # Main Express application
│       ├── src/
│       │   ├── index.ts     # Entry point
│       │   ├── app.ts       # Express setup
│       │   ├── config/      # Configuration files
│       │   ├── controllers/ # Request handlers
│       │   ├── services/    # Business logic
│       │   ├── routes/      # API routes
│       │   ├── middleware/  # Express middleware
│       │   ├── models/      # MongoDB models
│       │   ├── db/          # Database connection
│       │   └── static/      # Frontend files
│       ├── package.json
│       ├── tsconfig.json
│       └── .env
├── packages/
│   ├── ai-engine/          # Gemini AI integration
│   ├── schemas/            # Zod validation schemas
│   └── utils/              # Shared utilities
├── docs/                   # Documentation
├── package.json            # Root package.json
├── turbo.json              # Turbo configuration
└── tsconfig.base.json      # Base TypeScript config
```

### Available Scripts

#### Root Level

```bash
npm run dev          # Start development server
npm run build        # Build all packages and apps
npm run build:css    # Build Tailwind CSS
npm run dev:css      # Watch CSS changes
npm run format       # Format code with Prettier
```

#### Server Workspace

```bash
cd apps/server
npm run dev          # Development with hot reload
npm run build        # Production build
npm run build:css    # Build Tailwind CSS
npm run watch:css    # Watch CSS changes
```

## 🧪 Testing the Setup

### 1. Test Server Health

```bash
curl http://localhost:4000
```

Should return the home page HTML.

### 2. Test API Endpoint

```bash
curl http://localhost:4000/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### 3. Create Test User

Use the signup page at `http://localhost:4000/signup` or:

```bash
curl http://localhost:4000/api/auth/signup \
  -X POST \
  -F "name=Test User" \
  -F "email=test@example.com" \
  -F "password=test123" \
  -F "file=@/path/to/resume.pdf"
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Problem**: Cannot connect to MongoDB

**Solutions**:
- Ensure MongoDB is running: `mongod --version`
- Check connection string in `.env`
- For Atlas, verify IP whitelist and credentials
- Check network connectivity

### Gemini API Errors

**Problem**: AI operations failing

**Solutions**:
- Verify API key in `.env`
- Check quota limits in Google AI Studio
- Ensure internet connectivity
- Review API key permissions

### Port Already in Use

**Problem**: Port 4000 is already in use

**Solutions**:
```bash
# Find process using port 4000
lsof -i :4000

# Kill the process
kill -9 <PID>

# OR change port in .env
PORT=5000
```

### TypeScript Errors

**Problem**: Type errors during build

**Solutions**:
```bash
# Clean build artifacts
rm -rf apps/server/dist packages/*/dist

# Rebuild
npm run build

# Check TypeScript version
npx tsc --version
```

### Cloudinary Upload Failures

**Problem**: Resume uploads not working

**Solutions**:
- Verify Cloudinary credentials in `.env`
- Check file size (max 10MB)
- Ensure supported file types (PDF, DOCX)
- Review Cloudinary dashboard for errors

### Cookie/Session Issues

**Problem**: Authentication not persisting

**Solutions**:
- Clear browser cookies
- Check `NODE_ENV` setting
- Verify `ACCESS_TOKEN_SECRET` is set
- Test in incognito mode

## 📦 Package Development

### Creating New Packages

```bash
# Create package directory
mkdir -p packages/my-package/src

# Create package.json
cd packages/my-package
npm init -y

# Update package.json name
# "@resume-buddy/my-package"

# Create tsconfig.json extending base
```

### Importing Packages

```typescript
// In any workspace
import { something } from "@resume-buddy/my-package";
```

### Building Packages

```bash
# Build specific package
npm run build --workspace=@resume-buddy/my-package

# Build all packages
npm run build
```

## 🔧 IDE Setup

### VS Code (Recommended)

Install extensions:
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Enhanced TS support
- **Tailwind CSS IntelliSense** - CSS autocomplete

Settings (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### Debugging

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/apps/server/src/index.ts",
      "preLaunchTask": "tsc: build - apps/server/tsconfig.json",
      "outFiles": ["${workspaceFolder}/apps/server/dist/**/*.js"]
    }
  ]
}
```

## 📚 Next Steps

Now that you have Resume Buddy running:

1. **Explore the API** - [API Reference](./API_REFERENCE.md)
2. **Understand the Architecture** - [Architecture Guide](./ARCHITECTURE.md)
3. **Learn about AI Engine** - [AI Engine Docs](./packages/ai-engine.md)
4. **Review the Database** - [Database Schema](./technical/database.md)
5. **Start Contributing** - [Contributing Guide](./CONTRIBUTING.md)

## 💡 Tips for Development

1. **Use TypeScript strictly** - No `any` types
2. **Follow schema-first approach** - Define schemas before implementation
3. **Write tests** - Test critical paths
4. **Use meaningful commit messages** - Follow conventional commits
5. **Keep packages independent** - Minimize cross-dependencies

## 🤝 Getting Help

- **Issues**: [GitHub Issues](https://github.com/dev-rohit-gupta/resume-buddy/issues)
- **Discussions**: [GitHub Discussions](https://github.com/dev-rohit-gupta/resume-buddy/discussions)
- **Documentation**: Check other docs in `/docs` folder

---

**Happy Coding! 🚀**
