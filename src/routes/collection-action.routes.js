const { Router } = require("express");
const { auth, authorize } = require("../middlewares/auth.middleware");
const {
  create,
  getHistoryByClient,
  getHistoryByInvoice,
} = require("../controllers/collection-action.controller");

const collectionActionRouter = Router();

collectionActionRouter.post("/", auth, authorize(["agent", "manager", "admin"]), create);
collectionActionRouter.get("/client/:clientId", auth, getHistoryByClient);
collectionActionRouter.get("/invoice/:invoiceId", auth, getHistoryByInvoice);

module.exports = collectionActionRouter;
