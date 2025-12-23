
# Resume Buddy 🧠📄

**Resume Buddy** is an AI-powered **career decision engine** that helps students and freshers evaluate jobs and internships *before applying*.

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
│       │   ├── routes/         # API routes
│       │   ├── controllers/    # Request handling
│       │   ├── services/       # Business logic
│       │   ├── db/             # MongoDB connection
│       │   └── static/         # HTML / CSS / JS frontend
│
├── packages/
│   ├── ai-engine/              # Gemini-based AI engine
│   │   ├── gemini/
│   │   │   ├── client.ts
│   │   │   ├── prompts.ts
│   │   │   └── analyze.ts
│   │
│   ├── schemas/                # AI input/output contracts
│   │   ├── ai-input.schema.ts
│   │   └── ai-output.schema.ts
│   │
│   └── utils/                  # Shared helpers
│
├── docs/
│   └── architecture.md
│
├── .env.example
├── package.json
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
````

This JSON directly powers the dashboard — **no parsing hacks**.

---

## 🚀 Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/your-username/resume-buddy.git
cd resume-buddy
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

```bash
cp .env.example .env
```

Add:

* `GEMINI_API_KEY`
* `MONGODB_URI`

### 4️⃣ Run the development server

```bash
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

## 🧩 Who Is This For?

* 🎓 College students
* 👶 Freshers
* 🧑‍💻 Early-career developers
* ❌ Not for mass resume spamming
* ✅ For thoughtful, strategic applications

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

* Follow schema-first design
* Do not add chat-based features
* Keep AI output strictly structured

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

