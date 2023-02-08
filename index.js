require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const home = require("./router/home");
const genres = require("./router/genres");

const app = express();

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connecting to MongoDB..."))
  .catch(() => console.error("Could not connect to MongoDB..."));

app.use(bodyParser.json());
app.use("/api", home);
app.use("/api/genres", genres);

const port = process.env.PORT;

app.listen(port);
console.log(`Listening on port ${port}...`);
