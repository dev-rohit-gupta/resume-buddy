# Contributing to Resume Buddy

Thank you for your interest in contributing to Resume Buddy! This guide will help you get started.

## 🎯 Ways to Contribute

- **Code**: New features, bug fixes, refactoring
- **Documentation**: Improve guides, add examples
- **Bug Reports**: Identify and report bugs
- **Design**: UI/UX improvements
- **Ideas**: Feature requests, architectural suggestions

## 📋 Before You Start

### 1. Read Documentation

Familiarize yourself with the project:
- [README](../README.md) - Project overview
- [Architecture](./ARCHITECTURE.md) - System design
- [Getting Started](./GETTING_STARTED.md) - Development setup
- [API Reference](./API_REFERENCE.md) - API details

### 2. Check Existing Issues

- Browse [open issues](https://github.com/yourusername/resume-buddy/issues)
- Look for `good first issue` or `help wanted` labels
- Comment on issues you want to work on

### 3. Discuss Major Changes

For significant changes:
1. Open an issue first
2. Describe the problem and proposed solution
3. Wait for maintainer feedback
4. Proceed after approval

## 🛠️ Development Workflow

### 1. Fork & Clone

```bash
# Fork the repository on GitHub
# Then clone your fork

git clone https://github.com/YOUR_USERNAME/resume-buddy.git
cd resume-buddy

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/resume-buddy.git
```

### 2. Create a Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fix
git checkout -b fix/bug-description
```

**Branch Naming Convention**:
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/topic` - Documentation
- `refactor/component` - Code refactoring

### 3. Make Changes

Follow our coding standards (see below).

### 4. Verify Your Changes

```bash
# Start development server and test manually
npm run dev

# Build to check for errors
npm run build

# Format code
npm run format
```

### 5. Commit Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "type(scope): description"
```

**Commit Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `chore`: Maintenance tasks

**Examples**:
```bash
git commit -m "feat(resume): add confidence score calculation"
git commit -m "fix(auth): correct JWT expiration validation"
git commit -m "docs(api): update authentication endpoints"
git commit -m "refactor(schemas): simplify resume validation"
```

### 6. Push & Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name
```

**On GitHub**:
1. Navigate to your fork
2. Click "Compare & pull request"
3. Fill out the PR template
4. Submit the pull request

## 📝 Pull Request Guidelines

### PR Title

Use conventional commit format:
```
feat(resume): add PDF parsing support
fix(auth): resolve token refresh issue
docs(readme): update installation instructions
```

### PR Description

Include:

**What**: What does this PR do?
**Why**: Why is this change needed?
**How**: How does it work?
**Testing**: How was it tested?
**Screenshots**: If UI changes, include before/after

**Template**:
```markdown
## Description
Brief description of changes

## Motivation
Why is this change needed?

## Changes
- Change 1
- Change 2
- Change 3

## Verification
- [ ] Manual testing performed
- [ ] Build succeeds without errors
- [ ] Code formatted

## Screenshots (if applicable)
Before: [image]
After: [image]

## Checklist
- [ ] Code follows project style
- [ ] Documentation updated
- [ ] Manually verified functionality
- [ ] No breaking changes (or documented)
```

### Code Review Process

1. **Automated Checks**: CI/CD runs tests and linting
2. **Maintainer Review**: Code quality, architecture fit
3. **Feedback**: Address comments and suggestions
4. **Approval**: PR approved and merged

**Response to Feedback**:
- Be receptive to constructive criticism
- Ask questions if unclear
- Make requested changes promptly
- Mark conversations as resolved

## 💻 Coding Standards

### TypeScript Style

**1. Use TypeScript Features**:
```typescript
// ✅ Good - Explicit types
function analyzeResume(text: string): Promise<Resume> {
  // ...
}

// ❌ Bad - Implicit any
function analyzeResume(text) {
  // ...
}
```

**2. Interfaces for Objects**:
```typescript
// ✅ Good
interface UserData {
  name: string;
  email: string;
  password: string;
}

// ❌ Bad - Inline types
function createUser(data: { name: string; email: string; password: string }) {
  // ...
}
```

**3. Avoid `any`**:
```typescript
// ✅ Good
const data: unknown = await response.json();
if (isValidData(data)) {
  processData(data);
}

// ❌ Bad
const data: any = await response.json();
processData(data);
```

### Zod Schema-First Approach

**1. Define Schema First**:
```typescript
// schemas package
import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export type User = z.infer<typeof userSchema>;
```

**2. Use in Controllers**:
```typescript
// controllers
import { userSchema } from '@resume-buddy/schemas';

export const signupController = async (req, res) => {
  const data = userSchema.parse(req.body); // Throws if invalid
  // data is now typed as User
};
```

**3. Export Both Schema and Type**:
```typescript
// Always export both
export const resumeSchema = z.object({ /* ... */ });
export type Resume = z.infer<typeof resumeSchema>;
```

### AI Integration

**1. Never Accept Free Text**:
```typescript
// ✅ Good - Structured output
const result = await analyzeResume(buffer, mimeType);
// result is type-safe Resume object

// ❌ Bad - Free text output
const text = await aiGenerateText("analyze this resume");
```

**2. Validate AI Outputs**:
```typescript
const prompt = `Return JSON matching this schema: ${JSON.stringify(resumeSchema)}`;
const rawOutput = await gemini.generateContent(prompt);
const validated = resumeSchema.parse(JSON.parse(rawOutput));
```

**3. AI as Pure Function**:
```typescript
// AI function should be deterministic
async function analyzeJob(
  resume: Resume,
  jobDescription: string
): Promise<JobAnalysis> {
  // Same inputs → Same output structure
  // Only decision-making, no side effects
}
```

### Error Handling

**1. Use ApiError Class**:
```typescript
import { ApiError } from '@resume-buddy/utils';

if (!user) {
  throw new ApiError(404, 'User not found');
}

// Not generic Error
// throw new Error('User not found');
```

**2. Async Handler Wrapper**:
```typescript
import { asyncHandler } from '@resume-buddy/utils';

export const controller = asyncHandler(async (req, res) => {
  // Automatically catches errors and passes to error middleware
  const data = await someAsyncOperation();
  res.json(new ApiResponse(200, data));
});
```

**3. Meaningful Error Messages**:
```typescript
// ✅ Good
throw new ApiError(400, 'Email already registered. Please login instead.');

// ❌ Bad
throw new ApiError(400, 'Error');
```

### Code Organization

**1. File Structure**:
```
feature/
  ├── feature.controller.ts    # HTTP handlers
  ├── feature.service.ts       # Business logic
  ├── feature.model.ts         # Database model
  └── feature.route.ts         # Route definitions
```

**2. Separation of Concerns**:
```typescript
// Controller - HTTP handling only
export const signupController = asyncHandler(async (req, res) => {
  const data = userSchema.parse(req.body);
  const file = req.file;
  
  const result = await signupService(data, file); // Delegate to service
  
  res.status(201).json(new ApiResponse(201, result, 'Signup successful'));
});

// Service - Business logic
export async function signupService(data: UserInput, file: File) {
  // Hash password
  // Parse resume
  // Create user
  // Upload file
  return { user, resume };
}
```

**3. Single Responsibility**:
```typescript
// ✅ Good - Each function does one thing
async function hashPassword(password: string): Promise<string> { /* ... */ }
async function createUser(data: UserData): Promise<User> { /* ... */ }
async function uploadResume(file: File): Promise<string> { /* ... */ }

// ❌ Bad - Function does too much
async function signup(data) {
  // Hash password
  // Create user
  // Parse resume
  // Upload file
  // Send email
  // Log activity
}
```

### Naming Conventions

**1. Variables & Functions**:
```typescript
// camelCase
const userId = '123';
function getUserById(id: string) { }
```

**2. Types & Interfaces**:
```typescript
// PascalCase
interface UserData { }
type Resume = { };
```

**3. Constants**:
```typescript
// UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['application/pdf'];
```

**4. Files**:
```typescript
// kebab-case or camelCase
user.controller.ts
resumeExtraction.service.ts
```

### Comments & Documentation

**1. JSDoc for Public APIs**:
```typescript
/**
 * Analyzes a resume and extracts structured data
 * @param buffer - Resume file buffer
 * @param mimeType - File MIME type (pdf or docx)
 * @returns Structured resume data with confidence scores
 * @throws {ApiError} If file parsing fails or AI extraction fails
 */
export async function analyzeResume(
  buffer: Buffer,
  mimeType: string
): Promise<Resume> {
  // ...
}
```

**2. Explain Why, Not What**:
```typescript
// ✅ Good - Explains reasoning
// Use memory storage to allow file manipulation before uploading to Cloudinary
const storage = multer.memoryStorage();

// ❌ Bad - States the obvious
// Create multer storage
const storage = multer.memoryStorage();
```

**3. TODOs with Context**:
```typescript
// TODO: Add OCR support for scanned PDFs (requires tesseract.js integration)
// TODO: Implement caching for repeated job descriptions (Redis?)
```

## 🧪 Testing Guidelines

### Unit Tests

**Test Structure**:
```typescript
describe('Feature Name', () => {
  describe('functionName', () => {
    it('should do something in specific condition', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = functionName(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

**Example**:
```typescript
describe('Resume Service', () => {
  describe('analyzeResume', () => {
    it('should extract contact information from PDF', async () => {
      const buffer = fs.readFileSync('test-resume.pdf');
      const result = await analyzeResume(buffer, 'application/pdf');
      
      expect(result.contact.email).toBeDefined();
      expect(result.contact.phone).toBeDefined();
    });
    
    it('should throw error for invalid file type', async () => {
      const buffer = Buffer.from('invalid');
      
      await expect(
        analyzeResume(buffer, 'text/plain')
      ).rejects.toThrow(ApiError);
    });
  });
});
```

### Integration Tests

```typescript
describe('Signup Flow', () => {
  it('should create user with resume', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .field('name', 'Test User')
      .field('email', 'test@example.com')
      .field('password', 'password123')
      .attach('file', 'test-resume.pdf');
    
    expect(res.status).toBe(201);
    expect(res.body.data.user).toHaveProperty('id');
    expect(res.body.data.resume).toHaveProperty('contact');
  });
});
```

### Test Coverage

Aim for:
- **Utilities**: 90%+ coverage
- **Services**: 80%+ coverage
- **Controllers**: 70%+ coverage

**Check Coverage**:
```bash
npm test -- --coverage
```

## 📚 Documentation Guidelines

### Code Documentation

- Add JSDoc for public functions
- Explain complex algorithms
- Document type definitions
- Include usage examples

### README Updates

When adding features:
1. Update main README.md
2. Add to relevant package README
3. Update feature documentation
4. Add API documentation if applicable

### Examples

Provide working examples:

```typescript
/**
 * Analyze job opportunity
 * 
 * @example
 * ```typescript
 * const analysis = await analyzeOpportunity(resume, jobDescription, {
 *   location: 'New York',
 *   experienceLevel: 'senior'
 * });
 * 
 * console.log(analysis.fitScore); // 85
 * console.log(analysis.recommendation); // 'APPLY'
 * ```
 */
```

## 🐛 Bug Reports

### Issue Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable

## Environment
- OS: [e.g., macOS 13.0]
- Node.js version: [e.g., 18.20.0 or 20.x]
- Browser: [e.g., Chrome 120]

## Additional Context
Any other relevant information
```

## ✨ Feature Requests

### Request Template

```markdown
## Feature Description
Clear description of the feature

## Problem It Solves
What problem does this solve?

## Proposed Solution
How would it work?

## Alternatives Considered
Other approaches you've considered

## Additional Context
Mockups, examples, etc.
```

## 🔍 Code Review Checklist

Before submitting PR, verify:

- [ ] **Functionality**: Code works as intended
- [ ] **Tests**: Tests added and passing
- [ ] **Types**: No TypeScript errors
- [ ] **Linting**: No ESLint warnings
- [ ] **Documentation**: Code documented
- [ ] **Breaking Changes**: None (or clearly marked)
- [ ] **Performance**: No obvious performance issues
- [ ] **Security**: No security vulnerabilities
- [ ] **Accessibility**: UI changes are accessible
- [ ] **Mobile**: Responsive design (if UI)

## 🎨 UI/UX Contributions

### Design Guidelines

- Keep existing design language
- Maintain consistency with current UI
- Ensure responsive design
- Follow accessibility standards (WCAG 2.1)

### Before & After

Always provide:
- Screenshots of changes
- Mobile view screenshots
- Different states (hover, focus, active)

## 📞 Getting Help

- **Questions**: Open a [discussion](https://github.com/yourusername/resume-buddy/discussions)
- **Bugs**: File an [issue](https://github.com/yourusername/resume-buddy/issues)
- **Chat**: Join our [Discord/Slack] (if applicable)
- **Email**: contact@resumebuddy.com(comming soon)

## 🏆 Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Given credit in commit messages

## 📜 License

By contributing, you agree that your contributions will be licensed under the project's license.

## 🙏 Thank You!

Your contributions make Resume Buddy better for everyone. We appreciate your time and effort!

---

**Contributing Philosophy**: Quality over quantity, clarity over cleverness.
