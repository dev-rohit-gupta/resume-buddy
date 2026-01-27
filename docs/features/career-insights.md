# Career Insights Feature

The Career Insights feature analyzes a user's resume to provide comprehensive career guidance, skill assessments, and personalized recommendations.

## 🎯 Overview

This feature provides:
- **ATS Analysis** - 8-dimensional resume quality assessment
- **Best Fit Role** - Current career level and role
- **Next Best Role** - Career progression suggestion
- **Skill Gaps** - What to learn for advancement
- **Raw Observations** - Detected resume elements

## 🔄 Workflow

```
User signs up / updates resume
        ↓
Resume extracted (AI)
        ↓
buildCareerProfile() called
        ↓
AI analyzes resume comprehensively
  - 8 ATS signals evaluation
  - Role identification
  - Skill gap detection
        ↓
Calculate overall ATS score
        ↓
Store career profile
        ↓
Display on dashboard
```

## 🧠 AI Analysis Process

### Operation Call

```typescript
import { buildCareerProfile } from '@resume-buddy/ai-engine';

const careerProfile = await buildCareerProfile(resumeData);
```

### System Prompt

The AI receives specific instructions:

```typescript
const CAREER_PROFILE_PROMPT = `
Generate career profile from resume data only. No external assumptions.

Tasks:
- Identify bestRole (current level)
- Identify nearestNextRole (next career step)
- Calculate 3-6 realistic skill gaps
- Rate 8 signals using levels 0-3

Levels:
0 = none/missing
1 = basic/academic
2 = practical/applied
3 = production/professional

Signals:
1. workEvidence - Real-world experience depth
2. skillApplication - How skills are used
3. outcomeImpact - Measurable results
4. clarityStructure - Resume organization
5. consistency - Information coherence
6. specificity - Detail precision
7. effortSignal - Resume quality effort
8. redFlags - Suspicious elements

Output minified JSON only.
`;
```

## 📊 ATS Signal Analysis

### The 8 Signals

#### 1. **Work Evidence**

Measures real-world work experience depth.

**Levels**:
- `0`: No work experience, only academic projects
- `1`: Academic projects or coursework
- `2`: Internships, freelance, or significant projects
- `3`: Production experience, deployed projects, real users

**Example**:
```json
{
  "workEvidence": {
    "level": 2,
    "reason": "2 internships with deployed projects, but limited production experience"
  }
}
```

#### 2. **Skill Application**

How technical skills are practically applied.

**Levels**:
- `0`: Skills only listed, no application shown
- `1`: Basic usage in academic context
- `2`: Meaningful application in projects
- `3`: Optimized, scaled, production-grade usage

**Example**:
```json
{
  "skillApplication": {
    "level": 3,
    "reason": "React used in 3 production apps with performance optimization"
  }
}
```

#### 3. **Outcome Impact**

Measurable results and business impact.

**Levels**:
- `0`: No outcomes mentioned, only tasks
- `1`: Tasks completed, no results
- `2`: Qualitative outcomes described
- `3`: Quantitative metrics (40% faster, 1000+ users)

**Example**:
```json
{
  "outcomeImpact": {
    "level": 3,
    "reason": "Multiple quantified achievements: 40% performance gain, 5000+ users"
  }
}
```

#### 4. **Clarity & Structure**

Resume organization and readability.

**Levels**:
- `0`: Messy, hard to follow
- `1`: Readable but inconsistent
- `2`: Clean structure, well-organized
- `3`: Professional, recruiter-optimized

**Example**:
```json
{
  "clarityStructure": {
    "level": 2,
    "reason": "Clear sections, consistent formatting, minor improvements possible"
  }
}
```

#### 5. **Consistency**

Information coherence across resume.

**Levels**:
- `0`: Major contradictions or gaps
- `1`: Minor inconsistencies
- `2`: Mostly consistent
- `3`: Fully coherent narrative

**Example**:
```json
{
  "consistency": {
    "level": 2,
    "reason": "Skills align with projects, minor date gaps"
  }
}
```

#### 6. **Specificity**

Detail precision and concreteness.

**Levels**:
- `0`: Generic statements only
- `1`: Mix of generic and specific
- `2`: Mostly precise details
- `3`: Highly specific, concrete examples

**Example**:
```json
{
  "specificity": {
    "level": 2,
    "reason": "Good technical details, but some vague descriptions"
  }
}
```

#### 7. **Effort Signal**

Quality and effort put into resume.

**Levels**:
- `0`: Template, no customization
- `1`: Some personalization
- `2`: Strong effort, thoughtful
- `3`: Exceptional quality and care

**Example**:
```json
{
  "effortSignal": {
    "level": 2,
    "reason": "Well-crafted project descriptions, clear value proposition"
  }
}
```

#### 8. **Red Flags**

Suspicious or concerning elements.

**Levels**:
- `0`: No red flags
- `1`: Minor concerns (gaps explained)
- `2`: Suspicious elements
- `3`: High concerns (fake projects, plagiarism)

**Example**:
```json
{
  "redFlags": {
    "level": 0,
    "reason": "No suspicious patterns detected"
  }
}
```

## 🎯 Role Identification

### Best Fit Role (Current)

The role that best matches the candidate's current skill level and experience.

**Determination Factors**:
- Primary technical skills
- Years of experience
- Project complexity
- Work evidence level
- Education background

**Examples**:
- "Frontend Developer" - React focus, 1-2 years
- "Full Stack Developer" - MERN stack, 2-3 years
- "Backend Engineer" - Node.js/Python, API experience
- "Junior Software Engineer" - Fresh graduate, projects
- "Data Analyst" - SQL, Python, visualization

**Edge Cases**:
- No clear role → "Aspiring Developer"
- Multiple strong areas → Most dominant skill
- Only academic → "Student / Fresher"

### Next Best Fit Role (Career Progression)

The logical next step in career growth.

**Progression Paths**:
```
Junior Developer → Mid-level Developer → Senior Developer
Frontend Developer → Full Stack Developer
Backend Developer → DevOps Engineer
Data Analyst → Data Scientist
```

**Determination**:
- Current role + skill gaps = Next role
- Realistic 1-2 year progression
- Based on industry standards

**Examples**:
```json
{
  "bestRole": "Frontend Developer",
  "nearestNextRole": "Full Stack Developer",
  "skillGaps": ["Node.js", "MongoDB", "API Design"]
}
```

## 🔍 Skill Gap Analysis

### Identification Process

1. **Analyze Current Skills**
   - Extract from resume
   - Categorize by proficiency

2. **Identify Next Role Requirements**
   - Common skills for target role
   - Industry standards

3. **Calculate Gaps**
   - Required skills not in resume
   - Prioritize by importance
   - Limit to 3-6 critical gaps

### Gap Selection Criteria

**Included**:
- ✅ Essential for next role
- ✅ Learnable in 1-6 months
- ✅ High market demand
- ✅ Clear learning path

**Excluded**:
- ❌ Already in resume
- ❌ Too advanced for next step
- ❌ Niche/uncommon
- ❌ Soft skills (separate category)

### Example Output

```json
{
  "skillGaps": [
    "System Design",
    "Docker",
    "PostgreSQL",
    "GraphQL",
    "CI/CD Pipelines"
  ]
}
```

## 📊 Raw Observations

### Detected Elements

```json
{
  "rawObservations": {
    "projectsDetected": true,
    "internshipDetected": true,
    "metricsMentioned": true,
    "portfolioDetected": false
  }
}
```

**Usage**:
- Quick resume quality check
- Identify missing elements
- Provide targeted suggestions

## 💯 ATS Score Calculation

### Formula

```typescript
import { calcAtsScore } from '@resume-buddy/utils';

function calcAtsScore(atsReport: GeneralAtsReport): number {
  const weights = {
    workEvidence: 20,
    skillApplication: 15,
    outcomeImpact: 15,
    clarityStructure: 10,
    consistency: 10,
    specificity: 10,
    effortSignal: 10,
    redFlags: 10  // Penalty
  };
  
  let totalScore = 0;
  
  for (const [signal, weight] of Object.entries(weights)) {
    const level = atsReport.globalSignals[signal].level;
    const normalized = level / 3;  // 0-3 → 0-1
    
    if (signal === 'redFlags') {
      // Square penalty for harsh reduction
      const penalty = normalized * normalized;
      totalScore += (1 - penalty) * weight;
    } else {
      totalScore += normalized * weight;
    }
  }
  
  return Math.round((totalScore / 100) * 100);
}
```

### Score Interpretation

| Score | Quality | Meaning |
|-------|---------|---------|
| 90-100 | Excellent | Production-ready, strong portfolio |
| 75-89 | Good | Solid experience, minor improvements |
| 60-74 | Above Average | Decent foundation, gaps exist |
| 45-59 | Average | Needs significant work |
| 30-44 | Below Average | Major improvements needed |
| 0-29 | Poor | Minimal or problematic resume |

### Red Flag Penalty

Red flags are penalized more harshly using squared reduction:

```
No red flags (0): 100% score contribution
Minor concerns (1): 89% score contribution
Suspicious (2): 56% score contribution
High concerns (3): 0% score contribution
```

## 🎨 Dashboard Display

### Career Profile Card

```javascript
<div class="career-profile">
  <h2>Career Insights</h2>
  
  <div class="ats-score">
    <div class="score-circle" style="--score: ${atsScore}">
      <span>${atsScore}</span>/100
    </div>
    <p>Resume Quality Score</p>
  </div>
  
  <div class="roles">
    <div class="current-role">
      <h3>Best Fit Role</h3>
      <p>${bestRole}</p>
    </div>
    
    <div class="next-role">
      <h3>Next Step</h3>
      <p>${nearestNextRole}</p>
    </div>
  </div>
  
  <div class="skill-gaps">
    <h3>Skills to Learn</h3>
    <ul>
      ${skillGaps.map(skill => `<li>${skill}</li>`)}
    </ul>
  </div>
</div>
```

### Signal Breakdown

```javascript
<div class="signals-breakdown">
  <h3>Resume Quality Signals</h3>
  
  ${Object.entries(signals).map(([name, {level, reason}]) => `
    <div class="signal">
      <div class="signal-header">
        <span>${name}</span>
        <div class="level-indicator level-${level}">
          ${level}/3
        </div>
      </div>
      <p class="reason">${reason}</p>
    </div>
  `).join('')}
</div>
```

## 📈 Use Cases

### 1. First-Time User (Signup)

```
User uploads resume
  ↓
Resume extracted
  ↓
Career profile generated
  ↓
Dashboard shows:
  - ATS Score: 42
  - Best Role: "Aspiring Developer"
  - Next Role: "Junior Frontend Developer"
  - Skills to Learn: ["React", "Git", "JavaScript ES6"]
```

### 2. Experienced User (Update)

```
User updates resume with new project
  ↓
Re-analyze career profile
  ↓
Dashboard updated:
  - ATS Score: 68 → 75
  - Best Role: "Junior Frontend" → "Frontend Developer"
  - Next Role: "Full Stack Developer"
  - Skills to Learn: ["Node.js", "MongoDB", "REST APIs"]
```

### 3. Job Seeker

```
Before applying, user checks dashboard
  ↓
Sees skill gaps for target role
  ↓
Learns missing skills
  ↓
Updates resume
  ↓
ATS score improves
  ↓
Applies with confidence
```

## 🧪 Testing

### Unit Tests

```typescript
describe('buildCareerProfile', () => {
  it('should generate career profile', async () => {
    const profile = await buildCareerProfile(mockResume);
    
    expect(profile).toHaveProperty('bestRole');
    expect(profile).toHaveProperty('nearestNextRole');
    expect(profile.skillGaps.length).toBeGreaterThan(0);
  });
  
  it('should calculate ATS score', () => {
    const score = calcAtsScore(mockAtsReport);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
```

## 🔄 Profile Updates

Career profiles are regenerated when:
1. User uploads new resume
2. User updates profile manually
3. Significant time passed (suggested: monthly)

## 🚀 Future Enhancements

- [ ] Skill progress tracking over time
- [ ] Personalized learning resources
- [ ] Industry-specific role matching
- [ ] Salary range estimation
- [ ] Career path visualization
- [ ] Peer benchmarking
- [ ] Resume improvement suggestions

## 📚 Related Documentation

- [AI Engine](../packages/ai-engine.md) - Profile generation
- [Schemas](../packages/schemas.md) - Career profile schema
- [Utils](../packages/utils.md) - ATS score calculation
- [Resume Extraction](./resume-extraction.md) - Resume data source

---

**Insights Philosophy**: Evidence-based assessment, honest feedback, actionable guidance.
