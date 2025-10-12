import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dairyRoutes from "./routes/dairyRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// MongoDB connection with proper error handling
let isConnected = false;

async function connectToDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    // Remove deprecated options
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    isConnected = true;
    console.log("✅ Database connected successfully.");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    isConnected = false;
    throw error;
  }
}

// Handle mongoose connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  isConnected = false;
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  isConnected = false;
});

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: "Database connection failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Routes
app.use("/api/auth", dairyRoutes);
app.use("/api/customer", customerRoutes);

// Default route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "✅ Node.js Auth API is running...",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Export for Vercel
export default app;