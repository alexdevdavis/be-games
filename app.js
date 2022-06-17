const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// require API router
const apiRouter = require("./routes/api-router");

// use api router for all endpoints beginning with '/api'
app.use("/api", apiRouter);

//ERRORS
app.use("/*", (req, res, next) => {
  res.status(404).send("path not found");
});

app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(err.status).send(err.message);
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status === 400) {
    res.status(err.status).send(err.message);
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
