import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { errorMiddleware } from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import fs from "fs";

// Routes
import UserRouter from "./routes/user.route.js";
import AuthRouter from "./routes/auth.router.js";

//__filename & __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATIC_DIR = path.join(__dirname, "static");
// Express app
const app = express();

/* -------------------- MIDDLEWARES -------------------- */

// JSON body parse
app.use(express.json());
app.use(cookieParser());

// URL-encoded body parse
app.use(express.urlencoded({ extended: true }));

// Static frontend (client)
app.use(express.static(STATIC_DIR));

/* -------------------- ROUTES -------------------- */
// authentication routes
app.use("/api/users", UserRouter);
app.use("/api/auth", AuthRouter);

/* -------------------- FRONTEND ROUTES -------------------- */
app.get("*", (req : Request, res: Response) => {
  const page = req.path.replace("/", "") || "login";
  const filePath = path.join(STATIC_DIR,"pages", `${page}.html`);

  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  res.status(404).sendFile(path.join(STATIC_DIR,"pages", "notFound.html"));
});

/* -------------------- ERROR HANDLING -------------------- */
app.use(errorMiddleware);

export default app;
