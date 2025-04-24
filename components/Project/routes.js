const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../../cloudinaryConfig");
const upload = multer({ storage });

const projectController = require("./controller");
const projectModel = require("./model");

// Render the add project form
router.get("/add", (req, res) => {
  res.render("addProject");
});

// Add a new project
router.post("/add", upload.single("media"), projectController.addProject);

// Update a project
router.put("/:id", upload.single("media"), projectController.updateProject);

// Delete a project
router.delete("/:id", projectController.deleteProject);

// Get all projects (JSON API)
router.get("/api/projects", projectController.getAllProjects);

// Render edit project form
router.get("/edit/:id", async (req, res) => {
  try {
    const project = await projectModel.getProjectById(req.params.id);
    res.render("editProject", { project });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
