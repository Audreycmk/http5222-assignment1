const skillModel = require("./model");

const getAllSkills = async (request, response) => {
  try {
    let skillList = await skillModel.getSkills();

    if (!skillList.length) {
      await skillModel.initializeSkills();
      skillList = await skillModel.getSkills();
    }

    // Render skills to the index page
    response.render("index", { skills: skillList });
  } catch (error) {
    console.error("Error fetching skills: ", error);
    response.status(500).send("Error retrieving skills");
  }
};

const deleteSkill = async (request, response) => {
  try {
    const { name } = request.body;
    await skillModel.deleteSkill(name);
    response.redirect("/");
  } catch (error) {
    console.error("Error deleting skill:", error);
    response.status(500).send("Server error");
  }
};

module.exports = {
  getAllSkills,
  deleteSkill 
};
