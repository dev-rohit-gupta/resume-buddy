# Resume Buddy 🧠📄

**Resume Buddy** is an AI-powered **career decision engine** that helps students and freshers evaluate jobs and internships _before applying_.

Instead of blindly applying, Resume Buddy analyzes:

- the **job/internship details**
- the **user’s skills, projects, and profile**

and returns a **structured, honest analysis** such as:

- ATS compatibility score
- Skill gap analysis
- Learning roadmap
- Application decision (Apply / Prepare / Skip)
- Resume improvement actions
- Precautions & risk indicators

> ⚠️ This is **not** a chatbot and **not** a resume builder.  
> Resume Buddy is designed to answer one question clearly:
>
> **“Should I apply for this opportunity or prepare first?”**

---

## ✨ Key Features

- 📊 **ATS Compatibility Score** (realistic, not motivational)
- 🧩 **Skill Gap Detection** with priority levels
- 🛣️ **Learning Roadmap** (what to learn first, not everything)
- ✅ **Application Decision Engine**
- 🧠 **Gemini-powered AI analysis**
- 📄 **Resume improvement actions**
- ⚠️ **Precautions & red-flag indicators**
- 🧱 **Schema-first architecture** (stable & predictable)

---

## 🏗️ Architecture Overview

```

User (HTML Form)
↓
Express Server (/api/analyze)
↓
Gemini AI Engine (structured prompt)
↓
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
- production-ready

---

## 🧪 Example AI Output (Simplified)

```json
{
  "atsAnalysis": {
    "atsScore": 64,
    "selectionProbability": "Medium"
  },
  "skillGapAnalysis": {
    "missingSkills": ["MongoDB"]
  },
  "applicationDecision": {
    "recommendation": "Apply After Preparation"
  }
}
```

This JSON directly powers the dashboard — **no parsing hacks**.

---

## 🚀 Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/dev-rohit-gupta/resume-buddy
cd resume-buddy
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

```bash
cp .env.sample apps/server/.env
```

Update the `.env` file with your credentials:

- `PORT` - Server port (default: 4000)
- `MONGODB_URI` - MongoDB connection string
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
