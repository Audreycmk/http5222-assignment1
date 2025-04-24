// routes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../../cloudinaryConfig");
const upload = multer({ storage });
const projectModel = require("./model");
const projectController = require("./controller");

// Get all projects
router.get("/", projectController.getAllProjects);

// Render add project form
router.get("/add", (req, res) => {
  res.render("addProject");
});

// Add a new project
router.post("/", upload.single("media"), projectController.addProject);

// Delete a project (form submission) - must come before /:id routes
router.post("/:id/delete", projectController.deleteProject);

// Get single project
router.get("/:id", projectController.getProjectById);

// Update a project
router.put("/:id", upload.single("media"), projectController.updateProject);

// Delete a project (API endpoint)
router.delete("/:id", projectController.deleteProject);

// Render edit project form
router.get("/edit/:id", async (req, res) => {
  try {
    const project = await projectModel.getProjectById(req.params.id);
    if (!project) {
      // Project not found, redirect to home page with error message
      return res.redirect('/?error=project_not_found');
    }
    res.render("editProject", { project });
  } catch (error) {
    console.error("Error fetching project for edit:", error);
    res.status(500).redirect('/?error=server_error');
  }
});

module.exports = router;