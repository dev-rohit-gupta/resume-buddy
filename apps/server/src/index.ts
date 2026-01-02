import dotenv from "dotenv";
// Load environment variables
dotenv.config();
import { initCloudinary } from "./services/cloudinary.service.js";
import app from "./app.js";
import { connectToDataBase } from "./db/connection.js";

// Connect to the database
connectToDataBase();
// Initialize Cloudinary
initCloudinary();

const PORT = process.env.PORT!;

app.listen(PORT, () => {
  console.log(`🚀 Resume Buddy server running on http://localhost:${PORT}`);
});
