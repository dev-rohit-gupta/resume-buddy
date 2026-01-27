# File Uploads Documentation

Resume Buddy handles file uploads for resume documents using Multer for local processing and Cloudinary for cloud storage.

## 🎯 Overview

**Supported Files**: PDF, DOCX  
**Max Size**: 10MB  
**Storage**: Cloudinary (cloud) + Local buffer (temporary)  
**Processing**: Text extraction → AI analysis → Cloud backup

## 🔧 Technology Stack

- **Multer** - Express middleware for handling multipart/form-data
- **Cloudinary** - Cloud storage and CDN
- **pdf-parse** - PDF text extraction
- **mammoth** - DOCX text extraction

## 📤 Upload Flow

```
User selects file
  ↓
Frontend form submit (multipart/form-data)
  ↓
Multer middleware
  - Validate file type
  - Validate file size
  - Store in memory buffer
  ↓
Controller receives file buffer
  ↓
Parse file to text
  - PDF: pdf-parse
  - DOCX: mammoth
  ↓
AI extraction (analyzeResume)
  ↓
Upload original to Cloudinary
  ↓
Save data to database
  ↓
Return resume data
```

## 🛠️ Multer Configuration

**File**: `middleware/multer.middleware.ts`

```typescript
import multer from 'multer';

// Memory storage (buffer)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and DOCX files are allowed'), false);
  }
};

// Multer instance
export const uploader = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,  // 10MB
    files: 1                      // Single file
  }
});
```

### File Validation

**MIME Types**:
- PDF: `application/pdf`
- DOCX: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

**File Extensions** (optional additional check):
```typescript
const allowedExtensions = ['.pdf', '.docx'];
const ext = path.extname(file.originalname).toLowerCase();

if (!allowedExtensions.includes(ext)) {
  return cb(new Error('Invalid file extension'), false);
}
```

**Size Limits**:
```typescript
limits: {
  fileSize: 10 * 1024 * 1024,  // 10MB
  files: 1,                     // Single file upload
  fields: 10,                   // Max number of non-file fields
  fieldSize: 1024 * 1024        // 1MB per field
}
```

## ☁️ Cloudinary Configuration

**File**: `config/cloudinary.config.ts`

```typescript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;
```

### Environment Variables

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Get Credentials**:
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Dashboard → Account Details
3. Copy Cloud Name, API Key, API Secret

## 📁 File Upload Implementation

### Route Definition

```typescript
import { uploader } from '../middleware/multer.middleware';

router.post(
  '/signup',
  uploader.single('file'),  // 'file' is the form field name
  signupController
);
```

### Controller Usage

```typescript
export const signupController = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const file = req.file;  // Multer attaches file to req
  
  if (!file) {
    throw new ApiError(400, 'Resume file is required');
  }
  
  // File properties
  console.log(file.buffer);        // Buffer
  console.log(file.mimetype);      // MIME type
  console.log(file.originalname);  // Original filename
  console.log(file.size);          // Size in bytes
  
  // Process file
  const resumeData = await processResume(file.buffer, file.mimetype);
  
  // Upload to Cloudinary
  const cloudinaryUrl = await uploadToCloudinary(file);
  
  // ...
});
```

### File Object Structure

```typescript
{
  fieldname: 'file',
  originalname: 'resume.pdf',
  encoding: '7bit',
  mimetype: 'application/pdf',
  buffer: <Buffer ...>,
  size: 123456
}
```

## 🔄 File Processing

### PDF Extraction

```typescript
import pdfParse from 'pdf-parse';

async function extractPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new ApiError(500, 'Failed to parse PDF file');
  }
}
```

**Limitations**:
- Text-based PDFs only
- Scanned images (OCR) not supported
- Password-protected PDFs fail
- Complex layouts may extract incorrectly

### DOCX Extraction

```typescript
import mammoth from 'mammoth';

async function extractDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new ApiError(500, 'Failed to parse DOCX file');
  }
}
```

**Advantages**:
- Better structure preservation
- Handles lists, tables
- More reliable extraction

### Unified Parser

```typescript
async function parseResume(
  buffer: Buffer, 
  mimeType: string
): Promise<string> {
  if (mimeType === 'application/pdf') {
    return extractPDF(buffer);
  } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return extractDOCX(buffer);
  } else {
    throw new ApiError(400, 'Unsupported file type');
  }
}
```

## ☁️ Cloudinary Upload

### Upload Function

```typescript
import cloudinary from '../config/cloudinary.config';
import { Readable } from 'stream';

async function uploadToCloudinary(file: Express.Multer.File): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'resumes',
        resource_type: 'raw',
        public_id: `resume_${Date.now()}`,
        overwrite: true
      },
      (error, result) => {
        if (error) {
          reject(new ApiError(500, 'Cloudinary upload failed'));
        } else {
          resolve(result!.secure_url);
        }
      }
    );
    
    // Convert buffer to stream
    const bufferStream = Readable.from(file.buffer);
    bufferStream.pipe(uploadStream);
  });
}
```

### Upload Options

```typescript
{
  folder: 'resumes',              // Organize in folders
  resource_type: 'raw',           // Non-image files
  public_id: 'resume_user123',   // Custom filename
  overwrite: true,                // Replace if exists
  use_filename: true,             // Use original filename
  unique_filename: true,          // Add random string
  tags: ['resume', 'pdf'],        // Tags for organization
}
```

### Retrieve URL

```typescript
const url = result.secure_url;
// https://res.cloudinary.com/cloud/raw/upload/v123/resumes/resume_123.pdf
```

## 📊 Complete Upload Service

```typescript
// services/resume.upload.service.ts
import { parseResume } from '@resume-buddy/utils';
import { analyzeResume } from '@resume-buddy/ai-engine';

export async function uploadAndProcessResume(
  file: Express.Multer.File
): Promise<{ data: Resume; url: string }> {
  // 1. Parse file to text
  const text = await parseResume(file.buffer, file.mimetype);
  
  // 2. AI extraction
  const resumeData = await analyzeResume(file.buffer, file.mimetype);
  
  // 3. Upload to Cloudinary
  const cloudinaryUrl = await uploadToCloudinary(file);
  
  return {
    data: resumeData,
    url: cloudinaryUrl
  };
}
```

## 🎨 Frontend Implementation

### HTML Form

```html
<form id="signupForm" enctype="multipart/form-data">
  <input type="text" name="name" required />
  <input type="email" name="email" required />
  <input type="password" name="password" required />
  <input type="file" name="file" accept=".pdf,.docx" required />
  <button type="submit">Sign Up</button>
</form>
```

### JavaScript Submission

```javascript
const form = document.getElementById('signupForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(form);
  
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: formData,  // Don't set Content-Type header
    credentials: 'include'
  });
  
  if (response.ok) {
    const data = await response.json();
    console.log('Signup successful', data);
    window.location.href = '/dashboard';
  } else {
    const error = await response.json();
    alert(error.message);
  }
});
```

### File Validation (Client-Side)

```javascript
const fileInput = document.querySelector('input[type="file"]');

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  
  // Check file size
  if (file.size > 10 * 1024 * 1024) {
    alert('File size must be less than 10MB');
    fileInput.value = '';
    return;
  }
  
  // Check file type
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(file.type)) {
    alert('Only PDF and DOCX files are allowed');
    fileInput.value = '';
    return;
  }
});
```

## 🚨 Error Handling

### Common Errors

#### 1. File Too Large

```typescript
Error: File too large

Multer Response:
{
  "success": false,
  "message": "File too large",
  "statusCode": 413
}

Solution: Reduce file size or increase limit
```

#### 2. Invalid File Type

```typescript
Error: Only PDF and DOCX files are allowed

Response:
{
  "success": false,
  "message": "Only PDF and DOCX files are allowed",
  "statusCode": 400
}

Solution: Check file extension and MIME type
```

#### 3. Cloudinary Upload Failed

```typescript
Error: Cloudinary upload failed

Possible Causes:
- Invalid credentials
- Network timeout
- File size exceeded Cloudinary limits
- Quota exceeded

Solution: Check credentials, retry, or upgrade plan
```

#### 4. PDF Parsing Failed

```typescript
Error: Failed to parse PDF file

Causes:
- Corrupted PDF
- Password-protected
- Scanned image (no text)
- Unsupported PDF version

Solution: Re-upload, remove password, or use DOCX
```

### Error Middleware

```typescript
// middleware/error.middleware.ts
export const errorMiddleware = (err, req, res, next) => {
  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'File too large. Maximum size is 10MB'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field'
      });
    }
  }
  
  // Other errors
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message
  });
};
```

## 🧪 Testing

### Unit Tests

```typescript
describe('File Upload', () => {
  it('should accept valid PDF file', async () => {
    const buffer = fs.readFileSync('test-resume.pdf');
    const file = {
      buffer,
      mimetype: 'application/pdf',
      originalname: 'test-resume.pdf',
      size: buffer.length
    };
    
    const text = await parseResume(file.buffer, file.mimetype);
    expect(text).toBeDefined();
    expect(text.length).toBeGreaterThan(0);
  });
});
```

### Integration Tests

```typescript
describe('Signup with Resume', () => {
  it('should upload resume on signup', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .field('name', 'Test User')
      .field('email', 'test@example.com')
      .field('password', 'password123')
      .attach('file', 'test-resume.pdf');
    
    expect(res.status).toBe(201);
    expect(res.body.data.user).toHaveProperty('id');
  });
  
  it('should reject invalid file type', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .field('name', 'Test User')
      .field('email', 'test@example.com')
      .field('password', 'password123')
      .attach('file', 'image.jpg');
    
    expect(res.status).toBe(400);
  });
});
```

## 📈 Performance Optimization

### 1. Parallel Processing

```typescript
const [resumeData, cloudinaryUrl] = await Promise.all([
  analyzeResume(file.buffer, file.mimetype),
  uploadToCloudinary(file)
]);
```

### 2. Stream Processing (Large Files)

```typescript
const stream = Readable.from(file.buffer);
// Process in chunks
```

### 3. Background Jobs (Optional)

```typescript
// Queue resume processing
await queue.add('processResume', {
  userId: user.id,
  fileBuffer: file.buffer.toString('base64'),
  mimeType: file.mimetype
});
```

## 🔒 Security Considerations

1. **Validate MIME Type and Extension**
2. **Scan for malware** (consider ClamAV)
3. **Limit file size** strictly
4. **Use signed URLs** for downloads
5. **Virus scanning** before processing
6. **Rate limit** upload endpoints

## 🚀 Future Enhancements

- [ ] Support for more formats (RTF, TXT)
- [ ] OCR for scanned PDFs
- [ ] Direct upload to AWS S3
- [ ] Progress indicators for large files
- [ ] Batch resume uploads
- [ ] Resume templates
- [ ] File compression

## 📚 Related Documentation

- [Resume Extraction](../features/resume-extraction.md) - Full extraction workflow
- [Authentication](./authentication.md) - Signup with file upload
- [Utils](../packages/utils.md) - File parsing utilities

---

**File Upload Philosophy**: Secure, validated, and reliable file handling.
