const express = require("express");
const { Client } = require("pg");

const app = express();

const PORT = process.env.PORT || 3000;

const db = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function startServer() {
  try {
    await db.connect();

    console.log("PostgreSQL connected successfully");
    console.log("Automated EC2 deployment v1.0.11");

    app.get("/", (req, res) => {
      res.json({
        message: "Docker Day 19 API",
      });
    });

    app.get("/health", async (req, res) => {
      try {
        await db.query("SELECT 1");

        res.status(200).json({
          status: "healthy",
          database: "connected",
        });
      } catch (error) {
        res.status(503).json({
          status: "unhealthy",
          database: "disconnected",
        });
      }
    });

    app.get("/db-test", async (req, res) => {
      try {
        const result = await db.query("SELECT NOW()");

        res.json({
          database: "connected",
          time: result.rows[0].now,
        });
      } catch (error) {
        res.status(500).json({
          database: "error",
          message: error.message,
        });
      }
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("PostgreSQL connection failed:", error);
    process.exit(1);
  }
}

startServer();
