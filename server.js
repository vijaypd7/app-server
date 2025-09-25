const express = require("express");
const axios = require("axios");
const { pool } = require("./config/database");
const { v4 } = require("uuid");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const THIRD_PARTY_URL =
  process.env.THIRD_PARTY_URL || "https://2a86add2dee8.ngrok-free.app";

// Middleware to parse JSON bodies with increased limit for base64 data
app.use(express.json({ limit: '50mb' }));

// Middleware to parse URL-encoded bodies with increased limit
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Express server!",
    timestamp: new Date().toISOString(),
    status: "Server is running successfully",
  });
});

app.post("/descriptions/base64", async (req, res) => {
  try {
    // Extract data from the request body. `req.body` is populated by the `express.json()` middleware.
    const { media_type, base64_data } = req.body;

    let journal_id;
    const [rows] = await pool.query(
      "SELECT id FROM journals WHERE DATE(created_at) = CURDATE() LIMIT 1"
    );
    if (rows.length > 0) {
      journal_id = rows[0].id;
    } else {
      // Create a new journal row
      journal_id = v4();
      const [result] = await pool.query(
        "INSERT INTO journals (id) VALUES (?)",
        [journal_id]
      );
    }

    // INSERT_YOUR_CODE
    // Insert a new row into the session table and get the session id
    const session_id = v4();
    const metadata = {
      base64_image: base64_data,
    };
     await pool.query(
      "INSERT INTO sessions (id, journal_id, metadata) VALUES (?, ?, ?)",
      [session_id, journal_id, JSON.stringify(metadata)]
    );

    // Make a POST request to the third-party URL with the provided body
    const axiosResponse = await axios.post(
      `${THIRD_PARTY_URL}/descriptions/base64`,
      { base64_data, media_type }
    );

    // Assume the third-party response contains a 'description' field
    const description = axiosResponse.data.description;

    return res
      .status(200)
      .json({
        description: description,
        journal_id: journal_id,
        session_id: session_id,
      });
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return res.status(500).json({ detail: error.message });
  }
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Start the server
    app.listen(PORT, () => {
      console.log(`💾 Database: MySQL connected`);
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
