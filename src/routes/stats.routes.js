const { Router } = require("express");
const { auth, authorize } = require("../middlewares/auth.middleware");
const { overview, invoices, agents } = require("../controllers/stats.controller");

const statsRouter = Router();

statsRouter.get("/overview", auth, authorize(["manager", "admin"]), overview);
statsRouter.get("/invoices", auth, authorize(["manager", "admin"]), invoices);
statsRouter.get("/agents", auth, authorize(["manager", "admin"]), agents);

module.exports = statsRouter;
