const fs = require("fs/promises");
const path = require("path");

exports.getEndpoints = (req, res, next) => {
  return fs
    .readFile(path.resolve(__dirname, "../endpoints.json"))
    .then((unparsedEndpoints) => {
      const endpoints = JSON.parse(unparsedEndpoints);
      res.status(200).send({ endpoints });
    })
    .catch((err) => {
      console.log(err);
    });
};
