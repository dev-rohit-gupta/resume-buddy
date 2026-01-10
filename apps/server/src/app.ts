import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { verifyAccessToken, getToken } from "@resume-buddy/utils";
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

/* -------------------- FRONTEND ROUTES INFO -------------------- */
// Define protected prefixes
const protectedPrefixes = ["dashboard"];
// Define guest-only pages
const guestOnlyPages = new Set(["login", "signup"]);

/* -------------------- FRONTEND ROUTES -------------------- */
app.get("*", async (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).end();
  }

  const page = req.path.replace(/^\/+/, "");
  // Check if the page is protected
  const isProtected = protectedPrefixes.some(
    (prefix) => page === prefix || page.startsWith(`${prefix}/`)
  );
  const token = getToken(req);

  // Protected pages
  if (isProtected) {
    if (!token) {
      return res.redirect("/login");
    }

    try {
      await verifyAccessToken(token);
    } catch {
      return res.redirect("/login");
    }
  }

  // Guest-only pages
  if (guestOnlyPages.has(page)) {
    if (token) {
      try {
        await verifyAccessToken(token);
        return res.redirect("/dashboard");
      } catch {
        // invalid token → allow guest
      }
    }
  }

  // Serve HTML
  const filePath = path.join(STATIC_DIR, "pages", `${page}.html`);

  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  return res.status(404).sendFile(path.join(STATIC_DIR, "pages", "notFound.html"));
});

/* -------------------- ERROR HANDLING -------------------- */
app.use(errorMiddleware);

export default app;
