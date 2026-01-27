<div align="center">

# 🧠 Resume Buddy

### AI-Powered Career Decision Engine

**Evaluate opportunities before applying. Apply smarter, not harder.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-green.svg)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-orange.svg)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-key-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Architecture](#-architecture-overview) • [Contributing](#-contributing)

</div>

---

## 🎯 What is Resume Buddy?

**Resume Buddy** is an AI-powered **career decision engine** that helps students and freshers evaluate jobs and internships _before applying_.

### 🤔 The Problem

Students waste hours applying to jobs they're not ready for, leading to:
- ❌ Automatic rejections from ATS systems
- ❌ Demotivation from constant failures
- ❌ Unclear understanding of skill gaps
- ❌ No strategic career planning

### 💡 The Solution

Resume Buddy analyzes **job/internship details** + **your skills & profile** to provide:

- ✅ **ATS Compatibility Score** - Realistic assessment, not false hope
- ✅ **Skill Gap Analysis** - What's missing and why it matters
- ✅ **Learning Roadmap** - Prioritized steps to bridge gaps
- ✅ **Application Decision** - Apply Now / Prepare First / Skip
- ✅ **Resume Improvement** - Actionable enhancement suggestions
- ✅ **Risk Indicators** - Red flags and precautions

> ### ⚠️ What Resume Buddy is NOT
> 
> - ❌ **Not a chatbot** - No conversational AI
> - ❌ **Not a resume builder** - Focuses on decision-making
> - ❌ **Not a job board** - Analyzes opportunities you find
> 
> ### ✅ What Resume Buddy IS
> 
> **A career decision engine answering one clear question:**
> 
> ### _"Should I apply for this opportunity or prepare first?"_

---

## ✨ Key Features

### 🎯 Core Capabilities

| Feature | Description |
|---------|-------------|
| 📊 **ATS Compatibility** | Realistic scoring based on job requirements match |
| 🧩 **Skill Gap Analysis** | Identifies missing skills with priority levels |
| 🛣️ **Learning Roadmap** | Curated path to bridge gaps (what to learn first) |
| ✅ **Smart Decisions** | AI-powered Apply/Prepare/Skip recommendations |
| 📄 **Resume Enhancement** | Actionable improvement suggestions |
| ⚠️ **Risk Detection** | Red flags and precautions before applying |

### 🔧 Technical Highlights

- 🧠 **Google Gemini AI** - Advanced decision-making engine
┌─────────────────────────────────────────────────────────┐
│                    Resume Buddy System                   │
└─────────────────────────────────────────────────────────┘

┌──────────────┐
│    User      │  Uploads Resume + Job Details
│  (Browser)   │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────┐
│           Express Server (Node.js + TS)              │
│  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │
│  │ Controllers│→ │  Services  │→ │  AI Engine   │  │
│  └────────────┘  └────────────┘  └──────────────┘  │
└──────┬───────────────────┬───────────────┬──────────┘
       │                   │               │
       ▼                   ▼               ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   MongoDB    │   │  Cloudinary  │   │ Gemini AI    │
│  (Database)  │   │(File Storage)│   │  (Google)    │
└──────────────┘   └──────────────┘   └──────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────┐
│         Structured JSON Response to Client            │
│  {atsScore, skillGaps, recommendation, roadmap...}   │
└──────────────────────────────────────────────────────┘
```

### 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Static HTML5, CSS3 (Tailwind), Vanilla JavaScript |
| **Backend** | Node.js 18+, Express 4.19, TypeScript 5.5 |
| **AI Engine** | Google Gemini Flash 1.5 (Structured Output) |
| **Database** | MongoDB 7.0+ with Mongoose 8.5 |
| **Storage** | Cloudinary (Resume files) |
| **Validation** | Zod schemas (Runtime + Compile-time) |
| **Authentication** | JWT + HTTP-only cookies + bcrypt |
| **File Processing** | Multer, pdf-parse, mammoth |
| **Monorepo** | Turborepo (apps + packages) |
Strict JSON Output
↓
Dashboard (HTML / CSS / JS)

```

- **Frontend**: Static HTML, CSS, JavaScript
- **Backend**: Node.js + Express
- **AI Engine**: Google Gemini (via SDK)
- **Database**: MongoDB (for saving job + analysis history)
- **Monorepo**: apps + packages structure

---

## 📁 Monorepo Structure

```

resume-buddy/
│
├── apps/
│   └── server/                 # Main Express server
│       ├── src/
│       │   ├── index.ts        # Entry point
│       │   ├── app.ts          # Express setup
│       │   ├── config/         # Configuration files
│       │   ├── routes/         # API routes
│       │   ├── controllers/    # Request handling
│       │   ├── services/       # Business logic
│       │   ├── middleware/     # Auth, error, multer middleware
│       │   ├── models/         # MongoDB models
│       │   ├── db/             # MongoDB connection
│       │   ├── types/          # TypeScript definitions
│       │   └── static/         # HTML / CSS / JS frontend
│
├── packages/
│   ├── ai-engine/              # Gemini-based AI engine
│   │   ├── client/
│   │   │   └── gemini.client.ts
│   │   ├── engine/
│   │   │   └── run.engine.ts
│   │   ├── operations/
│   │   │   ├── analyze.job.ts
│   │   │   ├── buildCareerProfile.ts
│   │   │   └── resume.extract.ts
│   │   └── prompts/
│   │       └── system.prompt.ts
│   │
│   ├── schemas/                # Zod schemas for validation
│   │   ├── api.ts
│   │   ├── user.schema.ts
│   │   ├── ai/                 # AI-specific schemas
│   │   └── db/                 # Database schemas
│   │
│   └── utils/                  # Shared helpers
│       ├── apiError.ts
│       ├── asyncHandler.ts
│       ├── auth/
│       └── ai/
│
├── devcontainer/
│   └── docker-compose-local.yaml
│
├── docs/
│
├── .env.sample
├── package.json
├── turbo.json
├── tsconfig.base.json
└── README.md

```

---

## 🧠 AI Design Philosophy

- AI **never returns free text**
- AI **always returns structured JSON**
- UI contains **zero AI logic**
- Schemas are the **single source of truth**
- Gemini is treated as a **decision engine**, not a chatbot

This makes the system:

- predictable
- debuggable
- scalable
- prodQuick Start

### Prerequisites

- **Node.js** 18+ and npm 10+
- **MongoDB** 7.0+ (local or Atlas)
- **Google AI API Key** ([Get it here](https://makersuite.google.com/app/apikey))
- **Cloudinary Account** ([Sign up](https://cloudinary.com/))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/dev-rohit-gupta/resume-buddy.git
cd resume-buddy

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.sample apps/server/.env

# 4. Build packages
npm run build

# 5. Start development server
npm run dev
```

### Environment Configuration

Create `apps/server/.env` with these variables:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/resume-buddy
# Or MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/resume-buddy

# Google AI (Gemini)
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here

# JWT Authentication
ACCESS_TOKEN_SECRET=your-super-secret-jwt-key-min-32-characters
ACCESS_TOKEN_EXPIRY=7d

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### ✅ Perfect For

- 🎓 **College Students** - Planning internships and first jobs
- 👶 **Freshers** - Navigating early career decisions
- 🧑‍💻 **Early-Career Developers** - Strategic job hunting
- 📚 **Career Switchers** - Evaluating new opportunities

### ❌ NOT For

- 🚫 Mass resume spamming
- 🚫 Applying to everything without strategy
- 🚫 Expecting AI to write your resume
- 🚫 Looking for a chatbot conversation

### ✅ BEST For

- ✨ Thoughtful, strategic applications
- ✨ Understanding your readiness level
- ✨ Prioritizing skill development
- ✨ Making informed career decisions

---

## 🎬 How It Works

### Step-by-Step Flow

```
1. 📝 Sign Up
   └─ Upload your resume (PDF/DOCX)
   └─ AI extracts your skills, projects, experience

2. 🎯 Find Opportunity
   └─ Paste job/internship description
   └─ Add optional details (location, experience level)

3. 🧠 AI Analysis
   └─ Gemini AI processes your profile + job details
   └─ Generates structured analysis (not free text)

4. 📊 Get Results
   └─ ATS Score (0-100)
   └─ Skill Gaps (Critical, Major, Minor)
   └─ Learning Roadmap (Prioritized)
   └─ Decision: Apply / Prepare / Skip
   └─ Resume Improvements
   └─ Risk Indicators

5. 💾 Track History
   └─ View past analyses
   └─ Monitor skill progress
   └─ Compare opportunities
```

---

## �️ Roadmap

### ✅ Current Features (v1.0)

- [x] Resume extraction (PDF/DOCX)
- [x] Job opportunity analysis
- [x] ATS compatibility scoring
- [x] Skill gap detection
- [x] Learning roadmap generation
- [x] Career insights dashboard
- [x] JWT authentication
- [x] File upload (Cloudinary)

### 🚧 Coming Soon

- [ ] Resume auto-rewrite engine
- [ ] Job comparison dashboard (side-by-side)
- [ ] Skill progress tracking over time
- [ ] Multiple resume versions
- [ ] Company culture fit analysis
- [ ] Salary expectation insights
- [ ] Chrome extension for job sites
- [ ] Email notifications for opportunities

### 💭 Future Ideas

- [ ] LinkedIn profile integration
- [ ] GitHub activity analysis
- [ ] Mock interview preparation
- [ ] Referral matching system

---

## 🐛 Known Issues & Limitations

- Resume parsing may struggle with heavily formatted PDFs
- Scanned PDFs (images) not supported - use text-based PDFs
- AI analysis limited by job description quality
- Free Gemini API has rate limits (60 requests/min)

See [Issues](https://github.com/dev-rohit-gupta/resume-buddy/issues) for current bugs and feature requests.

---

## 📊 Project Stats

![TypeScript](https://img.shields.io/github/languages/top/dev-rohit-gupta/resume-buddy)
![Code Size](https://img.shields.io/github/languages/code-size/dev-rohit-gupta/resume-buddy)
![Last Commit](https://img.shields.io/github/last-commit/dev-rohit-gupta/resume-buddy)

---

## 🙏 Acknowledgments

- **Google Gemini AI** - Powering intelligent decision-making
- **MongoDB** - Reliable data storage
- **Cloudinary** - Seamless file management
- **Open Source Community** - Inspiration and support

---

## 📞 Support & Contact

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/dev-rohit-gupta/resume-buddy/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/dev-rohit-gupta/resume-buddy/discussions)
- 📧 **Email**: your-email@example.com
- 🌐 **Website**: [resumebuddy.dev](https://resumebuddy.dev) _(coming soon)_

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

## 🧠 Final Note

Resume Buddy is built on one core belief:

### **"Clarity is more valuable than motivation."**

Don't apply blindly. Don't spam resumes.

✨ **Apply less. Prepare better. Apply smarter.** ✨

---

**Made with ❤️ for students and freshers navigating their career journey**

[⬆ Back to Top](#-resume-buddy)

</div>t Guidelines

```bash
# Run tests
npm test

# Type checking
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines.

- [🤖 AI Engine](docs/packages/ai-engine.md) - Gemini integration and operations
- [📋 Schemas](docs/packages/schemas.md) - Zod validation schemas
- [🛠️ Utils](docs/packages/utils.md) - Shared utilities and helpers

### Feature Guides

- [🎯 Opportunity Analysis](docs/features/opportunity-analysis.md) - Job evaluation workflow
- [📄 Resume Extraction](docs/features/resume-extraction.md) - PDF/DOCX parsing
- [📊 Career Insights](docs/features/career-insights.md) - ATS signals and scoring

### Technical Deep Dives

- [💾 Database](docs/technical/database.md) - MongoDB models and queries
- [🔐 Authentication](docs/technical/authentication.md) - JWT and security
- [📤 File Uploads](docs/technical/file-uploads.md) - Multer and CloudinaryMONGODB_URI` - MongoDB connection string
- `GOOGLE_GENAI_API_KEY` - Google Gemini API key
- `ACCESS_TOKEN_SECRET` - JWT secret for authentication
- `ACCESS_TOKEN_EXPIRY` - Token expiration time
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `NODE_ENV` - Environment (development/production)

### 4️⃣ Build the project

```bash
npm run build
```

### 5️⃣ Run the development server

```bash
npm run dev
```

Open in browser:

```
http://localhost:4000
```

---

## 🧩 Who Is This For?

- 🎓 College students
- 👶 Freshers
- 🧑‍💻 Early-career developers
- ❌ Not for mass resume spamming
- ✅ For thoughtful, strategic applications

<!-- ---

## 🛣️ Roadmap

* [ ] ATS score hybrid logic (AI + rules)
* [ ] Resume auto-rewrite engine
* [ ] Job comparison dashboard
* [ ] Skill progress tracking
* [ ] PDF resume reviewer
* [ ] Chrome extension -->

---

## 🤝 Contributing

Contributions are welcome.

Before contributing:

- Follow schema-first design
- Do not add chat-based features
- Keep AI output strictly structured

---

## 📜 License

MIT License

---

## 🧠 Final Note

Resume Buddy is built on one belief:

> **Clarity is more valuable than motivation.**

Apply less.
Prepare better.
Apply smarter.
