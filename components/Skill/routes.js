const express = require("express");
const router = express.Router();
const skillModel = require("./model"); // Adjust path if necessary

// Route to render the add skill form
router.get("/add-skill", (req, res) => {
  res.render("addSkill", { error: null }); 
});

// Route to handle POST request for adding a skill
router.post("/add-skill", async (req, res) => {
  try {
    const { name, level } = req.body;
    
    // Validate inputs
    if (!name || !description || typeof name !== 'string' || typeof description !== 'string') {
      return res.status(400).send("Skill name and Skill level are required");
    }

    // Add skill to the database using the model
    await skillModel.addSkill(name, level);
    res.redirect("/"); // Redirect to homepage after successful addition
  } catch (error) {
    console.error("Error adding skill:", error);
    res.status(500).send("Server error");
  }
});

// Route to handle deleting a skill by name
router.post("/delete-skill", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send("Skill name is required");
    }

    console.log("Deleting skill:", name);  // Debugging line to check skill name
    const result = await skillModel.deleteSkill(name);  // Call the model function to delete the skill
    console.log("Deleted skill result:", result);  // Log the result of the deletion

    res.redirect("/");  // Redirect to the homepage after deletion
  } catch (error) {
    console.error("Error deleting skill:", error);
    res.status(500).send("Server error");
  }
});
  
module.exports = router;
