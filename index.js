require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const home = require("./router/home");
const movies = require("./router/movies");
const genres = require("./router/genres");
const customers = require("./router/customers");
const rentals = require("./router/rentals");

const app = express();

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connecting to MongoDB..."))
  .catch(() => console.error("Could not connect to MongoDB..."));

app.use(bodyParser.json());
app.use("/api", home);
app.use("/api/movies", movies);
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);

const port = process.env.PORT;

app.listen(port);
console.log(`Listening on port ${port}...`);
