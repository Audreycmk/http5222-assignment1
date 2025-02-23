const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

// Debugging: Log environment variables
console.log("DBHOST:", process.env.DBHOST);
console.log("DBUSER:", process.env.DBUSER);
console.log("DBPWD:", process.env.DBPWD);
console.log("DBNAME:", process.env.DBNAME);

// Correct MongoDB connection string
const dbUrl = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPWD}@${process.env.DBHOST}/${process.env.DBNAME}?retryWrites=true&w=majority&appName=Cluster52606`;

async function connect() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = { connect };
