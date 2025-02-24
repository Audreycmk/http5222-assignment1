const express = require("express");
const path = require("path");
const sessions = require("express-session");
const dotenv = require("dotenv");
const db = require("./db"); // Import DB connection functions
const projectModel = require("./components/Project/model");
const skillModel = require("./components/Skill/model");

// Load the environment variables from .env
dotenv.config();

// Set up the Express app
const app = express();
const port = process.env.PORT || 8080;

// Set up application template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up folder for static files
app.use(express.static(path.join(__dirname, "public")));

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

// Centralized error handler function
const handleError = (res, error, message = "Server error") => {
  console.error(error);
  res.status(500).send(message);
};

// Route to render the index page with projects and skills
app.get("/", async (req, res) => {
  try {
    const projects = await projectModel.getProjects();
    const skills = await skillModel.getSkills();
    res.render("index", { projects, skills });
  } catch (error) {
    handleError(res, error);
  }
});

// Route to render the Add Project page
app.get("/add-project", (req, res) => {
  res.render("addProject");
});

// Route to handle Add Project form submission
app.post("/add-project", async (req, res) => {
  try {
    const { name, description } = req.body;

    // Simple validation for form inputs
    if (!name || !description) {
      return res.status(400).send("Name and description are required");
    }

    await projectModel.addProject(name, description);
    res.redirect("/"); // Redirect to the homepage to see the new project
  } catch (error) {
    handleError(res, error, "Error adding project");
  }
});

// Route to render the Add Skill page
app.get("/add-skill", (req, res) => {
  res.render("addSkill");
});

// Route to handle Add Skill form submission
app.post("/add-skill", async (req, res) => {
  try {
    const { name, level } = req.body;

    // Simple validation for form inputs
    if (!name || !level) {
      return res.status(400).send("Name and level are required");
    }

    await skillModel.addSkill(name, level);
    res.redirect("/"); // Redirect to the homepage to see the new skill
  } catch (error) {
    handleError(res, error, "Error adding skill");
  }
});

// Route to handle deleting a project
app.post("/delete-project", async (req, res) => {
  try {
    const { name } = req.body;
    await projectModel.deleteProject(name);
    res.redirect("/"); // Redirect to the homepage after deletion
  } catch (error) {
    handleError(res, error, "Error deleting project");
  }
});

// Route to handle deleting a skill by name
app.post("/delete-skill", async (req, res) => {
  try {
    const { name } = req.body;
    const result = await skillModel.deleteSkill(name);
    res.redirect("/"); // Redirect to the homepage after deletion
  } catch (error) {
    handleError(res, error, "Error deleting skill");
  }
});

// Example of additional routes (for your other components)
app.use("/", require("./components/Project/routes"));
app.use("/skills", require("./components/Skill/routes"));

// Set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
