const { Invoice } = require("../models/invoice.model");
const { Client } = require("../models/client.model");
const { CollectionAction } = require("../models/collection-action.model");

function round2(v) {
  return Math.round((v + Number.EPSILON) * 100) / 100;
}

async function getOverviewStats() {
  const [totalClients, totalInvoices, grouped] = await Promise.all([
    Client.countDocuments(),
    Invoice.countDocuments(),
    Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amountTotal" },
          totalPaid: { $sum: "$amountPaid" },
          totalUnpaid: { $sum: { $subtract: ["$amountTotal", "$amountPaid"] } },
        },
      },
    ]),
  ]);

  const totalAmount = grouped[0]?.totalAmount || 0;
  const montantRecouvre = grouped[0]?.totalPaid || 0;
  const totalImpaye = grouped[0]?.totalUnpaid || 0;
  const tauxRecouvrement = totalAmount > 0 ? round2((montantRecouvre / totalAmount) * 100) : 0;

  return {
    totalClients,
    totalInvoices,
    totalFacture: round2(totalAmount),
    totalImpaye: round2(totalImpaye),
    montantRecouvre: round2(montantRecouvre),
    tauxRecouvrement,
  };
}

async function getInvoiceStats() {
  const now = new Date();

  const [statusBreakdownRaw, overdueRaw, topLateClientsRaw] = await Promise.all([
    Invoice.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amountTotal" },
          totalPaid: { $sum: "$amountPaid" },
          totalRemaining: { $sum: { $subtract: ["$amountTotal", "$amountPaid"] } },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Invoice.find({ dueDate: { $lt: now }, status: { $ne: "paid" } })
      .populate("client", "companyName")
      .sort({ dueDate: 1 }),
    Invoice.aggregate([
      { $match: { dueDate: { $lt: now }, status: { $ne: "paid" } } },
      {
        $group: {
          _id: "$client",
          invoiceCount: { $sum: 1 },
          totalRemaining: { $sum: { $subtract: ["$amountTotal", "$amountPaid"] } },
        },
      },
      { $sort: { totalRemaining: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "clients",
          localField: "_id",
          foreignField: "_id",
          as: "client",
        },
      },
      {
        $project: {
          _id: 0,
          clientId: "$_id",
          invoiceCount: 1,
          totalRemaining: 1,
          clientName: { $ifNull: [{ $arrayElemAt: ["$client.companyName", 0] }, "Unknown"] },
        },
      },
    ]),
  ]);

  return {
    statusBreakdown: statusBreakdownRaw.map((s) => ({
      status: s._id,
      count: s.count,
      totalAmount: round2(s.totalAmount || 0),
      totalPaid: round2(s.totalPaid || 0),
      totalRemaining: round2(s.totalRemaining || 0),
    })),
    overdueCount: overdueRaw.length,
    overdueInvoices: overdueRaw.map((i) => ({
      id: i._id.toString(),
      invoiceNumber: i.invoiceNumber,
      client: i.client ? { id: i.client._id.toString(), companyName: i.client.companyName } : null,
      dueDate: i.dueDate,
      status: i.status,
      remainingAmount: round2((i.amountTotal || 0) - (i.amountPaid || 0)),
    })),
    topLateClients: topLateClientsRaw.map((c) => ({
      clientId: c.clientId.toString(),
      clientName: c.clientName,
      invoiceCount: c.invoiceCount,
      totalRemaining: round2(c.totalRemaining || 0),
    })),
  };
}

async function getAgentStats() {
  const aggregated = await CollectionAction.aggregate([
    { $group: { _id: { agent: "$agent", type: "$type" }, count: { $sum: 1 } } },
    {
      $group: {
        _id: "$_id.agent",
        totalActions: { $sum: "$count" },
        byType: { $push: { type: "$_id.type", count: "$count" } },
      },
    },
    { $sort: { totalActions: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "agent",
      },
    },
    {
      $project: {
        _id: 0,
        agentId: "$_id",
        totalActions: 1,
        byType: 1,
        fullName: { $ifNull: [{ $arrayElemAt: ["$agent.fullName", 0] }, "Unknown"] },
        email: { $ifNull: [{ $arrayElemAt: ["$agent.email", 0] }, ""] },
      },
    },
  ]);

  return aggregated.map((a) => ({
    agentId: a.agentId.toString(),
    fullName: a.fullName,
    email: a.email,
    totalActions: a.totalActions,
    byType: a.byType,
  }));
}

module.exports = {
  getOverviewStats,
  getInvoiceStats,
  getAgentStats,
};
