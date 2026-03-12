const {
  validateCollectionActionCreation,
  validateObjectId,
} = require("../validators/collection-action.validator");
const {
  createCollectionAction,
  listCollectionActionsByClient,
  listCollectionActionsByInvoice,
} = require("../services/collection-action.service");

function formatJoiError(error) {
  return error.details.map((detail) => detail.message);
}

async function create(req, res, next) {
  try {
    const { error, value } = validateCollectionActionCreation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: formatJoiError(error),
      });
    }

    const data = await createCollectionAction(value, req.user.sub);
    return res.status(201).json({
      success: true,
      message: "Collection action created successfully",
      data,
    });
  } catch (err) {
    return next(err);
  }
}

async function getHistoryByClient(req, res, next) {
  try {
    const { error } = validateObjectId(req.params.clientId);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid client id",
      });
    }

    const data = await listCollectionActionsByClient(req.params.clientId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return next(err);
  }
}

async function getHistoryByInvoice(req, res, next) {
  try {
    const { error } = validateObjectId(req.params.invoiceId);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice id",
      });
    }

    const data = await listCollectionActionsByInvoice(req.params.invoiceId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  getHistoryByClient,
  getHistoryByInvoice,
};
