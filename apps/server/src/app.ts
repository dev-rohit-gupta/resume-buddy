import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { errorMiddleware } from "./middleware/error.middleware.js";

//__filename & __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express app
const app = express();

/* -------------------- MIDDLEWARES -------------------- */

// JSON body parse
app.use(express.json());

// Static frontend (client)
app.use(express.static(path.join(__dirname, "static")));

/* -------------------- ROUTES -------------------- */

/* -------------------- FALLBACK -------------------- */

/* --------- SPA / direct reload support --------------*/
app.get("*", (_req : Request, res : Response) => {
  
  res.sendFile(path.join(__dirname, "static/index.html"));
});

/* -------------------- ERROR HANDLING -------------------- */
app.use(errorMiddleware);

export default app;
