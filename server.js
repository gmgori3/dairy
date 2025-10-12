import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dairyRoutes from "./routes/dairyRoutes.js";

dotenv.config(); // Load .env

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// MongoDB connection (serverless-friendly)
let isConnected = false;

async function connectToDatabase() {
  try {
    if (!isConnected) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log("✅ Database connected successfully.");
    }
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
}

// Middleware to ensure DB is connected before handling routes
app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectToDatabase();
  }
  next();
});

// Routes
app.use("/api/auth", dairyRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("✅ Node.js Auth API is running...");
});

// 404 handler
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// 500 handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// Export app for Vercel
export default app;