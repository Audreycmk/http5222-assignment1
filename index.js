const express = require("express");
const cors = require("cors");
const path = require("path");
const sessions = require("express-session");
const dotenv = require("dotenv");
const db = require("./db"); // Import DB connection functions
const projectModel = require("./components/Project/model");
const skillModel = require("./components/Skill/model");
const methodOverride = require('method-override');


// Load the environment variables from .env
dotenv.config();

// Set up the Express app
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
// Set up application template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Set up folder for static files
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'));

// Set up app to use sessions
app.use(
  sessions({
    secret: process.env.SESSIONSECRET,
    name: "MyUniqueSessID",
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true, // Ensures cookie is not accessible through JavaScript
      secure: process.env.NODE_ENV === "production", // Only set the cookie over HTTPS in production
      sameSite: "Strict", // Helps prevent CSRF attacks
    },
  })
);
// Use the routes for projects and skills
const projectRoutes = require("./components/Project/routes");
const skillRoutes = require("./components/Skill/routes");

app.use("/projects", projectRoutes);
app.use("/skills", skillRoutes);

app.get("/", async (req, res) => {
  try {
    const projects = await projectModel.getProjects();
    const skills = await skillModel.getSkills();
    res.render("index", { projects, skills });
  } catch (error) {
    handleError(res, error);
  }
});

// Centralized error handler function
const handleError = (res, error, message = "Server error") => {
  console.error(error);
  res.status(500).send(message);
};

// Route to render the index page with projects and skills
app.get("/projects", async (req, res) => {
  try {
    const projects = await projectModel.getProjects();
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

app.get("/skills", async (req, res) => {
  try {
    const skills = await skillModel.getSkills();
    res.json({ skills });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});


// Set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});