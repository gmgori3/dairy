const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { default: mongoose } = require("mongoose");

dotenv.config(); // Load .env

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies

// Database Connection
connectDB();

// Routes
app.use("/api/auth", require("./routes/dairyRoutes"));
app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Catch internal server errors
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});
// Default route
app.get("/", (req, res) => {
  res.send("✅ Node.js Auth API is running...");
});

// Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

let isConnected = false;
async function connectToDatabase() {
  try {
    if (!isConnected) {
      await mongoose.connect(mongoURI);
      isConnected = true;
      console.log("Database connected successfully.");
  }
} catch (error) {
  console.error("Database connection error:", error);
}
}
