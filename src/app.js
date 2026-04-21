const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { setupSwagger } = require("./config/swagger");
const { passport } = require("./config/passport");
const { notFoundHandler, errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(
	cors({
		origin: "http://localhost:4200",
		credentials: true,
	})
);
app.use(express.json());
app.use(passport.initialize());
setupSwagger(app);
app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
