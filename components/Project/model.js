const mongoose = require("mongoose");
const db = require("../../db"); // Shared DB functions

// Set up Schema and model
const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  technologies: Array
});
const Project = mongoose.model("project", projectSchema); // Link with collection "project"


// Connect to MongoDB
async function connect() {
  await db.connect();
}

// Get all projects from the projects collection
async function getProjects() {
  await connect();
  return await Project.find({}); // Return all projects
}

// Initialize projects collection with some initial data
async function initializeProjects() {
  const projectList = [
    {
      name: "Grammy Awards Management System",
      description: "A web application to manage artists, songs, and award status for Grammy Awards."
    },
    {
      name: "Colori",
      description: "A skin undertone quiz to discover your own color palettes with a matching outfit guide."
    }
  ];    
  await Project.insertMany(projectList);
}

// Add a new project to the database
async function addProject(name, description) {
  await connect();

  let newProject = new Project({ name, description });
  let result = await newProject.save(); // Save to the DB collection
  console.log(result);
}

// Update an existing project's description
async function updateProject(name, newDescription) {
  await connect();

  let result = await Project.updateOne(
    { name: name },
    { description: newDescription }
  ); 
}

// Delete a project by name
async function deleteProject(projectName) {
  await connect();
  let result = await Project.deleteOne({ name: projectName });
}

module.exports = {
  getProjects,
  initializeProjects,
  addProject,
  updateProject,
  deleteProject
};
