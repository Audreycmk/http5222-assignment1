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
const port = process.env.PORT || "8080";

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
    cookie: {}
  })
);

// Route to render the index page with projects and skills
app.get("/", async (req, res) => {
  try {
    // Fetch projects and skills from the database
    const projects = await projectModel.getProjects();
    const skills = await skillModel.getSkills(); // Ensure this returns an array

    // Log the skills data to check if it is correctly fetched
    console.log("Skills Data:", skills);

    // Render the index.pug page with the projects and skills data
    res.render("index", { projects, skills });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Server error");
  }
});

// Example of additional routes (for your other components)
app.use("/", require("./components/Project/routes"));
app.use("/skill", require("./components/Skill/routes"));

// Set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
