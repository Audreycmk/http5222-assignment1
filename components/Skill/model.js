const mongoose = require("mongoose");
const db = require("../../db"); // Shared DB functions

// Set up Schema and model
const skillSchema = new mongoose.Schema({
  name: String,
  level: String 
});
const Skill = mongoose.model("skill", skillSchema); // Link with collection "skill"

// MongoDB Functions

// Connect to MongoDB
async function connect() {
  await db.connect();
}

// Get all skills from the skills collection
async function getSkills() {
  await connect();
  return await Skill.find({}); // Return all skills
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
  await Skill.insertMany(skillList);
}

// Add a new skill to the database
async function addSkill(name, level) {
  await connect();

  let newSkill = new Skill({ name, level });
  let result = await newSkill.save(); // Save to the DB collection
  console.log(result);
}

// Update an existing skill's level
async function updateSkill(name, newLevel) {
  await connect();

  let result = await Skill.updateOne(
    { name: name },
    { level: newLevel }
  ); 
}

// Delete skills by level
async function deleteSkill(skillLevel) {
  await connect();
  let result = await Skill.deleteMany({ level: skillLevel });

  return result;
}

module.exports = {
  getSkills,
  initializeSkills,
  addSkill,
  updateSkill,
  deleteSkill
};
