const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./src/config/db");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser with limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie parser
app.use(cookieParser());

// Define allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://task-frontend-4zvb.onrender.com",
];

// Add FRONTEND_URL from environment if it exists and isn't already in the list
if (
  process.env.FRONTEND_URL &&
  !allowedOrigins.includes(process.env.FRONTEND_URL)
) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// CORS configuration - FIXED for multiple origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Trust proxy - required for secure cookies in production
app.set("trust proxy", 1);

// Request logging
app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.url} - Origin: ${req.headers.origin || "No Origin"}`,
  );
  next();
});

// Import routes
const auth = require("./src/routes/authRoutes");
const tasks = require("./src/routes/taskRoutes");

// Mount routers
app.use("/api/auth", auth);
app.use("/api/tasks", tasks);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    allowedOrigins: allowedOrigins, // This helps with debugging
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  // Don't leak error details in production
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message;

  res.status(err.status || 500).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// Graceful shutdown
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌍 CORS enabled for origins:`);
  allowedOrigins.forEach((origin) => console.log(`   - ${origin}`));
  console.log(`\n`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("❌ Unhandled Rejection:", err.message);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("❌ Uncaught Exception:", err.message);
});

// Graceful shutdown on termination
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Closing server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
