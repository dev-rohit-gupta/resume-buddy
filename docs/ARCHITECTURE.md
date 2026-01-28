# Architecture Overview

## 🏗️ System Architecture

Resume Buddy follows a **monorepo architecture** with clear separation between the server application and reusable packages.

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│                   (Static HTML/CSS/JS)                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express.js Server                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Routes      │→ │ Controllers  │→ │  Services    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                   │             │
│         │                  ▼                   │             │
│         │          ┌──────────────┐            │             │
│         │          │  Middleware  │            │             │
│         │          │ - Auth       │            │             │
│         │          │ - Multer     │            │             │
│         │          │ - Error      │            │             │
│         │          └──────────────┘            │             │
└─────────┼──────────────────────────────────────┼─────────────┘
          │                                       │
          │                                       ▼
          │                              ┌────────────────┐
          │                              │   AI Engine    │
          │                              │   (Gemini)     │
          │                              └────────────────┘
          ▼                                       │
┌──────────────────┐                             │
│    MongoDB       │◄────────────────────────────┘
│  - Users         │
│  - Resumes       │
│  - Suggestions   │
│  - Job Stats     │
└──────────────────┘
```

## 📁 Monorepo Structure

### **Apps**
Contains the main application(s):
- **`apps/server/`** - Express.js backend server

### **Packages**
Shared, reusable modules:
- **`packages/ai-engine/`** - AI operations and Gemini client
- **`packages/schemas/`** - Zod validation schemas
- **`packages/utils/`** - Utility functions and helpers

## 🔄 Request Flow

### 1. **User Authentication Flow**
```
User → /api/auth/signup → Controller → Service → MongoDB
                        → Multer (resume upload)
                        → AI Engine (resume extraction)
                        → AWS S3 (file storage)
                        → Generate JWT
                        → Set HTTP-only cookie
```

### 2. **Opportunity Analysis Flow**
```
User → /api/opportunities/analyze
     → Auth Middleware (verify JWT)
     → Controller (validate request)
     → Service (prepare data)
     → AI Engine (Gemini analysis)
     → Schema Validation (output)
     → Save to MongoDB
     → Return structured JSON
```

### 3. **Dashboard Data Flow**
```
User → /dashboard (protected route)
     → Token verification
     → Fetch user data
     → Fetch career insights
     → Fetch analyzed opportunities
     → Render static HTML
     → Client-side JS renders components
```

## 🧩 Design Principles

### **1. Schema-First Architecture**
- All data structures defined using Zod schemas
- Schemas are the single source of truth
- Type safety enforced at runtime and compile-time
- AI input/output validated against schemas

### **2. Separation of Concerns**
- **Routes** - Define HTTP endpoints
- **Controllers** - Handle requests/responses
- **Services** - Business logic and orchestration
- **Models** - Database interactions
- **Middleware** - Cross-cutting concerns

### **3. AI as a Decision Engine**
- AI **never** returns free text responses
- AI **always** returns structured JSON
- No AI logic in the UI layer
- Gemini treated as a pure function: `input → output`

### **4. Type Safety**
- End-to-end TypeScript
- Shared types between packages
- Runtime validation with Zod
- No `any` types in production code

## 🔌 Key Components

### **Express Server**
- **Port**: Configurable via environment variable
- **Middleware**: JSON parsing, cookie parsing, static file serving
- **Routes**: RESTful API endpoints
- **Error Handling**: Centralized error middleware

### **AI Engine**
- **Model**: Gemini Flash 1.5 (gemini-1.5-flash)
- **System Instructions**: Structured prompts for consistent output
- **Validation**: Input/output validated with Zod
- **Operations**:
  - `analyzeJob()` - Job vs Resume analysis
  - `analyzeResume()` - Resume data extraction
  - `buildCareerProfile()` - Career insights generation

### **Database (MongoDB)**
- **Connection**: Mongoose ODM
- **Models**: User, Resume, Suggestion, JobStats
- **Indexes**: Email (unique), User ID (unique)
- **Timestamps**: Automatic createdAt/updatedAt

### **Authentication**
- **Strategy**: JWT (JSON Web Tokens)
- **Storage**: HTTP-only cookies
- **Hashing**: bcrypt for passwords
- **Signing**: JOSE library for JWT

### **File Handling**
- **Upload**: Multer middleware
- **Storage**: AWS S3
- **Validation**: File type and size limits
- **Processing**: Resume parsing with pdf-parse/mammoth

## 📦 Package Dependencies

### **AI Engine Dependencies**
- `@google/genai` - Gemini SDK
- Schemas package for validation

### **Schemas Package**
- `zod` - Runtime type validation
- No external dependencies

### **Utils Package**
- Error handling utilities
- API response formatters
- Authentication helpers
- AI utilities (JSON parsing, ATS scoring)

### **Server Dependencies**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcrypt` - Password hashing
- `jose` - JWT handling
- `cookie-parser` - Cookie parsing
- `multer` - File uploads
- `@aws-sdk/client-s3` - File storage
- All internal packages

## 🚦 Error Handling Strategy

### **Error Types**
1. **ApiError** - Custom application errors with status codes
2. **Validation Errors** - Zod validation failures
3. **Database Errors** - MongoDB operation failures
4. **AI Errors** - Gemini API failures

### **Error Flow**
```
Error thrown → asyncHandler wrapper → errorMiddleware
            → Log error → Format response → Send to client
```

### **Error Response Format**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [],
  "stack": "..." // only in development
}
```

## 🔐 Security Considerations

1. **Password Security**
   - Bcrypt hashing with salt rounds
   - Passwords never returned in API responses
   - Password field excluded by default in queries

2. **JWT Security**
   - HTTP-only cookies (no JavaScript access)
   - Short expiration times
   - Secure flag in production
   - Secret key from environment variables

3. **Input Validation**
   - All inputs validated with Zod
   - File upload size limits
   - File type restrictions
   - SQL injection prevention (Mongoose)

4. **CORS & Headers**
   - Appropriate CORS configuration
   - Security headers
   - Rate limiting (recommended for production)

## 📊 Data Flow Diagram

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ 1. Submit Job Data
     ▼
┌─────────────────┐
│   Controller    │
│  - Validate     │
└────┬────────────┘
     │
     │ 2. Process Request
     ▼
┌─────────────────┐
│    Service      │
│  - Fetch User   │
│  - Prepare Data │
└────┬────────────┘
     │
     │ 3. Analyze
     ▼
┌─────────────────┐
│   AI Engine     │
│  - Run Gemini   │
│  - Validate     │
└────┬────────────┘
     │
     │ 4. Store Results
     ▼
┌─────────────────┐
│    MongoDB      │
│  - Save Record  │
└────┬────────────┘
     │
     │ 5. Return Response
     ▼
┌──────────┐
│  Client  │
└──────────┘
```

## 🎯 Performance Considerations

1. **AI Response Time**
   - Gemini API calls are the bottleneck
   - Consider caching for identical analyses
   - Background processing for bulk operations

2. **Database Queries**
   - Indexed fields (email, userId)
   - Pagination for lists
   - Selective field projection

3. **Static Assets**
   - Served directly by Express
   - Consider CDN for production
   - Asset minification for CSS/JS

## 🔄 Future Architecture Enhancements

- [ ] Redis caching layer
- [ ] Message queue for async AI operations
- [ ] Microservices split (API gateway pattern)
- [ ] WebSocket for real-time updates
- [ ] GraphQL API layer
- [ ] Rate limiting with Redis
- [ ] Monitoring and observability (logging, metrics)

## 📚 Related Documentation

- [API Reference](./API_REFERENCE.md)
- [Database Schema](./technical/database.md)
- [Authentication System](./technical/authentication.md)
- [AI Engine Details](./packages/ai-engine.md)

---

**Design Philosophy**: Clarity over complexity, structure over chaos.
