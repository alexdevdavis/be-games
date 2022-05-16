const express = require("express");
const { getCategories } = require("./controllers/games.controller.js");

const app = express();

app.get("/api/categories", getCategories);

app.use((err, req, res, next) => {
  if (err.status === 404) {
  res.status(err.status).send(err.message);
  } else {
    next(err);
  }
})

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
