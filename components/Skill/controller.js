const skillModel = require("./model");

const getAllSkills = async (request, response) => {
  let skillList = await skillModel.getSkills();
  if (!skillList.length) {
    await skillModel.initializeSkills();
    skillList = await skillModel.getSkills();
  }
  response.render("index", { skills: skillList });
};

module.exports = {
  getAllSkills
};
