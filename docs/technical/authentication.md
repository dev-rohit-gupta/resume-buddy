# Authentication System

Resume Buddy uses JWT (JSON Web Tokens) with HTTP-only cookies for secure, stateless authentication.

## 🔐 Authentication Flow

### Signup Flow

```
User submits signup form
  ↓
Validate input (name, email, password, resume file)
  ↓
Check if email already exists
  ↓
Generate unique user ID
  ↓
Parse and extract resume (AI)
  ↓
Hash password with bcrypt
  ↓
Save user to database
  ↓
Generate JWT access token
  ↓
Set HTTP-only cookie
  ↓
Return user data (no password)
```

### Login Flow

```
User submits credentials
  ↓
Validate input (email, password)
  ↓
Find user by email (include password)
  ↓
Verify password with bcrypt
  ↓
Generate JWT access token
  ↓
Set HTTP-only cookie
  ↓
Return user data
```

### Logout Flow

```
User requests logout
  ↓
Clear access token cookie
  ↓
Return success message
```

## 🎫 JWT Implementation

### Token Generation

**Method**: `user.generateAccessToken()`

```typescript
import { SignJWT } from 'jose';

UserSchema.methods.generateAccessToken = async function() {
  const secret = new TextEncoder().encode(
    process.env.ACCESS_TOKEN_SECRET!
  );
  
  return await new SignJWT({
    id: this._id.toString(),
    role: this.role
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRY ?? '7d')
    .sign(secret);
};
```

**Payload**:
```json
{
  "id": "usr_abc123",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Token Verification

**Utility**: `verifyAccessToken()`

```typescript
import { jwtVerify } from 'jose';

export async function verifyAccessToken(token: string) {
  const secret = new TextEncoder().encode(
    process.env.ACCESS_TOKEN_SECRET!
  );
  
  const { payload } = await jwtVerify<{
    id: string;
    role: "user" | "admin";
  }>(token, secret);
  
  return payload;
}
```

**Usage**:
```typescript
try {
  const payload = await verifyAccessToken(token);
  console.log(payload.id);   // "usr_abc123"
  console.log(payload.role); // "user"
} catch (error) {
  // Invalid or expired token
  throw new ApiError(401, 'Invalid token');
}
```

### Token Extraction

```typescript
export function getToken(req: Request): string | undefined {
  // Check cookie first
  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }
  
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  return undefined;
}
```

## 🍪 Cookie Configuration

### Setting Cookies

```typescript
// controllers/login.controller.ts
const token = await user.generateAccessToken();

res.cookie('accessToken', token, {
  httpOnly: true,              // No JS access
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
  sameSite: 'strict',          // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
});
```

### Clearing Cookies

```typescript
// controllers/logout.controller.ts
res.clearCookie('accessToken', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
});
```

### Cookie Security

**Production Settings**:
```typescript
{
  httpOnly: true,      // Prevents XSS attacks
  secure: true,        // HTTPS only
  sameSite: 'strict',  // Prevents CSRF
  domain: '.yourdomain.com',  // Restrict to domain
  path: '/'            // Available site-wide
}
```

**Development Settings**:
```typescript
{
  httpOnly: true,
  secure: false,       // Allow HTTP in development
  sameSite: 'strict'
}
```

## 🔑 Password Security

### Password Hashing

**Pre-save Middleware**:

```typescript
UserSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }
  
  // Hash with bcrypt, salt rounds = 10
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

**Salt Rounds**: 10 (recommended for 2024)
- Higher = More secure but slower
- 10 = ~100ms hashing time
- Production: Consider 12 for critical applications

### Password Verification

```typescript
UserSchema.methods.isPasswordCorrect = async function(
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};
```

**Usage**:
```typescript
const user = await UserModel.findOne({ email }).select('+password');
const isValid = await user.isPasswordCorrect(inputPassword);

if (!isValid) {
  throw new ApiError(401, 'Invalid credentials');
}
```

### Password Requirements

Currently no enforced requirements. Recommended:
- Minimum 6 characters (enforced in schema)
- Consider: uppercase, lowercase, number, special char

**Implementation**:
```typescript
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[a-z]/, 'Must contain lowercase letter')
  .regex(/[0-9]/, 'Must contain number')
  .regex(/[@$!%*?&#]/, 'Must contain special character');
```

## 🛡️ Auth Middleware

### requireAuth Middleware

**File**: `middleware/auth.middleware.ts`

```typescript
import { verifyAccessToken, getToken, ApiError } from '@resume-buddy/utils';

export const requireAuth = async (req, res, next) => {
  try {
    // Extract token
    const token = getToken(req);
    
    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }
    
    // Verify token
    const payload = await verifyAccessToken(token);
    
    // Attach user to request
    req.user = payload;
    
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }
};
```

**Usage**:
```typescript
// Apply to routes
app.use('/api/users', requireAuth, UserRouter);
app.use('/api/opportunities', requireAuth, OpportunityRouter);

// Or individual routes
router.get('/profile', requireAuth, getProfileController);
```

### Optional Auth Middleware

For routes that work with or without authentication:

```typescript
export const optionalAuth = async (req, res, next) => {
  try {
    const token = getToken(req);
    
    if (token) {
      const payload = await verifyAccessToken(token);
      req.user = payload;
    }
    
    next();
  } catch (error) {
    // Continue without auth
    next();
  }
};
```

### Role-Based Access

```typescript
export const requireAdmin = async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }
  
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Admin access required');
  }
  
  next();
};

// Usage
router.delete('/users/:id', requireAuth, requireAdmin, deleteUserController);
```

## 🔄 Frontend Integration

### Login Request

```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',  // Important for cookies!
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

if (response.ok) {
  // Cookie automatically set by browser
  window.location.href = '/dashboard';
}
```

### Authenticated Requests

```javascript
const response = await fetch('/api/users/profile', {
  credentials: 'include'  // Send cookies automatically
});

const data = await response.json();
```

### Logout Request

```javascript
const response = await fetch('/api/auth/logout', {
  method: 'POST',
  credentials: 'include'
});

if (response.ok) {
  window.location.href = '/login';
}
```

## 🚫 Route Protection (Server-Side)

### Protected Pages

**File**: `app.ts`

```typescript
const protectedPrefixes = ['dashboard'];
const guestOnlyPages = new Set(['login', 'signup']);

app.get('*', async (req, res) => {
  const page = req.path.replace(/^\/+/, '');
  const isProtected = protectedPrefixes.some(
    prefix => page === prefix || page.startsWith(`${prefix}/`)
  );
  
  const token = getToken(req);
  
  // Protected pages require authentication
  if (isProtected) {
    if (!token) {
      return res.redirect('/login');
    }
    
    try {
      await verifyAccessToken(token);
    } catch {
      return res.redirect('/login');
    }
  }
  
  // Guest-only pages (login/signup) redirect if authenticated
  if (guestOnlyPages.has(page) && token) {
    try {
      await verifyAccessToken(token);
      return res.redirect('/dashboard');
    } catch {
      // Invalid token, allow access
    }
  }
  
  // Serve page
  res.sendFile(path.join(STATIC_DIR, 'pages', `${page}.html`));
});
```

## 🔒 Security Best Practices

### 1. Environment Variables

```env
# Strong random secret (64+ characters)
ACCESS_TOKEN_SECRET=your_super_secret_random_string_here

# Appropriate expiry
ACCESS_TOKEN_EXPIRY=7d
```

**Generate Secret**:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -hex 64
```

### 2. Password Never Exposed

```typescript
// Good - password excluded by default
const user = await UserModel.findOne({ email });

// Bad - explicitly excluding
const user = await UserModel.findOne({ email }).select('-password');

// Only when needed
const user = await UserModel.findOne({ email }).select('+password');
```

### 3. Token Expiry

```typescript
// Short-lived tokens for sensitive operations
const resetToken = await new SignJWT({...})
  .setExpirationTime('15m');  // 15 minutes

// Longer for general access
const accessToken = await new SignJWT({...})
  .setExpirationTime('7d');   // 7 days
```

### 4. Rate Limiting (Recommended)

```typescript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                     // 5 requests
  message: 'Too many login attempts, please try again later'
});

router.post('/login', loginLimiter, loginController);
```

### 5. HTTPS in Production

```typescript
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}
```

## 🚨 Common Issues

### 1. Cookie Not Set

**Problem**: Login successful but cookie not received

**Solutions**:
- Check `credentials: 'include'` in fetch
- Verify cookie options match environment
- Check CORS configuration
- Ensure same domain/subdomain

### 2. Token Expired

**Problem**: "Invalid or expired token" error

**Solutions**:
- Check token expiry time
- Implement refresh token flow
- Redirect to login
- Clear cookies on client

### 3. CORS Issues

**Problem**: Cookies not sent cross-origin

**Solutions**:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

## 🔄 Future Enhancements

- [ ] Refresh token implementation
- [ ] Two-factor authentication (2FA)
- [ ] OAuth integration (Google, GitHub)
- [ ] Session management
- [ ] Device tracking
- [ ] Password reset flow
- [ ] Email verification

## 📚 Related Documentation

- [Database](./database.md) - User model and storage
- [API Reference](../API_REFERENCE.md) - Auth endpoints
- [Utils](../packages/utils.md) - Auth utilities

---

**Auth Philosophy**: Secure by default, simple to use, stateless and scalable.
