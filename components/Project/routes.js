const express = require("express"); 
const router = express.Router();

const { getAllProjects } = require("./controller");

router.get("/", getAllProjects);

module.exports = router;
