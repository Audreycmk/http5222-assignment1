const express = require("express");
const router = express.Router();
const projectModel = require("./model"); // Adjust path if necessary

// Route to render the add project form
router.get("/add-project", (req, res) => {
  res.render("addProject"); 
});

// Route to handle POST request for adding a project
router.post("/add-project", async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Validate inputs (ensure non-empty strings)
    if (!name || !description || typeof name !== 'string' || typeof description !== 'string') {
      return res.status(400).send("Project name and description are required");
    }

    // Add project to the database using the model
    await projectModel.addProject(name, description);
    res.redirect("/"); // Redirect to homepage after successful addition
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).send("Server error");
  }
});

// Route to handle deleting a project
router.post("/delete-project", async (req, res) => {
  try {
    const { name } = req.body;  // Getting the project name to delete
    if (!name) {
      return res.status(400).send("Project name is required");
    }
    console.log("Deleting project:", name);  // Debugging line to check project name
    await projectModel.deleteProject(name);  // Call the model function to delete the project
    res.redirect("/");  // Redirect to the homepage after deletion
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
