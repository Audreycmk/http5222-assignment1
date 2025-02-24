const mongoose = require("mongoose");
const db = require("../../db"); // Shared DB functions

// Set up Schema and model
const skillSchema = new mongoose.Schema({
  name: String,
  level: String 
});
const Skill = mongoose.model("skill", skillSchema); // Link with collection "skill"

// MongoDB Functions

// Connect to MongoDB (with improved connection handling)
let isConnected = false;

async function connect() {
  if (isConnected) return;
  await db.connect();
  isConnected = true;
}

// Get all skills from the skills collection
async function getSkills() {
  try {
    await connect();
    return await Skill.find({}); // Return all skills
  } catch (error) {
    console.error("Error fetching skills: ", error);
    throw error;
  }
}

// Initialize skills collection with some initial data
async function initializeSkills() {
  const skillList = [
    { name: "SQL", level: "Intermediate" },
    { name: "JavaScript", level: "Intermediate" },
    { name: "MongoDB", level: "Beginner" },
    { name: "HTML", level: "Beginner" },
    { name: "Demo", level: "Advanced" }
  ];    

  try {
    await connect();
    await Skill.insertMany(skillList);
  } catch (error) {
    console.error("Error initializing skills: ", error);
    throw error;
  }
}

// Add a new skill to the database
async function addSkill(name, level) {
  try {
    await connect();

    let newSkill = new Skill({ name, level });
    let result = await newSkill.save();
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error adding skill: ", error);
    throw error;
  }
}

// Update an existing skill's level
async function updateSkill(name, newLevel) {
  try {
    await connect();

    let result = await Skill.updateOne(
      { name: name },
      { level: newLevel }
    ); 
    return result;
  } catch (error) {
    console.error("Error updating skill: ", error);
    throw error;
  }
}

// Delete skills by name
async function deleteSkill(skillName) {
  try {
    await connect();
    let result = await Skill.deleteOne({ name: skillName });

    return result;
  } catch (error) {
    console.error("Error deleting skill: ", error);
    throw error;
  }
}

module.exports = {
  getSkills,
  initializeSkills,
  addSkill,
  updateSkill,
  deleteSkill
};
