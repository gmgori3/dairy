const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const dairyRoutes = require("./routes/dairyRoutes");

dotenv.config();

const app = express();
app.use(express.json());

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
    });
    isConnected = conn.connections[0].readyState === 1;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
}

// ✅ Connect to DB before setting routes
connectToDatabase().then(() => {
  app.use("/api/auth", dairyRoutes);

  app.get("/", (req, res) => {
    res.send("✅ API is running...");
  });
});

// Error handlers
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message });
});

module.exports = app;
