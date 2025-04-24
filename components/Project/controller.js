const projectModel = require("./model");
const { cloudinary } = require("../../cloudinaryConfig");


// Get all projects from the database and render them
const getAllProjects = async (req, res) => {
  try {
    let projectList = await projectModel.getProjects();

    if (!projectList.length) {
      await projectModel.initializeProjects(); 
      projectList = await projectModel.getProjects();
    }

    // Map over the project list to extract the actual data and ensure media is in the expected format
    const projectsWithMedia = projectList.map(project => ({
      _id: project._id, // Ensure _id is included if needed for React key
      name: project.name,
      description: project.description,
      date: project.date,
      technologies: project.technologies,
      github: project.github,
      website: project.website,
      media: project.media || null // Ensure media field is present, fallback to null if missing
    }));
    
    // Send the response as a plain array of projects
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
