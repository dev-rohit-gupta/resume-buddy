# AI Engine Package

The AI Engine package provides AI-powered operations using Google's Gemini model for resume analysis, job matching, and career insights.

## 📦 Package Info

- **Name**: `@resume-buddy/ai-engine`
- **Location**: `packages/ai-engine/`
- **Main Exports**: `analyzeJob`, `analyzeResume`, `buildCareerProfile`

## 🎯 Purpose

The AI Engine acts as a **decision engine** (not a chatbot) that:
- Analyzes job opportunities against user resumes
- Extracts structured data from resume files
- Builds career profiles and insights
- Returns **structured JSON only** (no free text)

## 📁 Structure

```
packages/ai-engine/
├── src/
│   ├── index.ts                   # Main exports
│   ├── client/
│   │   └── gemini.client.ts       # Gemini SDK client
│   ├── engine/
│   │   └── run.engine.ts          # Core AI execution engine
│   ├── operations/
│   │   ├── analyze.job.ts         # Job vs Resume analysis
│   │   ├── resume.extract.ts      # Resume data extraction
│   │   └── buildCareerProfile.ts  # Career insights generation
│   └── prompts/
│       └── system.prompt.ts       # System instructions for AI
├── package.json
└── tsconfig.json
```

## 🚀 Operations

### 1. `analyzeJob()`

Analyzes a job opportunity against user's resume and returns detailed insights.

**Signature**:
```typescript
function analyzeJob(user: User, jobData: AIInput): Promise<AIOutput>
```

**Parameters**:
- `user` - User object with resume data
- `jobData` - Job opportunity details (validated against `AIInputSchema`)

**Returns**: `AIOutput` with:
- ATS score and selection probability
- Skill gap analysis
- Learning roadmap
- Application decision (Apply/Prepare/Skip)
- Resume improvement actions
- Risk assessment

**Example**:
```typescript
import { analyzeJob } from '@resume-buddy/ai-engine';

const result = await analyzeJob(user, {
  meta: {
    title: "Full Stack Developer",
    companyName: "Google",
    type: "Internship",
    // ...
  },
  skills: {
    required: [
      { name: "React", level: "Intermediate" }
    ],
    // ...
  }
  // ... more fields
});

console.log(result.atsAnalysis.atsScore); // 78
console.log(result.applicationDecision.recommendation); // "Apply After Preparation"
```

**AI Configuration**:
- Model: `gemini-1.5-flash` (Gemini Flash 1.5)
- Thinking Level: `HIGH`
- System Instruction: `SYSTEM_INSTRUCTION.JOB_ANALYSIS`

---

### 2. `analyzeResume()`

Extracts structured data from uploaded resume files (PDF/DOCX).

**Signature**:
```typescript
function analyzeResume(buffer: Buffer, mimeType: string): Promise<Resume>
```

**Parameters**:
- `buffer` - File buffer from uploaded resume
- `mimeType` - MIME type (`application/pdf` or `application/vnd.openxmlformats-officedocument.wordprocessingml.document`)

**Returns**: `Resume` object with:
- Basic info (name, email, phone, links)
- Education history
- Work experience
- Projects
- Skills (technical, soft, tools)
- Certifications
- Achievements
- Languages
- Metadata (confidence score, extraction timestamp)

**Example**:
```typescript
import { analyzeResume } from '@resume-buddy/ai-engine';
import fs from 'fs';

const buffer = fs.readFileSync('resume.pdf');
const resume = await analyzeResume(buffer, 'application/pdf');

console.log(resume.basics.name); // "John Doe"
console.log(resume.skills.technical); // ["React", "Node.js", "MongoDB"]
console.log(resume.metadata.confidenceScore); // 85
```

**AI Configuration**:
- Model: `gemini-1.5-flash` (Gemini Flash 1.5)
- System Instruction: `SYSTEM_INSTRUCTION.RESUME_EXTRACTION`
- Input: Resume text content

---

### 3. `buildCareerProfile()`

Generates career insights and profile from resume data.

**Signature**:
```typescript
function buildCareerProfile(resume: Resume): Promise<CareerProfile>
```

**Parameters**:
- `resume` - Resume object (from `analyzeResume`)

**Returns**: `CareerProfile` with:
- ATS analysis signals (8 dimensions, 0-3 scale)
- Best fit role (current level)
- Next best fit role (career progression)
- Skill gaps for advancement
- Raw observations (projects, internships, metrics)

**Example**:
```typescript
import { buildCareerProfile, analyzeResume } from '@resume-buddy/ai-engine';

const resume = await analyzeResume(buffer, mimeType);
const profile = await buildCareerProfile(resume);

console.log(profile.bestRole); // "Frontend Developer"
console.log(profile.nearestNextRole); // "Senior Frontend Developer"
console.log(profile.skillGaps); // ["System Design", "GraphQL", "Docker"]
console.log(profile.atsAnalysis.globalSignals.workEvidence.level); // 2
```

**AI Configuration**:
- Model: `gemini-1.5-flash` (Gemini Flash 1.5)
- System Instruction: `SYSTEM_INSTRUCTION.CAREER_PROFILE_BUILD`
- Thinking Level: `HIGH`

**ATS Signal Levels**:
- `0` - None/Missing
- `1` - Basic/Academic
- `2` - Practical/Applied
- `3` - Production/Professional

---

## 🔧 Core Components

### Gemini Client

**File**: `client/gemini.client.ts`

Creates and configures the Gemini AI client.

```typescript
import { createGeminiClient } from '@resume-buddy/ai-engine';

const ai = createGeminiClient();
// Returns configured GenerativeModel instance
```

**Configuration**:
- API Key from environment: `GOOGLE_GENAI_API_KEY`
- Default model: `gemini-1.5-flash` (Gemini Flash 1.5)
- Safety settings: Block only high-harm content

---

### Engine Runner

**File**: `engine/run.engine.ts`

Core execution engine that handles AI requests.

```typescript
interface EngineInput {
  type: 'text' | 'metadata' | 'file';
  value: any;
}

interface RunEngineParams {
  ai: GenerativeModel;
  model: string;
  inputs: EngineInput[];
  config?: GenerateContentConfig;
}

async function runEngine(params: RunEngineParams): Promise<string>
```

**Features**:
- Processes multiple input types
- Maps inputs to Gemini content format
- Handles streaming responses
- Error handling and retries

---

### System Prompts

**File**: `prompts/system.prompt.ts`

Contains carefully crafted system instructions for each operation.

**Available Prompts**:

1. **`JOB_ANALYSIS`** - For `analyzeJob()`
   - Comprehensive job-resume matching prompt
   - Defines output schema with TypeScript interfaces
   - Rules for ATS scoring, skill gap analysis, etc.

2. **`RESUME_EXTRACTION`** - For `analyzeResume()`
   - Resume parsing and data extraction
   - Schema for structured resume data
   - Confidence scoring rules

3. **`CAREER_PROFILE_BUILD`** - For `buildCareerProfile()`
   - Career insights generation
   - 8-signal ATS analysis framework
   - Role identification and skill gap detection

**Design Principles**:
- ✅ Request JSON output explicitly
- ✅ Provide complete schema definitions
- ✅ Include validation rules
- ✅ Specify output format (minified JSON)
- ❌ No conversational tone
- ❌ No markdown formatting in output

---

## 📋 Schema Validation

All AI inputs and outputs are validated using Zod schemas from `@resume-buddy/schemas`.

### Input Validation

```typescript
import { AIInputSchema } from '@resume-buddy/schemas';

const validatedInput = AIInputSchema.parse(jobData);
// Throws ZodError if invalid
```

### Output Validation

```typescript
import { AIOutputSchema } from '@resume-buddy/schemas';
import { safeParseAIJson } from '@resume-buddy/utils';

const rawResult = await runEngine({...});
const cleanedResult = safeParseAIJson<AIOutput>(rawResult);
const validatedOutput = AIOutputSchema.parse(cleanedResult);
```

---

## 🎨 AI Design Philosophy

### 1. Structured Output Only

AI **never** returns free text. Every response is valid JSON conforming to predefined schemas.

**Why?**
- Predictable and debuggable
- Type-safe integration
- Easy to test and validate
- UI can render directly without parsing

### 2. Schema-First Approach

Schemas are defined **before** prompts. AI is instructed to follow the exact schema.

**Example from Prompt**:
```typescript
// Prompt includes:
export interface AIOutput {
  stats: { difficulty: "Beginner" | "Intermediate" | "Advanced"; ... }
  atsAnalysis: { atsScore: number; ... }
  // ...
}
```

### 3. No AI Logic in UI

The frontend contains **zero** AI logic. It only:
- Sends validated input to API
- Receives structured output
- Renders components from data

### 4. AI as Pure Function

```
Input (validated) → AI Engine → Output (validated)
```

No side effects, no state, no memory between calls.

---

## ⚙️ Configuration

### Environment Variables

```env
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
```

### Model Selection

Current default: `gemini-1.5-flash` (Gemini Flash 1.5)

To change model (if needed):
```typescript
const result = await runEngine({
  ai: createGeminiClient(),
  model: 'gemini-1.5-pro', // More powerful model
  inputs: [...],
  config: {...}
});
```

### Thinking Configuration

For complex reasoning tasks:
```typescript
import { ThinkingLevel } from '@google/genai';

const config = {
  systemInstruction: "...",
  thinkingConfig: {
    thinkingLevel: ThinkingLevel.HIGH, // or MEDIUM, LOW
  }
};
```

---

## 🧪 Testing

### Unit Tests

```typescript
import { analyzeJob } from '@resume-buddy/ai-engine';

describe('analyzeJob', () => {
  it('should return valid AIOutput', async () => {
    const result = await analyzeJob(mockUser, mockJobData);
    expect(result).toHaveProperty('atsAnalysis');
    expect(result.atsAnalysis.atsScore).toBeGreaterThan(0);
  });
});
```

### Integration Tests

```typescript
// Test with real Gemini API
const result = await analyzeJob(realUser, realJobData);
AIOutputSchema.parse(result); // Should not throw
```

### Mock for Development

```typescript
// Mock AI engine for fast testing
jest.mock('@resume-buddy/ai-engine', () => ({
  analyzeJob: jest.fn().mockResolvedValue(mockAIOutput),
}));
```

---

## 🚨 Error Handling

### Common Errors

1. **API Key Invalid**
```
Error: Invalid API key
Solution: Check GOOGLE_GENAI_API_KEY in .env
```

2. **Schema Validation Failed**
```
ZodError: Invalid input
Solution: Validate input with AIInputSchema before calling
```

3. **AI Output Invalid JSON**
```
SyntaxError: Unexpected token
Solution: Use safeParseAIJson to clean markdown/code blocks
```

4. **Rate Limit Exceeded**
```
Error: 429 Too Many Requests
Solution: Implement retry logic or reduce request frequency
```

### Error Recovery

```typescript
try {
  const result = await analyzeJob(user, jobData);
  return result;
} catch (error) {
  if (error instanceof ZodError) {
    // Schema validation failed
    console.error('Invalid input/output', error.errors);
  } else {
    // AI engine error
    console.error('AI operation failed', error);
  }
  throw new ApiError('Analysis failed', 500);
}
```

---

## 🔒 Security Considerations

1. **API Key Protection**
   - Never commit API keys to version control
   - Use environment variables
   - Rotate keys periodically

2. **Input Sanitization**
   - All inputs validated with Zod
   - No user input directly to AI without validation
   - File size limits enforced

3. **Output Validation**
   - Always validate AI output before use
   - Don't trust AI output blindly
   - Schema enforcement prevents injection

---

## 📊 Performance

### Typical Response Times

- `analyzeJob()`: 3-8 seconds
- `analyzeResume()`: 2-5 seconds
- `buildCareerProfile()`: 2-4 seconds

### Optimization Tips

1. **Parallel Processing**
   ```typescript
   const [resume, profile] = await Promise.all([
     analyzeResume(buffer, mimeType),
     buildCareerProfile(existingResume)
   ]);
   ```

2. **Caching**
   - Cache resume extraction results
   - Cache career profiles (TTL: 24 hours)
   - Don't cache job analyses (personalized)

3. **Batch Operations**
   - Process multiple jobs in parallel (with rate limits)
   - Use background jobs for bulk operations

---

## 🔗 Dependencies

```json
{
  "dependencies": {
    "@google/genai": "^1.0.0",
    "@resume-buddy/schemas": "workspace:*"
  }
}
```

---

## 📚 Related Documentation

- [Schemas Package](./schemas.md) - Validation schemas
- [API Reference](../API_REFERENCE.md) - REST API endpoints
- [Architecture](../ARCHITECTURE.md) - System design
- [Utils Package](./utils.md) - Helper utilities

---

## 💡 Best Practices

1. **Always validate inputs** - Use Zod schemas before AI calls
2. **Validate outputs** - Never trust AI output without validation
3. **Handle errors gracefully** - AI can fail, plan for it
4. **Keep prompts versioned** - Track prompt changes in git
5. **Test with real data** - Mock tests aren't enough
6. **Monitor AI costs** - Track API usage and costs
7. **Update schemas carefully** - Breaking changes affect AI output

---

**AI Engine Philosophy**: Structured, predictable, production-ready AI operations.
