const projectModel = require("./model");

const getAllProjects = async (request, response) => {
  let projectList = await projectModel.getProjects();
  if (!projectList.length) {
    await projectModel.initializeProjects(); 
    projectList = await projectModel.getProjects();
  }
  response.render("index", { projects: projectList });
};

module.exports = {
  getAllProjects
};
