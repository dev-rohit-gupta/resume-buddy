# Resume Extraction Feature

The Resume Extraction feature automatically parses uploaded resume files (PDF/DOCX) and extracts structured data using AI.

## 🎯 Overview

This feature:
- Accepts PDF and DOCX resume files
- Extracts text content accurately
- Uses AI to structure data into predefined schema
- Validates and scores extraction confidence
- Stores resume data for future analyses

## 🔄 Workflow

```
User uploads resume (signup/update)
        ↓
Multer middleware (file validation)
        ↓
Convert file to buffer
        ↓
Parse PDF/DOCX to text
        ↓
AI Engine (Gemini)
  - Extract structured data
  - Follow Resume schema
        ↓
Calculate confidence score
        ↓
Validate with Zod schema
        ↓
Save to database
        ↓
Upload original file to Cloudinary
        ↓
Return structured resume object
```

## 📂 File Handling

### Supported Formats

1. **PDF** (`.pdf`)
   - MIME: `application/pdf`
   - Library: `pdf-parse`
   - Max Size: 10MB

2. **DOCX** (`.docx`)
   - MIME: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
   - Library: `mammoth`
   - Max Size: 10MB

### File Upload Configuration

**Multer Middleware** (`middleware/multer.middleware.ts`):

```typescript
import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and DOCX files allowed'), false);
  }
};

export const uploader = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024  // 10MB
  }
});
```

### File Parsing

**PDF Parsing**:
```typescript
import pdfParse from 'pdf-parse';

async function parsePDF(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text;
}
```

**DOCX Parsing**:
```typescript
import mammoth from 'mammoth';

async function parseDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}
```

**Unified Parser**:
```typescript
import { parseResume } from '@resume-buddy/utils';

const text = await parseResume(file.buffer, file.mimetype);
```

## 🧠 AI Extraction Process

### System Prompt

The AI receives specific instructions to extract structured data:

```typescript
const RESUME_EXTRACTION_PROMPT = `
You are an AI that extracts structured data from resumes.

Input: Resume text content
Output: JSON conforming to Resume schema

Rules:
- Use null for missing singular fields
- Use empty arrays [] for missing lists
- Extract all available information
- Maintain accuracy over guessing
- Return minified JSON only
`;
```

### Extraction Operation

```typescript
import { analyzeResume } from '@resume-buddy/ai-engine';

const resumeData = await analyzeResume(
  file.buffer,
  file.mimetype
);
```

### Resume Schema

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
  
  education: [{
    degree: string | null,
    field: string | null,
    institution: string | null,
    startYear: string | null,
    endYear: string | null,
    grade: string | null
  }],
  
  experience: [{
    role: string | null,
    company: string | null,
    location: string | null,
    startDate: string | null,
    endDate: string | null,
    description: string[],
    type: "job" | "internship"
  }],
  
  projects: [{
    title: string | null,
    description: string | null,
    techStack: string[],
    link: string | null
  }],
  
  skills: {
    technical: string[],
    soft: string[],
    tools: string[]
  } | null,
  
  certifications: [{
    name: string | null,
    issuer: string | null,
    year: string | null,
    url: string | null
  }],
  
  achievements: [{
    title: string | null,
    description: string | null,
    year: string | null
  }],
  
  languages: [{
    name: string,
    proficiency: "basic" | "intermediate" | "fluent" | "native"
  }],
  
  metadata: {
    resumeVersion: number,
    extractedAt: string,
    sourceFileType: "pdf" | "docx",
    confidenceScore: number
  }
}
```

## 📊 Confidence Scoring

### Calculation

```typescript
import { getResumeConfidenceScore } from '@resume-buddy/utils';

function getResumeConfidenceScore(resume: Resume): number {
  let score = 0;
  
  // Basic info (30 points)
  if (resume.basics.name) score += 10;
  if (resume.basics.email) score += 10;
  if (resume.basics.phone) score += 5;
  if (resume.basics.links?.linkedin) score += 5;
  
  // Education (15 points)
  score += Math.min(resume.education.length * 5, 15);
  
  // Experience (20 points)
  score += Math.min(resume.experience.length * 5, 20);
  
  // Projects (15 points)
  score += Math.min(resume.projects.length * 5, 15);
  
  // Skills (10 points)
  if (resume.skills?.technical.length) {
    score += Math.min(resume.skills.technical.length * 2, 10);
  }
  
  // Summary (10 points)
  if (resume.summary && resume.summary.length > 50) score += 10;
  
  return Math.min(score, 100);
}
```

### Interpretation

| Score | Quality |
|-------|---------|
| 90-100 | Excellent - Complete information |
| 70-89 | Good - Most details extracted |
| 50-69 | Fair - Some missing information |
| 30-49 | Poor - Many gaps |
| 0-29 | Very Poor - Minimal data |

## 💾 Storage

### Database Storage

Extracted resume data is stored in MongoDB:

```typescript
// models/resume.model.ts
const ResumeSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    ref: 'User'
  },
  data: {
    type: Object,  // Resume schema
    required: true
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 100
  },
  originalFileUrl: String,
  createdAt: Date,
  updatedAt: Date
});
```

### Cloud Storage

Original resume file is uploaded to Cloudinary for backup:

```typescript
import { v2 as cloudinary } from 'cloudinary';

const uploadResult = await cloudinary.uploader.upload_stream(
  {
    folder: 'resumes',
    resource_type: 'raw',
    public_id: `resume_${userId}`
  },
  (error, result) => {
    if (error) throw error;
    return result.secure_url;
  }
).end(file.buffer);
```

## 🔍 Extraction Examples

### Example 1: Complete Resume

**Input PDF**:
```
John Doe
john.doe@email.com | +1-234-567-8900
github.com/johndoe | linkedin.com/in/johndoe

SUMMARY
Experienced software engineer with 3+ years in full-stack development...

EDUCATION
B.Tech in Computer Science
XYZ University | 2018-2022 | GPA: 8.5/10

EXPERIENCE
Software Engineer | ABC Corp | Jan 2022 - Present
- Developed REST APIs using Node.js and Express
- Reduced response time by 40%

PROJECTS
E-commerce Platform
Tech Stack: React, Node.js, MongoDB
Built a full-stack e-commerce application...

SKILLS
Technical: JavaScript, React, Node.js, MongoDB
Tools: Git, Docker, AWS
```

**Extracted JSON**:
```json
{
  "basics": {
    "name": "John Doe",
    "email": "john.doe@email.com",
    "phone": "+1-234-567-8900",
    "links": {
      "github": "https://github.com/johndoe",
      "linkedin": "https://linkedin.com/in/johndoe"
    }
  },
  "summary": "Experienced software engineer with 3+ years in full-stack development...",
  "education": [{
    "degree": "B.Tech",
    "field": "Computer Science",
    "institution": "XYZ University",
    "startYear": "2018",
    "endYear": "2022",
    "grade": "8.5/10"
  }],
  "experience": [{
    "role": "Software Engineer",
    "company": "ABC Corp",
    "startDate": "Jan 2022",
    "endDate": "Present",
    "description": [
      "Developed REST APIs using Node.js and Express",
      "Reduced response time by 40%"
    ],
    "type": "job"
  }],
  "projects": [{
    "title": "E-commerce Platform",
    "techStack": ["React", "Node.js", "MongoDB"],
    "description": "Built a full-stack e-commerce application..."
  }],
  "skills": {
    "technical": ["JavaScript", "React", "Node.js", "MongoDB"],
    "tools": ["Git", "Docker", "AWS"]
  },
  "metadata": {
    "confidenceScore": 92,
    "extractedAt": "2024-01-27T10:30:00Z",
    "sourceFileType": "pdf"
  }
}
```

### Example 2: Minimal Resume

**Input**:
```
Jane Smith
jane@email.com

Education:
B.Sc Computer Science, 2023

Skills: Python, Java
```

**Extracted JSON**:
```json
{
  "basics": {
    "name": "Jane Smith",
    "email": "jane@email.com",
    "phone": null,
    "links": null
  },
  "summary": null,
  "education": [{
    "degree": "B.Sc",
    "field": "Computer Science",
    "endYear": "2023",
    "institution": null,
    "startYear": null,
    "grade": null
  }],
  "experience": [],
  "projects": [],
  "skills": {
    "technical": ["Python", "Java"],
    "soft": [],
    "tools": []
  },
  "certifications": [],
  "achievements": [],
  "languages": [],
  "metadata": {
    "confidenceScore": 35,
    "extractedAt": "2024-01-27T10:30:00Z",
    "sourceFileType": "pdf"
  }
}
```

## 🚨 Error Handling

### Common Issues

1. **Corrupted PDF**
```typescript
Error: Failed to parse PDF
Solution: Re-upload or try different format
```

2. **Password-Protected File**
```typescript
Error: PDF is encrypted
Solution: Remove password and re-upload
```

3. **Scanned Image PDF**
```typescript
// No text extracted
Result: Empty resume data
Solution: Use OCR or manually input
```

4. **AI Parsing Error**
```typescript
Error: Invalid JSON from AI
Solution: Retry extraction or fallback
```

### Validation

All extracted data is validated:

```typescript
import { ResumeSchema } from '@resume-buddy/schemas';

try {
  const validated = ResumeSchema.parse(extractedData);
  // Safe to use
} catch (error) {
  // Invalid structure
  throw new ApiError(500, 'Resume extraction failed');
}
```

## 🧪 Testing

### Unit Tests

```typescript
describe('Resume Extraction', () => {
  it('should extract PDF resume', async () => {
    const buffer = fs.readFileSync('test-resume.pdf');
    const result = await analyzeResume(buffer, 'application/pdf');
    
    expect(result.basics.name).toBeDefined();
    expect(result.metadata.confidenceScore).toBeGreaterThan(0);
  });
  
  it('should handle DOCX files', async () => {
    const buffer = fs.readFileSync('test-resume.docx');
    const result = await analyzeResume(buffer, 'application/vnd...');
    
    expect(result).toHaveProperty('basics');
  });
});
```

### Integration Tests

```typescript
it('should upload and extract on signup', async () => {
  const response = await request(app)
    .post('/api/auth/signup')
    .field('name', 'Test User')
    .field('email', 'test@example.com')
    .field('password', 'password123')
    .attach('file', 'test-resume.pdf');
  
  expect(response.status).toBe(201);
  expect(response.body.data.user).toHaveProperty('resume');
});
```

## 📈 Performance

- **PDF Parsing**: ~500ms
- **DOCX Parsing**: ~300ms
- **AI Extraction**: 2-5 seconds
- **Total Time**: 3-6 seconds

### Optimization Tips

1. **Parallel Operations**
```typescript
const [text, cloudinaryUrl] = await Promise.all([
  parseResume(buffer, mimeType),
  uploadToCloudinary(buffer)
]);
```

2. **Caching**
```typescript
// Cache extracted resumes
const cacheKey = `resume:${userId}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);
```

3. **Background Processing**
```typescript
// Queue resume extraction for large files
await queue.add('extractResume', {
  userId,
  fileBuffer: buffer.toString('base64')
});
```

## 🔄 Resume Updates

Users can re-upload resumes to update their profile:

```typescript
// Update endpoint
PUT /api/users/resume
- Accepts new file
- Extracts new data
- Overwrites old resume
- Recalculates confidence score
```

## 🎯 Best Practices

### For Users

1. **Use clear formatting** - Sections clearly labeled
2. **Include keywords** - Technical skills, tools
3. **Quantify achievements** - Numbers, percentages
4. **Add links** - GitHub, LinkedIn, portfolio
5. **Use standard sections** - Education, Experience, Projects
6. **Avoid images/graphics** - Text-based only
7. **Keep it current** - Update regularly

### For Developers

1. **Validate all inputs** - File type, size
2. **Handle errors gracefully** - Retry logic
3. **Test with various formats** - Different resume styles
4. **Monitor confidence scores** - Track extraction quality
5. **Log extraction failures** - Debug issues
6. **Provide fallback** - Manual input option

## 📚 Related Documentation

- [AI Engine](../packages/ai-engine.md) - Extraction implementation
- [Schemas](../packages/schemas.md) - Resume schema details
- [Utils](../packages/utils.md) - Parsing utilities
- [File Uploads](../technical/file-uploads.md) - Multer & Cloudinary

---

**Extraction Philosophy**: Accuracy over completeness, structure over guesswork.
