require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const error = require("./middleware/error");
const home = require("./router/home");
const movies = require("./router/movies");
const genres = require("./router/genres");
const customers = require("./router/customers");
const rentals = require("./router/rentals");
const users = require("./router/users");
const auth = require("./router/auth");

const app = express();

process.on("uncaughtException", console.log);
process.on("unhandledRejection", console.log);

if (!process.env.JWT_KEY) {
  console.error("FATAL ERROR: JWT_KEY is not defined.");
  process.exit(1);
}

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.db)
  .then(() => {
    module.exports = app.listen(port);
    console.log(`Listening on port ${port}...`);
  })
  .catch((e) => console.error(`Could not connect to ${process.env.db}...`, e));

app.use(cors());
app.use(bodyParser.json());
app.use("/", home);
app.use("/api/movies", movies);
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);

const port = process.env.PORT;
