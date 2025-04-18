const projectModel = require("./model");
const path = require('path');

// Get all projects from the database and render them
const getAllProjects = async (request, response) => {
  try {
    let projectList = await projectModel.getProjects();

    if (!projectList.length) {
      await projectModel.initializeProjects(); 
      projectList = await projectModel.getProjects();
    }

    // Render projects to the index page
    response.render("index", { projects: projectList });
  } catch (error) {
    console.error("Error fetching projects: ", error);
    response.status(500).send("Error retrieving projects");
  }
};

// Add a new project to the database
const addProject = async (request, response) => {
  try {
    const { name, description, date, technologies, github, members } = request.body;
    const mediaFile = request.file;

    // Validate required input
    if (!name || !description) {
      return response.status(400).send("Name and description are required");
    }

    // Prepare project data
    const projectData = {
      name,
      description,
      date: date || "June 2025",
      technologies: technologies ? technologies.split(',').map(t => t.trim()) : [],
      github: github || "#",
      members: members ? members.split(',').map(m => m.trim()) : [],
    };

    // Handle file upload if present
    if (mediaFile) {
      projectData.media = `/uploads/${mediaFile.filename}`;
      projectData.mediaType = mediaFile.mimetype.split('/')[0]; // 'image' or 'video'
    }

    // Call the model to add the project
    await projectModel.addProject(projectData);
    response.redirect("/");  // Redirect to homepage after adding project
  } catch (error) {
    console.error("Error adding project:", error);
    response.status(500).send("Server error: " + error.message);
  }
};

const updateProject = async (req, res) => {  // Make sure to include both req and res
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Handle file upload if present
    if (req.file) {
      updateData.media = `/uploads/${req.file.filename}`;
      updateData.mediaType = req.file.mimetype.split('/')[0];
    }

    // Convert comma-separated strings to arrays if needed
    if (updateData.technologies && typeof updateData.technologies === 'string') {
      updateData.technologies = updateData.technologies.split(',').map(t => t.trim());
    }
    
    if (updateData.members && typeof updateData.members === 'string') {
      updateData.members = updateData.members.split(',').map(m => m.trim());
    }

    const updatedProject = await projectModel.updateProject(id, updateData);
    
    // Make sure to use res.json() instead of returning
    res.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a project by name
const deleteProject = async (request, response) => {
  try {
    const { id } = request.params;  // Get ID from URL params
    if (!id) {
      return response.status(400).send("Project ID is required");
    }
    
    await projectModel.deleteProject(id);
    response.redirect("/");
  } catch (error) {
    console.error("Error deleting project:", error);
    response.status(500).send("Server error: " + error.message);
  }
};


module.exports = {
  getAllProjects,
  addProject,
  updateProject,
  deleteProject
};