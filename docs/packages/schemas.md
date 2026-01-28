# Schemas Package

The Schemas package is the **single source of truth** for all data structures in Resume Buddy. It provides runtime validation using Zod and TypeScript type definitions.

## 📦 Package Info

- **Name**: `@resume-buddy/schemas`
- **Location**: `packages/schemas/`
- **Main Purpose**: Type-safe data validation and type definitions

## 🎯 Purpose

This package ensures:
- ✅ Runtime type safety with Zod
- ✅ Compile-time type safety with TypeScript
- ✅ Consistent data structures across the application
- ✅ AI input/output validation
- ✅ API request/response validation
- ✅ Database model validation

## 📁 Structure

```
packages/schemas/
├── src/
│   ├── index.ts                    # Main exports
│   ├── ai/
│   │   ├── input.schema.ts         # AI input schema (job data)
│   │   ├── output.schema.ts        # AI output schema (analysis)
│   │   ├── resume.schema.ts        # Resume data schema
│   │   ├── atsAnalysis.schema.ts   # ATS analysis schema
│   │   ├── engineInput.schema.ts   # AI engine input types
│   │   └── careerProfile.schema.ts # Career profile schema
│   ├── db/
│   │   └── resume.schema.ts        # Database resume schema
│   ├── api.ts                      # API response types
│   ├── user.schema.ts              # User schema
│   ├── job.schema.ts               # Job schema
│   ├── email.schema.ts             # Email validation
│   ├── url.schema.ts               # URL validation
│   ├── candidate.level.ts          # Candidate level enum
│   └── optional.schemas.ts         # Optional field helpers
├── package.json
└── tsconfig.json
```

## 📋 Main Schemas

### 1. AI Input Schema (`ai/input.schema.ts`)

Defines the structure for job/internship opportunities submitted for AI analysis.

**Schema**: `AIInputSchema`

**Structure**:
```typescript
{
  meta: {
    source: string,              // "LinkedIn", "Internshala"
    type: "Internship" | "Job" | "Freelance",
    title: string,
    companyName: string,
    companyType: "NGO" | "Startup" | "MNC" | "Unknown",
    location: {
      type: "Remote" | "Onsite" | "Hybrid",
      city: string | null,
      country: string
    },
    postedDate: string,          // ISO date string
    applyBy: string,             // ISO date string
    openings: number             // >= 1
  },
  workDetails: {
    duration: string,
    startDate: string,
    stipend: {
      type: "Paid" | "Unpaid",
      amount: number | null,
      currency: string | null,
      frequency: "Monthly" | "Weekly" | null
    },
    responsibilities: string[],
    learningOutcomes: string[]
  },
  skills: {
    required: Array<{
      name: string,
      level: "Basic" | "Intermediate" | "Advanced"
    }>,
    frameworks: string[],
    databases: string[],
    tools: string[],
    optional: string[]
  },
  eligibility: {
    education: string[],
    year: string[],
    experienceRequired: boolean,
    minAge: number | null,
    otherCriteria: string[]
  },
  perks: {
    certificate: boolean,
    letterOfRecommendation: boolean,
    jobOffer: boolean,
    flexibleHours: boolean
  },
  companyInfo: {
    description: string,
    industry: string,
    website: string | null,
    trustScore: number | null    // 0-100
  },
  rawData: {
    fullDescriptionText: string,
    sourceURL: string
  }
}
```

**Usage**:
```typescript
import { AIInputSchema, AIInput } from '@resume-buddy/schemas';

// Validate input
const validatedData = AIInputSchema.parse(rawInput);

// Type-safe usage
const handleJob = (job: AIInput) => {
  console.log(job.meta.title);
};
```

**Enums**:
- `JobTypeSchema`: "Internship" | "Job" | "Freelance"
- `CompanyTypeSchema`: "NGO" | "Startup" | "MNC" | "Unknown"
- `LocationTypeSchema`: "Remote" | "Onsite" | "Hybrid"
- `SkillLevelSchema`: "Basic" | "Intermediate" | "Advanced"
- `StipendTypeSchema`: "Paid" | "Unpaid"
- `FrequencySchema`: "Monthly" | "Weekly"

---

### 2. AI Output Schema (`ai/output.schema.ts`)

Defines the structure of AI analysis results.

**Schema**: `AIOutputSchema`

**Structure**:
```typescript
{
  stats: {
    difficulty: "Beginner" | "Intermediate" | "Advanced",
    learningFocused: boolean,
    competitionLevel: "Low" | "Medium" | "High",
    match: "Low" | "Partial" | "Good" | "Perfect"
  },
  atsAnalysis: {
    atsScore: number,            // 0-100
    selectionProbability: "Low" | "Medium" | "High",
    reasons: string[]
  },
  skillGapAnalysis: {
    matchedSkills: string[],
    missingSkills: Array<{
      skill: string,
      priority: "High" | "Medium" | "Low",
      whyItMatters: string
    }>
  },
  learningPlan: {
    mustLearnFirst: Array<{
      skill: string,
      estimatedTime: string,
      impact: string
    }>,
    goodToHave: string[]
  },
  applicationDecision: {
    shouldApply: boolean,
    recommendation: "Apply Now" | "Apply After Preparation" | "Skip",
    reasoning: string[]
  },
  precautions: {
    riskLevel: "Low" | "Medium" | "High",
    notes: string[]
  },
  resumeActions: {
    add: string[],
    improve: string[],
    remove: string[]
  }
}
```

**Usage**:
```typescript
import { AIOutputSchema, AIOutput } from '@resume-buddy/schemas';

const result: AIOutput = await analyzeJob(user, jobData);
const validated = AIOutputSchema.parse(result); // Runtime validation
```

---

### 3. Resume Schema (`ai/resume.schema.ts`)

Structure for extracted resume data.

**Schema**: `ResumeSchema`

**Key Fields**:
```typescript
{
  basics: {
    name: string | null,
    email: string | null,
    phone: string | null,
    location: string | null,
    links: {
      linkedin: string | null,
      github: string | null,
      portfolio: string | null
    } | null
  },
  summary: string | null,
  education: Array<{
    degree: string | null,
    field: string | null,
    institution: string | null,
    startYear: string | null,
    endYear: string | null,
    grade: string | null
  }>,
  experience: Array<{
    role: string | null,
    company: string | null,
    location: string | null,
    startDate: string | null,
    endDate: string | null,
    description: string[],
    type: "job" | "internship"
  }>,
  projects: Array<{
    title: string | null,
    description: string | null,
    techStack: string[],
    link: string | null
  }>,
  skills: {
    technical: string[],
    soft: string[],
    tools: string[]
  } | null,
  certifications: Array<{...}>,
  achievements: Array<{...}>,
  languages: Array<{...}>,
  metadata: {
    resumeVersion: number,
    extractedAt: string,
    sourceFileType: "pdf" | "docx",
    confidenceScore: number
  }
}
```

---

### 4. Career Profile Schema (`ai/careerProfile.schema.ts`)

Career insights and ATS analysis.

**Schema**: `CareerProfileSchema`

**Structure**:
```typescript
{
  atsAnalysis: {
    globalSignals: {
      workEvidence: { level: 0|1|2|3, reason: string },
      skillApplication: { level: 0|1|2|3, reason: string },
      outcomeImpact: { level: 0|1|2|3, reason: string },
      clarityStructure: { level: 0|1|2|3, reason: string },
      consistency: { level: 0|1|2|3, reason: string },
      specificity: { level: 0|1|2|3, reason: string },
      effortSignal: { level: 0|1|2|3, reason: string },
      redFlags: { level: 0|1|2|3, reason: string }
    },
    rawObservations: {
      projectsDetected: boolean,
      internshipDetected: boolean,
      metricsMentioned: boolean,
      portfolioDetected: boolean
    }
  },
  bestRole: string,
  nearestNextRole: string,
  skillGaps: string[]
}
```

**ATS Signal Levels**:
- `0`: None/Missing
- `1`: Basic/Academic
- `2`: Practical/Applied
- `3`: Production/Professional

---

### 5. User Schema (`user.schema.ts`)

User account information.

**Schema**: `UserSchema`

```typescript
{
  id: string,
  name: string,
  email: string,
  password: string,          // Hashed
  role: "user" | "admin",
  avatar: string,            // URL
  resume: Resume | null,
  createdAt: Date,
  updatedAt: Date
}
```

**Usage**:
```typescript
import { UserSchema, User } from '@resume-buddy/schemas';

const user: User = {
  id: "usr_123",
  name: "John Doe",
  email: "john@example.com",
  // ...
};
```

---

### 6. Job Schema (`job.schema.ts`)

Stored job/internship records.

**Schema**: `JobSchema`

Extends `AIInputSchema` with:
```typescript
{
  userId: string,
  analysisResult: AIOutput | null,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔧 Utility Schemas

### Optional Schemas (`optional.schemas.ts`)

Helper schemas for optional fields.

**`optionalUrl`**:
```typescript
export const optionalUrl = z
  .string()
  .url()
  .nullable()
  .or(z.literal(""));

// Accepts: null, "", or valid URL
```

**`optionalString`**:
```typescript
export const optionalString = z
  .string()
  .nullable()
  .or(z.literal(""));
```

### Email Schema (`email.schema.ts`)

```typescript
export const EmailSchema = z
  .string()
  .email()
  .toLowerCase()
  .trim();
```

### URL Schema (`url.schema.ts`)

```typescript
export const UrlSchema = z
  .string()
  .url()
  .trim();
```

---

## 🎨 Design Patterns

### 1. Schema-First Development

**Always define schemas before implementation**:

```typescript
// Step 1: Define schema
export const NewFeatureSchema = z.object({
  field1: z.string(),
  field2: z.number()
});

// Step 2: Export type
export type NewFeature = z.infer<typeof NewFeatureSchema>;

// Step 3: Use in code
function handleFeature(data: NewFeature) {
  // TypeScript knows the structure
}
```

### 2. Runtime Validation

**Validate all external data**:

```typescript
import { AIInputSchema } from '@resume-buddy/schemas';

// API endpoint
app.post('/api/analyze', (req, res) => {
  try {
    const validData = AIInputSchema.parse(req.body);
    // Safe to use validData
  } catch (error) {
    // Zod validation error
    res.status(400).json({ errors: error.errors });
  }
});
```

### 3. Type Inference

**Let Zod infer TypeScript types**:

```typescript
const MySchema = z.object({
  name: z.string(),
  age: z.number()
});

// Auto-inferred type
type MyType = z.infer<typeof MySchema>;
// Equivalent to: { name: string; age: number }
```

---

## 📚 API Types (`api.ts`)

Standard API response wrappers.

### `ApiResponse<T>`

```typescript
interface ApiResponse<T> {
  success: true;
  message: string;
  statusCode: number;
  data: T;
}
```

### `ApiError`

```typescript
interface ApiError {
  success: false;
  message: string;
  statusCode: number;
  errors: any[];
  stack?: string;
}
```

**Usage**:
```typescript
import { ApiResponse } from '@resume-buddy/schemas';

const response: ApiResponse<User> = {
  success: true,
  message: "User found",
  statusCode: 200,
  data: user
};
```

---

## 🔄 Schema Versioning

When updating schemas:

1. **Breaking Changes** - Increment major version
2. **New Optional Fields** - Increment minor version
3. **Bug Fixes** - Increment patch version

**Example Migration**:
```typescript
// v1
const UserSchemaV1 = z.object({
  name: z.string(),
  email: z.string()
});

// v2 - Add optional field (non-breaking)
const UserSchemaV2 = z.object({
  name: z.string(),
  email: z.string(),
  avatar: z.string().optional()
});

// v3 - Change required field (breaking)
const UserSchemaV3 = z.object({
  name: z.string(),
  email: z.string(),
  avatar: z.string() // Now required!
});
```

---

## 🚨 Common Validation Errors

### 1. Missing Required Field

```typescript
// Error: Required
const schema = z.object({ name: z.string() });
schema.parse({}); // ❌ Throws: name is required
```

**Solution**: Provide all required fields or make optional:
```typescript
const schema = z.object({ name: z.string().optional() });
```

### 2. Wrong Type

```typescript
const schema = z.object({ age: z.number() });
schema.parse({ age: "25" }); // ❌ Throws: Expected number, received string
```

**Solution**: Transform or convert:
```typescript
const schema = z.object({ 
  age: z.string().transform(Number) 
});
```

### 3. Invalid Format

```typescript
const schema = z.object({ email: z.string().email() });
schema.parse({ email: "invalid" }); // ❌ Throws: Invalid email
```

**Solution**: Use proper format or `.regex()` for custom validation

---

## 📖 Best Practices

1. **Always Export Types**
   ```typescript
   export const MySchema = z.object({...});
   export type MyType = z.infer<typeof MySchema>;
   ```

2. **Use `.strict()` for AI Schemas**
   ```typescript
   const AIInputSchema = z.object({...}).strict();
   // Rejects unknown properties
   ```

3. **Provide Default Values**
   ```typescript
   const schema = z.object({
     name: z.string(),
     role: z.string().default("user")
   });
   ```

4. **Use `.optional()` vs `.nullable()`**
   - `.optional()`: Field can be undefined
   - `.nullable()`: Field can be null
   - `.optional().nullable()`: Both

5. **Custom Error Messages**
   ```typescript
   const schema = z.object({
     email: z.string().email({ message: "Invalid email format" })
   });
   ```

6. **Reuse Common Schemas**
   ```typescript
   const AddressSchema = z.object({...});
   
   const UserSchema = z.object({
     name: z.string(),
     address: AddressSchema  // Reuse
   });
   ```

---

## 🔗 Dependencies

```json
{
  "dependencies": {
    "zod": "^3.22.0"
  }
}
```

No other dependencies - schemas are pure Zod.

---

## 📚 Related Documentation

- [AI Engine](./ai-engine.md) - How schemas are used in AI operations
- [API Reference](../API_REFERENCE.md) - API request/response schemas
- [Database](../technical/database.md) - MongoDB model schemas
- [Utils](./utils.md) - Schema validation utilities

---

## 💡 Tips

1. **IDE Autocomplete** - TypeScript + Zod gives great autocomplete
2. **Runtime Safety** - Validate all external inputs (API, files, AI)
3. **Documentation** - Schemas serve as documentation
4. **Single Source of Truth** - Don't duplicate type definitions
5. **Validate Your Schemas** - Check edge cases manually

---

**Schemas Philosophy**: Define once, validate everywhere, trust nothing external.
