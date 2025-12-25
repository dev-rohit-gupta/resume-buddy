import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { errorMiddleware } from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";

// Routes
import LoginRouter from "./routes/login.route.js";
import SignupRouter from "./routes/signup.route.js";
import LogoutRouter from "./routes/logout.route.js";

//__filename & __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express app
const app = express();

/* -------------------- MIDDLEWARES -------------------- */

// JSON body parse
app.use(express.json());
app.use(cookieParser());

// URL-encoded body parse
app.use(express.urlencoded({ extended: true }));

// Static frontend (client)
app.use(express.static(path.join(__dirname, "static")));

/* -------------------- ROUTES -------------------- */
// authentication routes
app.use("/api/auth", LoginRouter);
app.use("/api/auth", SignupRouter);
app.use("/api/auth", LogoutRouter);

/* -------------------- FALLBACK -------------------- */

/* --------- SPA / direct reload support --------------*/
app.get("*", (_req : Request, res : Response) => {
  
  res.sendFile(path.join(__dirname, "static/index.html"));
});

/* -------------------- ERROR HANDLING -------------------- */
app.use(errorMiddleware);

export default app;
