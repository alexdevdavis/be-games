const { fetchEndpoints } = require("../models/endpoints.model");

exports.getEndpoints = (req, res, next) => {
  fetchEndpoints()
    .then((unparsedEndpoints) => {
      const endpoints = JSON.parse(unparsedEndpoints);
      res.status(200).send({ endpoints });
    })
    .catch((err) => {
      console.log(err);
    });
};
