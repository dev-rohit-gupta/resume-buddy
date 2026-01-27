# Resume Buddy Documentation

Welcome to the Resume Buddy documentation. This guide provides comprehensive information about the architecture, setup, and usage of the Resume Buddy platform.

## 📚 Documentation Index

### Getting Started
- [Getting Started Guide](./GETTING_STARTED.md) - Setup instructions for developers
- [Architecture Overview](./ARCHITECTURE.md) - System design and architecture decisions
- [API Reference](./API_REFERENCE.md) - Complete API endpoints documentation
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment instructions
- [Contributing Guidelines](./CONTRIBUTING.md) - How to contribute to the project

### Package Documentation
- [AI Engine](./packages/ai-engine.md) - Gemini-powered AI analysis engine
- [Schemas](./packages/schemas.md) - Zod validation schemas and type definitions
- [Utils](./packages/utils.md) - Shared utility functions and helpers

### Feature Documentation
- [Opportunity Analysis](./features/opportunity-analysis.md) - Job/internship analysis workflow
- [Resume Extraction](./features/resume-extraction.md) - Resume parsing and extraction
- [Career Insights](./features/career-insights.md) - Career profile and insights generation

### Technical Documentation
- [Database](./technical/database.md) - MongoDB schema and models
- [Authentication](./technical/authentication.md) - JWT-based authentication system
- [File Uploads](./technical/file-uploads.md) - File handling with Multer and Cloudinary

## 🎯 Quick Links

- [Main README](../README.md)
- [GitHub Repository](https://github.com/dev-rohit-gupta/resume-buddy)
- [Report Issues](https://github.com/dev-rohit-gupta/resume-buddy/issues)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/dev-rohit-gupta/resume-buddy
cd resume-buddy

# Install dependencies
npm install

# Setup environment variables
cp .env.sample apps/server/.env

# Build and run
npm run build
npm run dev
```

## 📖 What is Resume Buddy?

Resume Buddy is an AI-powered career decision engine that helps students and freshers evaluate job opportunities **before applying**. Instead of blindly submitting applications, users get:

- **ATS Compatibility Score** - Realistic assessment, not motivational fluff
- **Skill Gap Analysis** - What's missing and why it matters
- **Learning Roadmap** - What to learn first, with time estimates
- **Application Decision** - Apply now, prepare first, or skip
- **Resume Actions** - What to add, improve, or remove

## 🏗️ Architecture Highlights

- **Schema-First Design** - Zod schemas are the single source of truth
- **Structured AI Output** - AI returns JSON, never free text
- **Monorepo Structure** - Clean separation of concerns
- **Type-Safe** - End-to-end TypeScript
- **Production-Ready** - Error handling, validation, and logging

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](./CONTRIBUTING.md) before submitting pull requests.

## 📄 License

MIT License - See [LICENSE](../LICENSE) for details

---

**Built with ❤️ for students and freshers**
