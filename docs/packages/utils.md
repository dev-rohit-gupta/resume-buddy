# Utils Package

The Utils package provides shared utility functions, helpers, and common patterns used across the Resume Buddy application.

## 📦 Package Info

- **Name**: `@resume-buddy/utils`
- **Location**: `packages/utils/`
- **Purpose**: Shared utilities, error handling, API helpers, AI utilities, authentication

## 📁 Structure

```
packages/utils/
├── src/
│   ├── index.ts                          # Main exports
│   ├── apiError.ts                       # Custom error class
│   ├── apiResponse.ts                    # API response wrapper
│   ├── asyncHandler.ts                   # Async error handler
│   ├── dateCompare.ts                    # Date comparison utilities
│   ├── deepMerge.ts                      # Deep object merging
│   ├── errors.ts                         # Error constants
│   ├── generate.key.utils.ts             # Key generation
│   ├── getResumeConfidenceScore.ts       # Resume confidence calculation
│   ├── resumeParser.ts                   # PDF/DOCX parser
│   ├── stream.utils.ts                   # Stream utilities
│   ├── ai/
│   │   ├── mapInputsToContents.ts        # AI input mapping
│   │   ├── safeParseAIJson.ts            # Safe JSON parsing
│   │   └── calcAtsScore.ts               # ATS score calculation
│   └── auth/
│       └── verifyToken.ts                # JWT verification
├── package.json
└── tsconfig.json
```

## 🔧 Core Utilities

### 1. Error Handling

#### `ApiError`

Custom error class for API operations.

**File**: `apiError.ts`

```typescript
class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(
    statusCode: number, 
    message: string, 
    isOperational = true
  );
}
```

**Usage**:
```typescript
import { ApiError } from '@resume-buddy/utils';

// Throw operational error
throw new ApiError(404, 'User not found');

// Throw server error
throw new ApiError(500, 'Database connection failed');

// Non-operational error (programming error)
throw new ApiError(500, 'Unexpected error', false);
```

**Status Codes**:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

#### `asyncHandler`

Wrapper for async route handlers to catch errors automatically.

**File**: `asyncHandler.ts`

```typescript
function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): (req: Request, res: Response, next: NextFunction) => void
```

**Usage**:
```typescript
import { asyncHandler } from '@resume-buddy/utils';

// Without asyncHandler
app.get('/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// With asyncHandler
app.get('/users', asyncHandler(async (req, res) => {
  const users = await getUsers();
  res.json(users);
  // Errors automatically caught and passed to error middleware
}));
```

**Benefits**:
- Eliminates try-catch boilerplate
- Automatically forwards errors to error middleware
- Cleaner, more readable code

---

#### Error Constants

**File**: `errors.ts`

```typescript
export const Errors = {
  USER_NOT_FOUND: 'User not found',
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Unauthorized access',
  // ...
};
```

**Usage**:
```typescript
import { Errors } from '@resume-buddy/utils';

throw new ApiError(404, Errors.USER_NOT_FOUND);
```

---

### 2. API Response

#### `ApiResponse`

Standardized API response wrapper.

**File**: `apiResponse.ts`

```typescript
class ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;

  constructor(data: T, message: string, statusCode: number);
}
```

**Usage**:
```typescript
import { ApiResponse } from '@resume-buddy/utils';

// Success response
res.status(200).json(
  new ApiResponse(user, "User fetched successfully", 200)
);

// Response format
{
  "success": true,
  "statusCode": 200,
  "message": "User fetched successfully",
  "data": { /* user object */ }
}
```

---

### 3. Authentication Utilities

#### `verifyAccessToken`

Verify and decode JWT tokens.

**File**: `auth/verifyToken.ts`

```typescript
async function verifyAccessToken(token: string): Promise<{
  id: string;
  role: "user" | "admin";
}>
```

**Usage**:
```typescript
import { verifyAccessToken } from '@resume-buddy/utils';

try {
  const payload = await verifyAccessToken(token);
  console.log(payload.id);    // "usr_123"
  console.log(payload.role);  // "user"
} catch (error) {
  // Invalid or expired token
  throw new ApiError(401, 'Invalid token');
}
```

**Environment Variables Required**:
- `ACCESS_TOKEN_SECRET` - Secret key for JWT signing/verification

---

#### `getToken`

Extract JWT token from request.

```typescript
function getToken(req: Request): string | undefined
```

**Usage**:
```typescript
import { getToken } from '@resume-buddy/utils';

const token = getToken(req);
// Checks:
// 1. req.cookies.accessToken
// 2. req.headers.authorization (Bearer token)
```

---

### 4. AI Utilities

#### `safeParseAIJson`

Safely parse JSON from AI output, removing markdown/code blocks.

**File**: `ai/safeParseAIJson.ts`

```typescript
function safeParseAIJson<T>(jsonString: string): T
```

**Usage**:
```typescript
import { safeParseAIJson } from '@resume-buddy/utils';

// AI might return:
const aiOutput = `
\`\`\`json
{"name": "John", "age": 25}
\`\`\`
`;

const parsed = safeParseAIJson<{ name: string; age: number }>(aiOutput);
console.log(parsed.name); // "John"
```

**Features**:
- Removes markdown code blocks
- Strips whitespace
- Handles multiple JSON object formats
- Throws clear errors on parse failure

---

#### `calcAtsScore`

Calculate ATS score from career profile signals.

**File**: `ai/calcAtsScore.ts`

```typescript
function calcAtsScore(atsReport: GeneralAtsReport): number
```

**Usage**:
```typescript
import { calcAtsScore } from '@resume-buddy/utils';

const atsReport = {
  globalSignals: {
    workEvidence: { level: 2, reason: "..." },
    skillApplication: { level: 3, reason: "..." },
    // ... 8 signals total
  }
};

const score = calcAtsScore(atsReport);
console.log(score); // 0-100
```

**Signal Weights**:
- `workEvidence`: 20%
- `skillApplication`: 15%
- `outcomeImpact`: 15%
- `clarityStructure`: 10%
- `consistency`: 10%
- `specificity`: 10%
- `effortSignal`: 10%
- `redFlags`: 10% (penalty)

**Calculation**:
- Each signal: 0-3 level normalized to 0-1
- Weighted sum based on importance
- Red flags squared penalty (harsher reduction)
- Final score: 0-100

---

#### `mapInputsToContents`

Map engine inputs to Gemini content format.

**File**: `ai/mapInputsToContents.ts`

```typescript
function mapInputsToContents(inputs: EngineInput[]): Content[]
```

**Usage**:
```typescript
import { mapInputsToContents } from '@resume-buddy/utils';

const inputs = [
  { type: 'text', value: 'Job description...' },
  { type: 'metadata', value: userObject }
];

const contents = mapInputsToContents(inputs);
// Ready for Gemini API
```

---

### 5. Resume Utilities

#### `resumeParser`

Parse PDF and DOCX files to extract text.

**File**: `resumeParser.ts`

```typescript
async function parseResume(
  buffer: Buffer, 
  mimeType: string
): Promise<string>
```

**Usage**:
```typescript
import { parseResume } from '@resume-buddy/utils';

// From file upload
const text = await parseResume(
  file.buffer, 
  'application/pdf'
);

console.log(text); // Extracted resume text
```

**Supported Formats**:
- PDF: `application/pdf`
- DOCX: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

**Dependencies**:
- `pdf-parse` - For PDF extraction
- `mammoth` - For DOCX extraction

---

#### `getResumeConfidenceScore`

Calculate confidence score for extracted resume data.

**File**: `getResumeConfidenceScore.ts`

```typescript
function getResumeConfidenceScore(resume: Resume): number
```

**Usage**:
```typescript
import { getResumeConfidenceScore } from '@resume-buddy/utils';

const score = getResumeConfidenceScore(resumeData);
console.log(score); // 0-100

// Factors:
// - Completeness of basic info
// - Number of education entries
// - Work experience count
// - Projects count
// - Skills listed
```

---

### 6. Utility Functions

#### `deepMerge`

Deep merge two objects.

**File**: `deepMerge.ts`

```typescript
function deepMerge<T>(target: T, source: Partial<T>): T
```

**Usage**:
```typescript
import { deepMerge } from '@resume-buddy/utils';

const base = {
  user: { name: 'John', age: 25 },
  settings: { theme: 'dark' }
};

const updates = {
  user: { age: 26 },
  settings: { notifications: true }
};

const result = deepMerge(base, updates);
// {
//   user: { name: 'John', age: 26 },
//   settings: { theme: 'dark', notifications: true }
// }
```

---

#### `dateCompare`

Compare dates for sorting and filtering.

**File**: `dateCompare.ts`

```typescript
function isExpired(date: string | Date): boolean
function daysBetween(date1: Date, date2: Date): number
```

**Usage**:
```typescript
import { isExpired, daysBetween } from '@resume-buddy/utils';

const jobDeadline = "2024-03-15";
if (isExpired(jobDeadline)) {
  console.log("Application deadline passed");
}

const days = daysBetween(new Date(), new Date(jobDeadline));
console.log(`${days} days until deadline`);
```

---

#### `generate.key.utils`

Generate unique identifiers.

**File**: `generate.key.utils.ts`

```typescript
function generateUserId(): string
function generateSessionId(): string
```

**Usage**:
```typescript
import { generateUserId } from '@resume-buddy/utils';

const userId = generateUserId();
console.log(userId); // "usr_abc123xyz"
```

---

#### `stream.utils`

Stream utilities for handling large data.

**File**: `stream.utils.ts`

```typescript
function streamToBuffer(stream: Readable): Promise<Buffer>
function bufferToStream(buffer: Buffer): Readable
```

**Usage**:
```typescript
import { streamToBuffer } from '@resume-buddy/utils';

const buffer = await streamToBuffer(fileStream);
// Now can process buffer
```

---

## 🎨 Design Patterns

### 1. Error-First Pattern

```typescript
import { asyncHandler, ApiError } from '@resume-buddy/utils';

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  res.json(new ApiResponse(user, 'User fetched', 200));
});
```

### 2. Validation with Error Handling

```typescript
import { ApiError } from '@resume-buddy/utils';
import { UserSchema } from '@resume-buddy/schemas';

const validated = UserSchema.safeParse(data);

if (!validated.success) {
  throw new ApiError(400, 'Validation failed', validated.error);
}
```

### 3. Centralized Token Verification

```typescript
import { verifyAccessToken, getToken, ApiError } from '@resume-buddy/utils';

export const requireAuth = async (req, res, next) => {
  const token = getToken(req);
  
  if (!token) {
    throw new ApiError(401, 'No token provided');
  }
  
  try {
    const payload = await verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid token');
  }
};
```

---

## 🧪 Testing

### Unit Tests

```typescript
import { calcAtsScore } from '@resume-buddy/utils';

describe('calcAtsScore', () => {
  it('should calculate correct score', () => {
    const report = {
      globalSignals: {
        workEvidence: { level: 3, reason: 'Production experience' },
        skillApplication: { level: 2, reason: 'Applied in projects' },
        // ... all 8 signals
      }
    };
    
    const score = calcAtsScore(report);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
```

### Integration Tests

```typescript
import { asyncHandler, ApiError } from '@resume-buddy/utils';
import request from 'supertest';

describe('asyncHandler', () => {
  it('should catch errors', async () => {
    const handler = asyncHandler(async (req, res) => {
      throw new ApiError(400, 'Test error');
    });
    
    const res = await request(app).get('/test');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Test error');
  });
});
```

---

## 🚨 Error Handling Best Practices

### 1. Use Operational Errors

```typescript
// Good - Operational error (expected)
throw new ApiError(404, 'User not found', true);

// Bad - Programming error (unexpected)
throw new Error('Something went wrong');
```

### 2. Specific Error Messages

```typescript
// Good
throw new ApiError(400, 'Email is already registered');

// Bad
throw new ApiError(400, 'Error');
```

### 3. Proper Status Codes

```typescript
// Authentication issues
throw new ApiError(401, 'Invalid credentials');

// Permission issues
throw new ApiError(403, 'Insufficient permissions');

// Not found
throw new ApiError(404, 'Resource not found');

// Validation errors
throw new ApiError(400, 'Invalid input data');
```

---

## 📊 Performance Considerations

### 1. Async Operations

```typescript
// Good - Parallel operations
const [user, resume] = await Promise.all([
  getUser(id),
  getResume(id)
]);

// Bad - Sequential operations
const user = await getUser(id);
const resume = await getResume(id);
```

### 2. Caching Token Verification

```typescript
// Consider caching decoded tokens
const cache = new Map();

export const verifyWithCache = async (token: string) => {
  if (cache.has(token)) {
    return cache.get(token);
  }
  
  const payload = await verifyAccessToken(token);
  cache.set(token, payload);
  return payload;
};
```

---

## 🔗 Dependencies

```json
{
  "dependencies": {
    "jose": "^5.0.0",           // JWT handling
    "pdf-parse": "^1.1.1",      // PDF parsing
    "mammoth": "^1.6.0"         // DOCX parsing
  }
}
```

---

## 📚 Related Documentation

- [API Reference](../API_REFERENCE.md) - How utils are used in APIs
- [Authentication](../technical/authentication.md) - Auth utilities in detail
- [AI Engine](./ai-engine.md) - AI utilities integration
- [Schemas](./schemas.md) - Validation with schemas

---

## 💡 Best Practices

1. **Always use asyncHandler** for async routes
2. **Throw ApiError** instead of generic Error
3. **Validate tokens** on protected routes
4. **Parse AI output** with safeParseAIJson
5. **Use ApiResponse** for consistent responses
6. **Handle all error cases** explicitly
7. **Log errors** appropriately
8. **Don't expose sensitive info** in error messages

---

**Utils Philosophy**: Reusable, reliable, and robust helper functions for common patterns.
