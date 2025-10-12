import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with better error handling
let isConnected = false;

async function connectToDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    isConnected = false;
    throw error;
  }
}

// Connect to database on startup
connectToDatabase().catch(err => {
  console.error("Failed to connect to database on startup:", err);
});

// Health check route (before other routes)
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "✅ Node.js API is running...",
    dbStatus: isConnected ? "Connected" : "Disconnected"
  });
});

// Test route to verify basic functionality
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Test route working",
    timestamp: new Date().toISOString()
  });
});

// Import routes with error handling
let dairyRoutes, customerRoutes;

try {
  const dairyModule = await import("./routes/dairyRoutes.js");
  dairyRoutes = dairyModule.default;
  console.log("✅ Dairy routes loaded");
} catch (error) {
  console.error("❌ Error loading dairy routes:", error.message);
}

try {
  const customerModule = await import("./routes/customerRoutes.js");
  customerRoutes = customerModule.default;
  console.log("✅ Customer routes loaded");
} catch (error) {
  console.error("❌ Error loading customer routes:", error.message);
}

// Register routes only if they loaded successfully
if (dairyRoutes) {
  app.use("/api/auth", dairyRoutes);
  console.log("✅ Dairy routes registered at /api/auth");
}

if (customerRoutes) {
  app.use("/api/customers", customerRoutes);
  console.log("✅ Customer routes registered at /api/customers");
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;