const apiRouter = require("express").Router();
const { getEndpoints } = require("../controllers/endpoints.controller");
const categoriesRouter = require("./categories-router");
const reviewsRouter = require("./reviews-router");
const usersRouter = require("./users-router");

apiRouter.get("/", getEndpoints);

apiRouter.use("/categories", categoriesRouter);

apiRouter.use("/reviews", reviewsRouter);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
