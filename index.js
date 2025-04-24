const express = require("express");
const cors = require("cors");
const path = require("path");
const sessions = require("express-session");
const dotenv = require("dotenv");
const methodOverride = require("method-override");

const db = require("./db"); // Import DB connection functions
const projectModel = require("./components/Project/model");
const skillModel = require("./components/Skill/model");

const projectRoutes = require("./components/Project/routes");
const skillRoutes = require("./components/Skill/routes");

// Load the environment variables from .env
dotenv.config();

// Set up the Express app
const app = express();
const port = process.env.PORT || 8080;

// Middleware setup
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Sessions
app.use(
  sessions({
    secret: process.env.SESSIONSECRET,
    name: "MyUniqueSessID",
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    },
  })
);

// Mount routes
app.use("/projects", projectRoutes);
app.use("/skills", skillRoutes);

// API routes
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);

// Main page: renders the index view with data
app.get("/", async (req, res) => {
  try {
    const projects = await projectModel.getProjects();
    const skills = await skillModel.getSkills();
    res.render("index", { 
      projects, 
      skills,
      query: req.query // Pass query parameters to the view
    });
  } catch (error) {
    console.error("Error on main page:", error);
    res.status(500).render("error", { 
      message: "Error loading projects and skills",
      error: process.env.NODE_ENV === "development" ? error : {}
    });
  }
});

// Optional: fallback JSON endpoints if needed
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await projectModel.getProjects();
    res.json(projects);
  } catch (error) {
    handleError(res, error, "Failed to load API root data");
  }
});

app.get("/api/skills", async (req, res) => {
  try {
    const skills = await skillModel.getSkills();
    res.json({ skills });
  } catch (error) {
    handleError(res, error, "Failed to load API root data");
  }
});

// Centralized error handler
const handleError = (res, error, message = "Server error") => {
  console.error(error);
  res.status(500).json({ message, error: process.env.NODE_ENV === "development" ? error.message : undefined });
};

// Start the server
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});