const express = require("express");
const router = express.Router();
const projectController = require("./controller");
const multer = require('multer');
const path = require('path');
const projectModel = require("./model");

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
});

// Route to render the add project form
router.get("/add", (req, res) => {
  res.render("addProject");
});

// Route to handle POST request for adding a project
router.post("/add", upload.single('media'), projectController.addProject);

// Route to handle deleting a project
router.delete("/:id", projectController.deleteProject);

// API endpoint to get all projects as JSON
router.get("/api/projects", async (req, res) => {
  try {
    const projects = await projectController.getAllProjects();
    res.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to update a project
router.put("/:id", upload.single('media'), async (req, res) => {
  try {
    console.log("Update request received for ID:", req.params.id);
    console.log("Request body:", req.body);
    if (req.file) {
      console.log("File uploaded:", req.file);
    }

    const { id } = req.params;
    const updateData = req.body;
    
    if (req.file) {
      updateData.media = `/uploads/${req.file.filename}`;
      updateData.mediaType = req.file.mimetype.split('/')[0];
    }

    console.log("Update data prepared:", updateData);
    
    const updatedProject = await projectController.updateProject(id, updateData);
    
    console.log("Update successful:", updatedProject);
    res.json(updatedProject);
  } catch (error) {
    console.error("Detailed update error:", error);
    res.status(500).json({ 
      error: "Server error",
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Route to render edit project form
router.get("/edit/:id", async (req, res) => {
  try {
    const project = await projectModel.getProjectById(req.params.id);
    res.render("editProject", { project });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;