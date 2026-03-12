const {
  getOverviewStats,
  getInvoiceStats,
  getAgentStats,
} = require("../services/stats.service");

async function overview(_req, res, next) {
  try {
    const data = await getOverviewStats();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return next(err);
  }
}

async function invoices(_req, res, next) {
  try {
    const data = await getInvoiceStats();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return next(err);
  }
}

async function agents(_req, res, next) {
  try {
    const data = await getAgentStats();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  overview,
  invoices,
  agents,
};
