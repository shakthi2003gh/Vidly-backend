module.exports = function (err, req, res, next) {
  res.status(500).send("Error:", err);
  console.log(err);
};
