// Setup empty JS object to act as endpoint for all routes
const port = 8080;
const projectData = [];

// Require Express to run server and routes
const express = require("express");
const bodyParser = require("body-parser");

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Initialize the main project folder
app.use(express.static("dist"));

// Setup Server
function listening() {
  console.log("server running");
  console.log(`running on localhost: ${port}`);
}
app.listen(port, listening);

//endpoints
app.get("/", function (_, res) {
  res.sendFile("dist/index.html");
});

app.get("/all", getAll);

function getAll(_, res) {
  res.send(projectData);
}

app.post("/add", addData);

function addData(req, res) {
  projectData.push(req.body.entry);
  res.send("POST received");
}

module.exports = listening;