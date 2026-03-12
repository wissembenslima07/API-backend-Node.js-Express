const { Router } = require("express");
const { getHealth } = require("../controllers/health.controller");
const authRouter = require("./auth.routes");
const clientRouter = require("./client.routes");
const invoiceRouter = require("./invoice.routes");
const paymentRouter = require("./payment.routes");
const collectionActionRouter = require("./collection-action.routes");
const statsRouter = require("./stats.routes");

const router = Router();

router.get("/health", getHealth);
router.use("/auth", authRouter);
router.use("/clients", clientRouter);
router.use("/invoices", invoiceRouter);
router.use("/payments", paymentRouter);
router.use("/collection-actions", collectionActionRouter);
router.use("/stats", statsRouter);

module.exports = router;
