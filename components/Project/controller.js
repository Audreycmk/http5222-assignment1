const projectModel = require("./model");

// Get all projects from the database and render them
const getAllProjects = async (req, res) => {
  try {
    let projectList = await projectModel.getProjects();

    if (!projectList.length) {
      await projectModel.initializeProjects(); 
      projectList = await projectModel.getProjects();
    }

    res.json(projectList); // returning as JSON
  } catch (error) {
    console.error("Error fetching projects: ", error);
    res.status(500).json({ message: "Error retrieving projects" });
  }
};

// Add a new project
const addProject = async (req, res) => {
  try {
    const { name, description, date, technologies, github, members, website } = req.body;

    const media = req.file?.path || null;
    const mediaType = req.file?.mimetype?.split('/')[0] || null;

    const newProject = await projectModel.addProject({
      name,
      description,
      date,
      technologies: Array.isArray(technologies) ? technologies : technologies?.split(','),
      github,
      members: Array.isArray(members) ? members : members?.split(','),
      website,
      media,
      mediaType,
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error("Add project error:", error);
    res.status(500).json({ message: "Failed to add project", error });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.file) {
      updateData.media = req.file.path;
      updateData.mediaType = req.file.mimetype.split('/')[0];
    }

    if (updateData.technologies && typeof updateData.technologies === 'string') {
      updateData.technologies = updateData.technologies.split(',').map(t => t.trim());
    }

    if (updateData.members && typeof updateData.members === 'string') {
      updateData.members = updateData.members.split(',').map(m => m.trim());
    }

    const updatedProject = await projectModel.updateProject(id, updateData);
    res.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("Project ID is required");
    }

    await projectModel.deleteProject(id);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getAllProjects,
  addProject,
  updateProject,
  deleteProject
};
