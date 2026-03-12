const express = require("express");
const routes = require("./routes");
const { setupSwagger } = require("./config/swagger");
const { notFoundHandler, errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());
setupSwagger(app);
app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
