const projectModel = require("./model");

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
    const { name, description } = request.body;

    // Validate input
    if (!name || !description) {
      return response.status(400).send("Name and description are required");
    }

    // Call the model to add the project
    await projectModel.addProject(name, description);
    response.redirect("/");  // Redirect to homepage after adding project
  } catch (error) {
    console.error("Error adding project:", error);
    response.status(500).send("Server error");
  }
};

// Delete a project by name
const deleteProject = async (request, response) => {
  try {
    const { name } = request.body;
    await projectModel.deleteProject(name);
    response.redirect("/");  // Redirect to homepage after deleting project
  } catch (error) {
    console.error("Error deleting project:", error);
    response.status(500).send("Server error");
  }
};

module.exports = {
  getAllProjects,
  addProject,
  deleteProject
};
