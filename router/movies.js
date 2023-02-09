const express = require("express");
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");

const router = express.Router();

router.get("/", async (_, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send("Movie not found");
  res.send(movie);
});

router.post("/", async (req, res) => {
  const { error, value } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) res.status(400).send("Invalid genre");

  let movie = new Movie({
    title: value.title,
    genre: {
      _id: genre.id,
      name: genre.name,
    },
    numberInStock: value.numberInStock,
    dailyRentalRate: value.dailyRentalRate,
  });

  movie = await movie.save();
  res.send(movie);
});

router.put("/:id", async (req, res) => {
  const { error, value } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) res.status(400).send("Invalid genre");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: value.title,
      genre: {
        _id: genre.id,
        name: genre.name,
      },
      numberInStock: value.numberInStock,
      dailyRentalRate: value.dailyRentalRate,
    },
    {
      new: true,
    }
  );

  if (!movie)
    return res
      .status(404)
      .send("Movie with id " + req.params.id + " does not exist");

  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie)
    return res
      .status(404)
      .send("Movie with id " + req.params.id + " does not exist");

  res.send(movie);
});

module.exports = router;
