const mongoose = require("mongoose");
const db = require("../../db"); // Shared DB functions

// Set up Schema and model
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },  // Use Date type with default value
  technologies: { type: [String], required: true },
  github: { type: String, required: true },
  website: { type: String },
  members: { type: [String], default: [] },  // Default to empty array if no members
  media: { type: String, default: null },  // Optional field for media
  mediaType: { type: String, default: null }  // Optional field for media type (image/video/etc.)
});

const Project = mongoose.model("project", projectSchema); // Link with collection "project"

// Connect to MongoDB
async function connect() {
  try {
    await db.connect(); 
    console.log("Database connected");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

// Get all projects from the projects collection
async function getProjects() {
  await connect();
  return await Project.find({}).sort({ date: -1 }); // Return all projects sorted by date
}

// Initialize projects collection with some initial data
async function initializeProjects() {
  await connect();
  const count = await Project.countDocuments();
  if (count === 0) {
    const projectList = [
      {
        name: "Grammy Awards Management System",
        description: "A web application to manage artists, songs, and award status for Grammy Awards.",
        date: new Date("2023-06-01"),  // Use actual Date object here
        technologies: ["React", "Node.js", "MongoDB"],
        github: "https://github.com/example/grammy-system",
        members: ["Audrey Chung", "Tashrif Radin"]
      },
      {
        name: "Colori",
        description: "A skin undertone quiz to discover your own color palettes with a matching outfit guide.",
        date: new Date("2024-03-01"),  // Use actual Date object here
        technologies: ["Vue.js", "Firebase"],
        github: "https://github.com/example/colori",
        members: ["Audrey Chung"]
      }
    ];    
    await Project.insertMany(projectList);
    console.log("Initial projects added");
  }
}

// Add a new project to the database (updated to handle all fields)
async function addProject(projectData) {
  await connect();
  const newProject = new Project({
    name: projectData.name,
    description: projectData.description,
    date: projectData.date || new Date(),  // Default to current date if not provided
    technologies: projectData.technologies || [],
    github: projectData.github || "#",
    members: projectData.members || [],
    media: projectData.media || null,
    mediaType: projectData.mediaType || null
  });
  const result = await newProject.save();
  return result;
}

async function updateProject(id, updateData) {
  await connect();
  console.log("Updating project ID:", id);
  console.log("With data:", updateData);
  
  try {
    const result = await Project.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true,        // Return the updated document
        runValidators: true // Run schema validations
      }
    );
    
    if (!result) {
      throw new Error("Project not found");
    }
    
    return result;
  } catch (error) {
    console.error("Model update error:", error);
    throw error; // Rethrow to be caught by controller
  }
}

async function getProjectById(id) {
  await connect();
  return await Project.findById(id);
}

// Delete a project by ID (more reliable than by name)
async function deleteProject(projectId) {
  await connect();
  const result = await Project.findByIdAndDelete(projectId);
  return result;
}

module.exports = {
  Project,
  getProjects,
  initializeProjects,
  addProject,
  updateProject,
  getProjectById,
  deleteProject
};