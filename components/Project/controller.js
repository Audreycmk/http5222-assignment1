const projectModel = require("./model");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "dtxmgotbr",
  api_key: "611997419319178",
  api_secret: "Gr02Jbtx3euZ9249YwdA6pNfaIA"
});


// Get all projects from the database and render them
const getAllProjects = async (req, res) => {
  try {
    let projectList = await projectModel.getProjects();

    if (!projectList.length) {
      await projectModel.initializeProjects(); 
      projectList = await projectModel.getProjects();
    }

    // Transform media paths to full URLs if they exist
    const projectsWithMedia = projectList.map(project => ({
      ...project._doc,
      media: project.media ? `${req.protocol}://${req.get('host')}/${project.media}` : null
    }));

    res.json(projectsWithMedia);
  } catch (error) {
    console.error("Error fetching projects: ", error);
    res.status(500).json({ message: "Error retrieving projects" });
  }
};

// Get a single project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await projectModel.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    console.error("Error fetching project: ", error);
    res.status(500).json({ message: "Error retrieving project" });
  }
};

// Add a new project
const addProject = async (req, res) => {
  try {
    const { name, description, date, technologies, github, members, website } = req.body;

    // Handle media upload
    let media = null;
    let mediaType = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'portfolio'
      });
      media = result.secure_url;
      mediaType = req.file.mimetype.split('/')[0];
    }


    const newProject = await projectModel.addProject({
      name,
      description,
      date: date ? new Date(date) : new Date(),
      technologies: Array.isArray(technologies) ? technologies : technologies?.split(',').map(t => t.trim()),
      github,
      website,
      members: Array.isArray(members) ? members : members?.split(',').map(m => m.trim()),
      media,
      mediaType,
    });
    

    res.status(201).json(newProject);
  } catch (error) {
    console.error("Add project error:", error);
    res.status(500).json({ message: "Failed to add project", error: error.message });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Handle media upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'portfolio'
      });
      updateData.media = result.secure_url;
      updateData.mediaType = req.file.mimetype.split('/')[0];
    }
    

    // Handle arrays
    if (updateData.technologies && typeof updateData.technologies === 'string') {
      updateData.technologies = updateData.technologies.split(',').map(t => t.trim());
    }

    if (updateData.members && typeof updateData.members === 'string') {
      updateData.members = updateData.members.split(',').map(m => m.trim());
    }

    // Handle date
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const updatedProject = await projectModel.updateProject(id, updateData);
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Failed to update project", error: error.message });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.redirect('/?error=invalid_id');
    }

    console.log("Deleting project with ID:", id);
    const deletedProject = await projectModel.deleteProject(id);
    
    if (!deletedProject) {
      console.log("Project not found with ID:", id);
      return res.redirect('/?error=project_not_found');
    }
    
    console.log("Project deleted successfully:", deletedProject);
    
    // Always redirect to index page for form submissions
    return res.redirect('/');
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.redirect('/?error=delete_failed');
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject
};
