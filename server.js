import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import dairyRoutes from "./routes/dairyRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";

dotenv.config(); // Load .env variables

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB connection (optimized for AWS)
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || "dairyApp",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // fail fast if unreachable
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log("✅ MongoDB Connected:", conn.connection.host);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }
}

// ✅ Middleware to ensure DB is connected
app.use(async (req, res, next) => {
  if (!isConnected) await connectToDatabase();
  next();
});

// ✅ Routes
app.use("/api/auth", dairyRoutes);
app.use("/api/customer", customerRoutes);

// ✅ Health check route (used by AWS ALB / ELB)
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Dairy API is running on AWS environment!",
    env: process.env.NODE_ENV || "development",
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ✅ 500 handler
app.use((err, req, res, next) => {
  console.error("⚠️ Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ✅ Start Server (for AWS EC2 / Elastic Beanstalk / local)
const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, async () => {
  await connectToDatabase();
  console.log(`🚀 Server running on http://${HOST}:${PORT} in AWS environment`);
});
