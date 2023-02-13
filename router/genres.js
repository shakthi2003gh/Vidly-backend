const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjecId = require("../middleware/validateObjecId");
const { Genre, validate } = require("../models/genre");

const router = express.Router();

router.get("/", async (_, res) => {
  const genres = await Genre.find().sort("name");

  res.send(genres);
});

router.get("/:id", validateObjecId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send("Genre not found");
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { value, error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
    name: value.name,
  });

  genre = await genre.save();
  res.send(genre);
});

router.put("/:id", validateObjecId, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre)
    return res
      .status(404)
      .send("The genre with id " + req.params.id + " does not exist");

  res.send(genre);
});

router.delete("/:id", [auth, admin, validateObjecId], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre)
    return res
      .status(404)
      .send("The genre with id " + req.params.id + " does not exist");

  res.send(genre);
});

module.exports = router;
