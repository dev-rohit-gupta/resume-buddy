# API Reference

Complete reference for all Resume Buddy API endpoints.

## Base URL

```
http://localhost:4000/api
```

## Authentication

Most endpoints require JWT authentication via HTTP-only cookies.

### Authentication Header

Cookies are automatically sent by the browser. For manual API calls:

```
Cookie: accessToken=<jwt_token>
```

## Response Format

All responses follow a consistent structure:

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "statusCode": 200,
  "data": { }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [],
  "statusCode": 400,
  "stack": "..." // only in development
}
```

---

## Endpoints

### Authentication

#### **POST** `/api/auth/signup`

Register a new user with resume upload.

**Authentication**: Not required

**Content-Type**: `multipart/form-data`

**Request Body**:
```
name: string (required)
email: string (required, valid email)
password: string (required, min 6 chars)
file: File (required, PDF or DOCX, max 10MB)
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "User created successfully",
  "statusCode": 201,
  "data": {
    "user": {
      "id": "usr_abc123",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://...",
      "role": "user"
    }
  }
}
```

**Error Responses**:
- `400` - Validation error (missing fields, invalid email)
- `409` - Email already exists
- `500` - Resume processing failed

**Example**:
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "password=secure123" \
  -F "file=@resume.pdf"
```

---

#### **POST** `/api/auth/login`

Authenticate user and receive access token.

**Authentication**: Not required

**Content-Type**: `application/json`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "secure123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "User logged in successfully",
  "statusCode": 200,
  "data": {
    "user": {
      "id": "usr_abc123",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://...",
      "role": "user"
    }
  }
}
```

**Sets Cookie**:
```
accessToken=<jwt>; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

**Error Responses**:
- `400` - Missing email or password
- `401` - Invalid credentials
- `404` - User not found

**Example**:
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secure123"}'
```

---

#### **POST** `/api/auth/logout`

Logout user and clear authentication cookie.

**Authentication**: Required

**Success Response** (200):
```json
{
  "success": true,
  "message": "User logged out successfully",
  "statusCode": 200,
  "data": null
}
```

**Example**:
```bash
curl -X POST http://localhost:4000/api/auth/logout \
  -H "Cookie: accessToken=<jwt>"
```

---

### User Management

#### **GET** `/api/users/profile`

Get current user's profile information.

**Authentication**: Required

**Success Response** (200):
```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "statusCode": 200,
  "data": {
    "id": "usr_abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://...",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses**:
- `401` - Not authenticated
- `404` - User not found

---

#### **GET** `/api/users/resume`

Get user's uploaded resume data.

**Authentication**: Required

**Success Response** (200):
```json
{
  "success": true,
  "message": "Resume fetched successfully",
  "statusCode": 200,
  "data": {
    "basics": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "location": "San Francisco, CA",
      "links": {
        "linkedin": "https://linkedin.com/in/johndoe",
        "github": "https://github.com/johndoe",
        "portfolio": "https://johndoe.dev"
      }
    },
    "summary": "Experienced software engineer...",
    "education": [...],
    "experience": [...],
    "projects": [...],
    "skills": [...],
    "achievements": [...]
  }
}
```

**Error Responses**:
- `401` - Not authenticated
- `404` - Resume not found

---

#### **GET** `/api/users/dashboard`

Get dashboard insights (career profile, stats).

**Authentication**: Required

**Success Response** (200):
```json
{
  "success": true,
  "message": "Dashboard data fetched successfully",
  "statusCode": 200,
  "data": {
    "careerProfile": {
      "currentLevel": "Intermediate",
      "bestFitRole": "Full Stack Developer",
      "nextBestFitRole": "Senior Frontend Developer",
      "topSkills": ["React", "Node.js", "TypeScript"],
      "skillsGap": ["GraphQL", "Docker", "AWS"],
      "yearsOfExperience": 2,
      "education": "B.Tech Computer Science"
    },
    "stats": {
      "totalApplications": 15,
      "averageAtsScore": 72,
      "topMatchedJobs": 5
    }
  }
}
```

**Error Responses**:
- `401` - Not authenticated
- `404` - User not found

---

### Opportunities

#### **POST** `/api/opportunities/analyze`

Analyze a job opportunity against user's resume.

**Authentication**: Required

**Content-Type**: `application/json`

**Request Body**:
```json
{
  "meta": {
    "source": "LinkedIn",
    "type": "Internship",
    "title": "Full Stack Developer Intern",
    "companyName": "Google",
    "companyType": "MNC",
    "location": {
      "type": "Remote",
      "city": "Bangalore",
      "country": "India"
    },
    "postedDate": "2024-01-15T00:00:00.000Z",
    "applyBy": "2024-02-15T00:00:00.000Z",
    "openings": 5
  },
  "workDetails": {
    "duration": "6 Months",
    "startDate": "Immediate",
    "stipend": {
      "type": "Paid",
      "amount": 50000,
      "currency": "INR",
      "frequency": "Monthly"
    },
    "responsibilities": ["Develop APIs", "Build UI"],
    "learningOutcomes": ["System Design", "Cloud Architecture"]
  },
  "skills": {
    "required": [
      { "name": "React", "level": "Intermediate" },
      { "name": "Node.js", "level": "Basic" }
    ],
    "frameworks": ["Next.js", "Express"],
    "databases": ["MongoDB", "PostgreSQL"],
    "tools": [],
    "optional": []
  },
  "eligibility": {
    "education": ["B.Tech IT", "BCA"],
    "year": [],
    "experienceRequired": false,
    "minAge": 18,
    "otherCriteria": []
  },
  "perks": {
    "certificate": true,
    "letterOfRecommendation": true,
    "jobOffer": true,
    "flexibleHours": true
  },
  "companyInfo": {
    "description": "Leading tech company...",
    "industry": "Technology",
    "website": "https://google.com",
    "trustScore": 95
  },
  "rawData": {
    "fullDescriptionText": "Full job description...",
    "sourceURL": "https://linkedin.com/jobs/..."
  }
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Opportunity analyzed successfully",
  "statusCode": 200,
  "data": {
    "analysisResult": {
      "stats": {
        "difficulty": "Intermediate",
        "learningFocused": true,
        "competitionLevel": "Medium",
        "match": "Good"
      },
      "atsAnalysis": {
        "atsScore": 78,
        "selectionProbability": "High",
        "reasons": [
          "Strong technical skills match",
          "Relevant project experience"
        ]
      },
      "skillGapAnalysis": {
        "matchedSkills": ["React", "JavaScript", "Git"],
        "missingSkills": [
          {
            "skill": "Next.js",
            "priority": "High",
            "whyItMatters": "Required for frontend framework"
          }
        ]
      },
      "learningPlan": {
        "mustLearnFirst": [
          {
            "skill": "Next.js",
            "estimatedTime": "2 weeks",
            "impact": "Critical for application success"
          }
        ],
        "goodToHave": ["TypeScript", "Docker"]
      },
      "applicationDecision": {
        "shouldApply": true,
        "recommendation": "Apply After Preparation",
        "reasoning": [
          "Good overall match",
          "Learn Next.js first",
          "Strong company reputation"
        ]
      },
      "precautions": {
        "riskLevel": "Low",
        "notes": ["Ensure portfolio showcases React projects"]
      },
      "resumeActions": {
        "add": ["Next.js projects"],
        "improve": ["Quantify project impact"],
        "remove": ["Outdated technologies"]
      }
    }
  }
}
```

**Error Responses**:
- `400` - Invalid input schema
- `401` - Not authenticated
- `500` - AI analysis failed

**Example**:
```bash
curl -X POST http://localhost:4000/api/opportunities/analyze \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=<jwt>" \
  -d @job-data.json
```

---

#### **GET** `/api/opportunities`

Get list of analyzed opportunities.

**Authentication**: Required

**Query Parameters**:
- `search` (optional) - Search by title or company
- `limit` (optional) - Number of results (default: 10)
- `company_name` (optional) - Filter by company
- `category` (optional) - Filter by type (Internship/Job/Freelance)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Opportunities fetched successfully",
  "statusCode": 200,
  "data": [
    {
      "id": "opp_123",
      "title": "Full Stack Developer Intern",
      "company": "Google",
      "match": "Good",
      "atsScore": 78,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Example**:
```bash
curl -X GET "http://localhost:4000/api/opportunities?limit=5&category=Internship" \
  -H "Cookie: accessToken=<jwt>"
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| `200` | Success |
| `201` | Created successfully |
| `400` | Bad request (validation error) |
| `401` | Unauthorized (not authenticated) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Resource not found |
| `409` | Conflict (duplicate resource) |
| `500` | Internal server error |

---

## Rate Limiting

Currently no rate limiting is enforced. For production deployment, consider:
- **Authentication endpoints**: 5 requests per minute
- **Analysis endpoints**: 10 requests per hour
- **Read endpoints**: 100 requests per minute

---

## Schema Validation

All request bodies are validated using Zod schemas. Validation errors return detailed information:

```json
{
  "success": false,
  "message": "Validation error",
  "statusCode": 400,
  "errors": [
    {
      "path": ["meta", "title"],
      "message": "Required field missing"
    }
  ]
}
```

---

## Testing APIs

### Using cURL

```bash
# Login and save cookies
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  -c cookies.txt

# Use saved cookies for authenticated requests
curl -X GET http://localhost:4000/api/users/profile \
  -b cookies.txt
```

### Using Postman

1. Import the API collection (if provided)
2. Set environment variable: `baseUrl = http://localhost:4000/api`
3. Login to get authentication cookie
4. Postman will automatically handle cookies

### Using JavaScript (Frontend)

```javascript
// Login
const response = await fetch('http://localhost:4000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'test123'
  })
});

// Authenticated request
const profile = await fetch('http://localhost:4000/api/users/profile', {
  credentials: 'include'
});
```

---

## WebSocket Support

Currently not implemented. Future consideration for real-time features.

---

## Pagination

For endpoints returning lists, pagination will be implemented:

**Query Parameters**:
- `page` (default: 1)
- `limit` (default: 10, max: 100)

**Response**:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "hasMore": true
  }
}
```

---

## Related Documentation

- [Getting Started](./GETTING_STARTED.md)
- [Authentication Details](./technical/authentication.md)
- [Database Schema](./technical/database.md)
- [AI Engine](./packages/ai-engine.md)

---

**API Version**: 1.0.0  
**Last Updated**: January 2026
