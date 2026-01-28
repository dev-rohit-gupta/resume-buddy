# Opportunity Analysis Feature

The Opportunity Analysis feature is the core of Resume Buddy - it analyzes job/internship opportunities against a user's resume and provides detailed, actionable insights.

## 🎯 Overview

This feature helps users make informed decisions about job applications by providing:
- **ATS Compatibility Score** - How well the resume matches the job
- **Skill Gap Analysis** - What's missing and why it matters
- **Learning Roadmap** - What to learn first, with time estimates
- **Application Decision** - Apply now, prepare first, or skip
- **Resume Actions** - Specific improvements to make
- **Risk Assessment** - Potential red flags or concerns

## 🔄 Workflow

```
User fills opportunity form
        ↓
Frontend validates input
        ↓
POST /api/opportunities/analyze
        ↓
Auth middleware (verify user)
        ↓
Opportunity controller
        ↓
Opportunity service
  - Fetch user data
  - Fetch resume data
  - Validate job data
        ↓
AI Engine (Gemini)
  - Analyze match
  - Generate insights
        ↓
Validate AI output
        ↓
Save to database
        ↓
Return structured JSON
        ↓
Frontend renders results
```

## 📋 Input Form

### Form Fields

The opportunity analysis form collects comprehensive job/internship details organized into sections:

#### **Basic Meta**
- Job Title (e.g., "Full Stack Developer Intern")
- Source (e.g., "LinkedIn", "Internshala")
- Job Type: Internship | Job | Freelance
- Company Name
- Company Type: Startup | MNC | NGO | Unknown
- Industry (e.g., "FinTech", "SaaS")
- Location Type: Remote | Onsite | Hybrid
- City (optional)
- Country
- Posted Date
- Apply By Date
- Number of Openings

#### **Work Details**
- Duration (e.g., "6 Months")
- Start Date (e.g., "Immediate", "1st July")
- Stipend Type: Paid | Unpaid
- Stipend Amount (optional, if paid)
- Currency (default: INR)
- Frequency: Monthly | Weekly
- Responsibilities (list)
- Learning Outcomes (list)

#### **Skills & Stack**
- Required Skills (with proficiency levels)
  - Skill Name
  - Level: Basic | Intermediate | Advanced
- Frameworks (e.g., "Next.js", "Django")
- Databases (e.g., "MongoDB", "PostgreSQL")
- Tools (optional)

#### **Eligibility**
- Education Requirements (e.g., "B.Tech IT", "BCA")
- Minimum Age
- Experience Required (yes/no)
- Other Criteria

#### **Perks**
- Certificate (checkbox)
- Letter of Recommendation (checkbox)
- Job Offer / PPO (checkbox)
- Flexible Hours (checkbox)

#### **Company Profile**
- Company Description
- Company Website
- Trust Score (0-100, indicates data reliability)

#### **Raw Data**
- Full Job Description (paste entire JD)
- Source URL (link to original posting)

### Form Validation

**Frontend Validation**:
```javascript
// Required fields
- title, source, companyName, industry
- postedDate, applyBy, openings
- duration, startDate
- companyDesc, fullJD, sourceURL

// Optional fields
- city, website, stipendAmount, minAge

// Format validation
- URLs (website, sourceURL)
- Dates (postedDate, applyBy)
- Numbers (openings, stipendAmount, trustScore)
```

**Backend Validation**:
```typescript
import { AIInputSchema } from '@resume-buddy/schemas';

const validatedData = AIInputSchema.parse(req.body);
// Throws ZodError if invalid
```

## 🧠 AI Analysis Process

### Input Preparation

```typescript
// Service layer prepares data
const user = await getUserById(userId);
const resume = await getResumeByUserId(userId);

const aiInput = {
  ...validatedJobData,
  user: {
    id: user.id,
    resume: resume.data
  }
};
```

### AI Engine Call

```typescript
import { analyzeJob } from '@resume-buddy/ai-engine';

const analysisResult = await analyzeJob(user, jobData);
```

### AI Prompt Context

The AI receives:
1. **Complete job data** (structured JSON)
2. **User's resume** (extracted data)
3. **System instructions** (analysis guidelines)

The AI evaluates:
- Resume-to-job skill alignment
- Experience level match
- Education requirements
- Project relevance
- Competition estimation
- Learning curve
- Application timing

### Output Structure

```typescript
{
  stats: {
    difficulty: "Beginner" | "Intermediate" | "Advanced",
    learningFocused: boolean,
    competitionLevel: "Low" | "Medium" | "High",
    match: "Low" | "Partial" | "Good" | "Perfect"
  },
  
  atsAnalysis: {
    atsScore: number,              // 0-100
    selectionProbability: "Low" | "Medium" | "High",
    reasons: string[]              // Why this score?
  },
  
  skillGapAnalysis: {
    matchedSkills: string[],       // Skills user has
    missingSkills: [{
      skill: string,
      priority: "High" | "Medium" | "Low",
      whyItMatters: string
    }]
  },
  
  learningPlan: {
    mustLearnFirst: [{
      skill: string,
      estimatedTime: string,       // "2 weeks", "1 month"
      impact: string                // Why critical?
    }],
    goodToHave: string[]           // Nice-to-have skills
  },
  
  applicationDecision: {
    shouldApply: boolean,
    recommendation: "Apply Now" | "Apply After Preparation" | "Skip",
    reasoning: string[]            // Justification
  },
  
  precautions: {
    riskLevel: "Low" | "Medium" | "High",
    notes: string[]                // Red flags, concerns
  },
  
  resumeActions: {
    add: string[],                 // What to add
    improve: string[],             // What to enhance
    remove: string[]               // What to remove
  }
}
```

## 📊 Analysis Components

### 1. ATS Score (0-100)

**Factors**:
- Keyword matching
- Skills alignment
- Experience relevance
- Education match
- Project portfolio
- Resume formatting
- Missing critical requirements

**Interpretation**:
- `0-40`: Poor match, major gaps
- `41-60`: Fair match, significant preparation needed
- `61-80`: Good match, minor improvements needed
- `81-100`: Excellent match, apply confidently

### 2. Selection Probability

Based on ATS score + competition level:

| ATS Score | Competition | Probability |
|-----------|-------------|-------------|
| 80+ | Low | High |
| 80+ | Medium | High |
| 80+ | High | Medium |
| 60-79 | Low | High |
| 60-79 | Medium | Medium |
| 60-79 | High | Low |
| < 60 | Any | Low |

### 3. Skill Gap Analysis

**Matched Skills**:
- Skills explicitly mentioned in resume
- Skills inferred from projects/experience
- Tool proficiencies

**Missing Skills**:
- **High Priority**: Required for role, no substitute
- **Medium Priority**: Important but can be learned on job
- **Low Priority**: Nice-to-have, not critical

**Why It Matters**: Each missing skill includes context about its importance.

### 4. Learning Plan

**Must Learn First**:
- Prioritized by impact and urgency
- Realistic time estimates
- Clear impact explanation
- Ordered by dependency

**Good to Have**:
- Optional skills for bonus points
- Future career growth skills
- Industry-specific tools

### 5. Application Decision

**Apply Now**:
- Good skill match (70%+)
- Meets all critical requirements
- High selection probability
- Low risk

**Apply After Preparation**:
- Decent match (50-69%)
- 1-3 critical skills missing
- Can learn in 2-4 weeks
- Medium risk

**Skip**:
- Poor match (< 50%)
- Too many critical gaps
- Overqualified or underqualified
- High risk, low probability

### 6. Resume Actions

**Add**:
- Missing projects showcasing required skills
- Certifications in key technologies
- Relevant keywords from JD
- Quantifiable achievements

**Improve**:
- Weak project descriptions
- Vague experience bullets
- Missing impact metrics
- Technical depth

**Remove**:
- Outdated technologies
- Irrelevant experiences
- Redundant information
- Generic statements

### 7. Precautions & Risks

**Risk Levels**:
- **Low**: Standard application, no red flags
- **Medium**: Some concerns (unpaid, unclear role)
- **High**: Major red flags (unrealistic requirements)

**Common Notes**:
- Unpaid internship concerns
- Unrealistic tech stack for duration
- Unclear job description
- Company reputation issues
- Overworked red flags

## 💾 Data Storage

### Saved to Database

```typescript
{
  userId: string,
  jobData: AIInput,              // Original form data
  analysisResult: AIOutput,      // AI analysis
  createdAt: Date,
  updatedAt: Date
}
```

### Benefits

1. **History Tracking**: View past analyses
2. **Pattern Recognition**: Learn from patterns
3. **Progress Monitoring**: Track skill development
4. **Comparison**: Compare multiple opportunities

## 🎨 UI Presentation

### Results Display

The analysis results are displayed in a modal with sections:

1. **Header**
   - ATS Score (large, color-coded)
   - Job Title and Company

2. **Quick Stats**
   - Difficulty level
   - Competition level
   - Match percentage
   - Apply decision

3. **Recommendation Card**
   - Apply Now / Prepare / Skip
   - Primary reasoning

4. **Skill Gap Section**
   - Matched skills (green badges)
   - Missing skills (red cards with priority)

5. **Learning Plan**
   - Must learn first (ordered list)
   - Time estimates
   - Impact explanations

6. **Resume Actions**
   - Add suggestions
   - Improve suggestions
   - Remove suggestions

### Color Coding

```javascript
// ATS Score colors
function getScoreColor(score) {
  if (score >= 80) return '#22c55e';  // Green
  if (score >= 60) return '#eab308';  // Yellow
  if (score >= 40) return '#f97316';  // Orange
  return '#ef4444';                   // Red
}

// Match level
function getMatchColor(match) {
  if (match === 'Perfect') return '#22c55e';
  if (match === 'Good') return '#84cc16';
  if (match === 'Partial') return '#f59e0b';
  return '#ef4444';
}
```

## 🔍 Example Analysis

### Input

```json
{
  "meta": {
    "title": "Full Stack Developer Intern",
    "companyName": "TechStartup Inc",
    "type": "Internship",
    "location": { "type": "Remote" },
    "openings": 2
  },
  "skills": {
    "required": [
      { "name": "React", "level": "Intermediate" },
      { "name": "Node.js", "level": "Basic" },
      { "name": "MongoDB", "level": "Basic" }
    ],
    "frameworks": ["Express", "Next.js"]
  }
}
```

### Output

```json
{
  "stats": {
    "difficulty": "Intermediate",
    "match": "Good",
    "competitionLevel": "Medium"
  },
  "atsAnalysis": {
    "atsScore": 72,
    "selectionProbability": "High",
    "reasons": [
      "Strong React experience from 3 projects",
      "Basic Node.js knowledge demonstrated",
      "Missing Next.js experience"
    ]
  },
  "skillGapAnalysis": {
    "matchedSkills": ["React", "JavaScript", "Git"],
    "missingSkills": [
      {
        "skill": "Next.js",
        "priority": "High",
        "whyItMatters": "Required framework for company's tech stack"
      }
    ]
  },
  "applicationDecision": {
    "shouldApply": true,
    "recommendation": "Apply After Preparation",
    "reasoning": [
      "Strong foundation in React",
      "Learn Next.js basics (1-2 weeks)",
      "Good company reputation"
    ]
  }
}
```

## 📈 Performance Metrics

- **Average Analysis Time**: 3-8 seconds
- **Success Rate**: ~95%
- **Schema Validation**: 100% (enforced)
- **AI Accuracy**: Subjective, but consistent

## 🚀 Future Enhancements

- [ ] Batch analysis (multiple jobs at once)
- [ ] Comparison view (side-by-side)
- [ ] Historical trend analysis
- [ ] Email notifications for deadline reminders
- [ ] Chrome extension for quick analysis
- [ ] PDF export of analysis report
- [ ] Skill gap progress tracking

## 📚 Related Documentation

- [AI Engine](../packages/ai-engine.md) - How analysis works
- [Schemas](../packages/schemas.md) - Input/output validation
- [API Reference](../API_REFERENCE.md) - API endpoints
- [Database](../technical/database.md) - Data storage

---

**Feature Philosophy**: Honest, actionable insights over motivational fluff.
