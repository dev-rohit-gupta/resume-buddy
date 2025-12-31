import multer from "multer";
import { ApiError } from "@resume-buddy/utils";

/* ---------- config ---------- */

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
];

/* ---------- storage ---------- */
// Using memory storage to keep files in memory as Buffer objects
const storage = multer.memoryStorage();

/* ---------- file filter ---------- */
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new ApiError(400, "Invalid file type. Only PDF or DOCX resumes are allowed."));
  }

  cb(null, true);
};

/* ---------- multer instance ---------- */
export const uploader = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});
