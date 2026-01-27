# Database Documentation

Resume Buddy uses MongoDB with Mongoose ODM for data persistence. This document covers the database schema, models, and best practices.

## 🗄️ Database Overview

- **Database**: MongoDB
- **ODM**: Mongoose
- **Connection**: Async connection with retry logic
- **Hosting**: Local or MongoDB Atlas

## 📊 Models

### 1. User Model

Stores user account information.

**File**: `apps/server/src/models/user.model.ts`

**Schema**:
```typescript
{
  name: String (required, trimmed),
  id: String (required, unique),
  email: String (required, unique, lowercase, trimmed),
  password: String (required, hashed, select: false),
  role: "user" | "admin" (default: "user"),
  avatar: String (URL, default generated),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- `email`: Unique index
- `id`: Unique index

**Methods**:

```typescript
// Check password
async isPasswordCorrect(password: string): Promise<boolean>

// Generate JWT
async generateAccessToken(): Promise<string>
```

**Middleware**:

```typescript
// Pre-save: Hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

**Usage**:
```typescript
import { UserModel } from '../models/user.model';

// Create user
const user = await UserModel.create({
  name: "John Doe",
  id: "usr_abc123",
  email: "john@example.com",
  password: "plaintext" // Will be hashed automatically
});

// Find user
const user = await UserModel.findOne({ email: "john@example.com" });

// Find with password (excluded by default)
const user = await UserModel.findOne({ email }).select('+password');

// Verify password
const isValid = await user.isPasswordCorrect("password123");

// Generate token
const token = await user.generateAccessToken();
```

---

### 2. Resume Model

Stores extracted resume data.

**File**: `apps/server/src/models/resume.model.ts`

**Schema**:
```typescript
{
  userId: String (required, unique, ref: 'User'),
  data: Object (required, Resume schema),
  confidenceScore: Number (0-100),
  originalFileUrl: String (Cloudinary URL),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- `userId`: Unique index

**Data Structure**:
```typescript
data: {
  basics: {...},
  summary: string,
  education: [...],
  experience: [...],
  projects: [...],
  skills: {...},
  certifications: [...],
  achievements: [...],
  languages: [...],
  metadata: {...}
}
```

**Usage**:
```typescript
import { ResumeModel } from '../models/resume.model';

// Create or update resume
const resume = await ResumeModel.findOneAndUpdate(
  { userId: user.id },
  {
    userId: user.id,
    data: extractedData,
    confidenceScore: 85,
    originalFileUrl: cloudinaryUrl
  },
  { upsert: true, new: true }
);

// Find user's resume
const resume = await ResumeModel.findOne({ userId: user.id });
```

---

### 3. Suggestion Model

Stores career insights and AI analysis results.

**File**: `apps/server/src/models/suggestion.model.ts`

**Schema**:
```typescript
{
  userId: String (required, ref: 'User'),
  careerProfile: Object (required, CareerProfile schema),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- `userId`: Index (not unique, allows historical records)

**Career Profile Structure**:
```typescript
careerProfile: {
  atsAnalysis: {
    globalSignals: {...},
    rawObservations: {...}
  },
  bestRole: string,
  nearestNextRole: string,
  skillGaps: string[]
}
```

**Usage**:
```typescript
import { SuggestionModel } from '../models/suggestion.model';

// Save career profile
const suggestion = await SuggestionModel.create({
  userId: user.id,
  careerProfile: profileData
});

// Get latest suggestion
const latest = await SuggestionModel
  .findOne({ userId: user.id })
  .sort({ createdAt: -1 });
```

---

### 4. JobStats Model

Stores analyzed job opportunities.

**File**: `apps/server/src/models/jobStats.model.ts`

**Schema**:
```typescript
{
  userId: String (required, ref: 'User'),
  jobData: Object (required, AIInput schema),
  analysisResult: Object (AIOutput schema),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- `userId`: Index
- `createdAt`: Index (for sorting)

**Job Data Structure**:
```typescript
jobData: {
  meta: {...},
  workDetails: {...},
  skills: {...},
  eligibility: {...},
  perks: {...},
  companyInfo: {...},
  rawData: {...}
}

analysisResult: {
  stats: {...},
  atsAnalysis: {...},
  skillGapAnalysis: {...},
  learningPlan: {...},
  applicationDecision: {...},
  precautions: {...},
  resumeActions: {...}
}
```

**Usage**:
```typescript
import { JobStatsModel } from '../models/jobStats.model';

// Save analysis
const jobStat = await JobStatsModel.create({
  userId: user.id,
  jobData: validatedInput,
  analysisResult: aiOutput
});

// Get user's analyzed jobs
const jobs = await JobStatsModel
  .find({ userId: user.id })
  .sort({ createdAt: -1 })
  .limit(10);

// Search by company
const jobs = await JobStatsModel.find({
  userId: user.id,
  'jobData.meta.companyName': { $regex: 'Google', $options: 'i' }
});
```

---

## 🔗 Database Connection

**File**: `apps/server/src/db/connection.ts`

```typescript
import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
```

**Usage**:
```typescript
// In server startup (index.ts)
import { connectDB } from './db/connection';

await connectDB();
```

**Connection String Format**:
```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/resume-buddy

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-buddy?retryWrites=true&w=majority
```

---

## 🔍 Query Patterns

### Find User with Resume

```typescript
const user = await UserModel.findById(userId);
const resume = await ResumeModel.findOne({ userId: user.id });

// Or use aggregation
const userWithResume = await UserModel.aggregate([
  { $match: { _id: mongoose.Types.ObjectId(userId) } },
  {
    $lookup: {
      from: 'resumes',
      localField: 'id',
      foreignField: 'userId',
      as: 'resume'
    }
  },
  { $unwind: '$resume' }
]);
```

### Pagination

```typescript
const page = 1;
const limit = 10;
const skip = (page - 1) * limit;

const jobs = await JobStatsModel
  .find({ userId: user.id })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);

const total = await JobStatsModel.countDocuments({ userId: user.id });

const pagination = {
  page,
  limit,
  total,
  pages: Math.ceil(total / limit)
};
```

### Search and Filter

```typescript
// Text search in job title
const jobs = await JobStatsModel.find({
  userId: user.id,
  'jobData.meta.title': { $regex: searchTerm, $options: 'i' }
});

// Filter by job type
const internships = await JobStatsModel.find({
  userId: user.id,
  'jobData.meta.type': 'Internship'
});

// Filter by company
const googleJobs = await JobStatsModel.find({
  userId: user.id,
  'jobData.meta.companyName': 'Google'
});

// Date range
const recentJobs = await JobStatsModel.find({
  userId: user.id,
  createdAt: {
    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
  }
});
```

### Aggregations

```typescript
// Count jobs by type
const jobsByType = await JobStatsModel.aggregate([
  { $match: { userId: user.id } },
  { $group: {
    _id: '$jobData.meta.type',
    count: { $sum: 1 }
  }}
]);

// Average ATS score
const avgScore = await JobStatsModel.aggregate([
  { $match: { userId: user.id } },
  { $group: {
    _id: null,
    avgAtsScore: { $avg: '$analysisResult.atsAnalysis.atsScore' }
  }}
]);
```

---

## 🔒 Security Best Practices

### 1. Password Security

```typescript
// Never return password
const user = await UserModel.findOne({ email }); // password excluded

// Explicitly include when needed
const user = await UserModel.findOne({ email }).select('+password');

// Always hash before saving (handled by middleware)
user.password = "newPassword"; // Will be hashed on save
await user.save();
```

### 2. Input Validation

```typescript
// Validate before querying
import { EmailSchema } from '@resume-buddy/schemas';

const validEmail = EmailSchema.parse(req.body.email);
const user = await UserModel.findOne({ email: validEmail });
```

### 3. Query Injection Prevention

```typescript
// Mongoose automatically sanitizes queries
// But still validate input

// Bad (if using raw queries)
const user = await db.collection.findOne({ email: req.body.email });

// Good
const email = EmailSchema.parse(req.body.email);
const user = await UserModel.findOne({ email });
```

---

## 📊 Indexing Strategy

### Current Indexes

```typescript
// User Model
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ id: 1 }, { unique: true });

// Resume Model
ResumeSchema.index({ userId: 1 }, { unique: true });

// JobStats Model
JobStatsSchema.index({ userId: 1 });
JobStatsSchema.index({ createdAt: -1 });

// Suggestion Model
SuggestionSchema.index({ userId: 1 });
```

### Recommended Indexes for Production

```typescript
// Compound index for job search
JobStatsSchema.index({
  userId: 1,
  'jobData.meta.companyName': 1,
  createdAt: -1
});

// Text index for full-text search
JobStatsSchema.index({
  'jobData.meta.title': 'text',
  'jobData.meta.companyName': 'text'
});
```

---

## 🔄 Migration Strategy

### Schema Changes

When updating schemas:

1. **Add Optional Fields**
   ```typescript
   // Safe - doesn't break existing data
   const schema = new Schema({
     existingField: String,
     newField: { type: String, default: null }
   });
   ```

2. **Remove Fields**
   ```typescript
   // Update documents first
   await Model.updateMany({}, { $unset: { oldField: 1 } });
   
   // Then remove from schema
   ```

3. **Rename Fields**
   ```typescript
   // Migrate data
   await Model.updateMany({}, { $rename: { oldName: 'newName' } });
   ```

### Data Migration Script

```typescript
// scripts/migrate.ts
import { UserModel } from '../models/user.model';

async function migrate() {
  // Add avatars to existing users
  await UserModel.updateMany(
    { avatar: { $exists: false } },
    { $set: { avatar: 'default-url' } }
  );
  
  console.log('Migration complete');
}

migrate().then(() => process.exit(0));
```

---

## 🧪 Testing

### Unit Tests

```typescript
import { UserModel } from '../models/user.model';

describe('User Model', () => {
  it('should hash password on save', async () => {
    const user = new UserModel({
      name: 'Test',
      email: 'test@example.com',
      password: 'plain'
    });
    
    await user.save();
    expect(user.password).not.toBe('plain');
  });
  
  it('should verify correct password', async () => {
    const user = await UserModel.create({...});
    const isValid = await user.isPasswordCorrect('password123');
    expect(isValid).toBe(true);
  });
});
```

### Integration Tests

```typescript
describe('Database Integration', () => {
  beforeAll(async () => {
    await connectDB();
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
  });
  
  it('should save and retrieve user', async () => {
    const user = await UserModel.create({...});
    const found = await UserModel.findById(user._id);
    expect(found.email).toBe(user.email);
  });
});
```

---

## 📈 Performance Optimization

### 1. Use Lean Queries

```typescript
// Returns plain objects (faster)
const users = await UserModel.find().lean();

// vs Documents (slower but has methods)
const users = await UserModel.find();
```

### 2. Select Only Needed Fields

```typescript
// Good
const user = await UserModel.findById(id).select('name email avatar');

// Bad (retrieves all fields)
const user = await UserModel.findById(id);
```

### 3. Batch Operations

```typescript
// Good - single query
await UserModel.insertMany(users);

// Bad - multiple queries
for (const user of users) {
  await UserModel.create(user);
}
```

### 4. Connection Pooling

```typescript
mongoose.connect(uri, {
  maxPoolSize: 10,
  minPoolSize: 5
});
```

---

## 🚨 Common Issues

### 1. Duplicate Key Error

```typescript
Error: E11000 duplicate key error

Solution:
- Check for existing email/id before insert
- Handle error gracefully
```

### 2. Connection Timeout

```typescript
Error: MongoServerError: connection timeout

Solution:
- Check MongoDB URI
- Verify network connectivity
- Check IP whitelist (Atlas)
```

### 3. Version Key Conflicts

```typescript
Error: VersionError

Solution:
- Use $set instead of direct assignment
- Or disable versioning: { versionKey: false }
```

---

## 📚 Related Documentation

- [Authentication](./authentication.md) - JWT and password handling
- [API Reference](../API_REFERENCE.md) - API endpoints using models
- [Schemas](../packages/schemas.md) - Type definitions

---

**Database Philosophy**: Structured data, indexed queries, secure by default.
