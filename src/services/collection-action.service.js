const { CollectionAction } = require("../models/collection-action.model");
const { Client } = require("../models/client.model");
const { Invoice } = require("../models/invoice.model");
const { User } = require("../models/user.model");

function sanitizeCollectionAction(actionDoc) {
  return {
    id: actionDoc._id.toString(),
    client: actionDoc.client && typeof actionDoc.client === "object"
      ? { id: actionDoc.client._id.toString(), companyName: actionDoc.client.companyName }
      : actionDoc.client.toString(),
    invoice: actionDoc.invoice
      ? typeof actionDoc.invoice === "object"
        ? { id: actionDoc.invoice._id.toString(), invoiceNumber: actionDoc.invoice.invoiceNumber }
        : actionDoc.invoice.toString()
      : null,
    agent: actionDoc.agent && typeof actionDoc.agent === "object"
      ? { id: actionDoc.agent._id.toString(), fullName: actionDoc.agent.fullName, email: actionDoc.agent.email }
      : actionDoc.agent.toString(),
    type: actionDoc.type,
    actionDate: actionDoc.actionDate,
    result: actionDoc.result,
    comment: actionDoc.comment,
    createdAt: actionDoc.createdAt,
    updatedAt: actionDoc.updatedAt,
  };
}

async function createCollectionAction(payload, agentId) {
  const [client, agent] = await Promise.all([
    Client.findById(payload.client),
    User.findById(agentId),
  ]);

  if (!client) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
  }

  if (!agent) {
    const error = new Error("Agent not found");
    error.statusCode = 404;
    throw error;
  }

  if (payload.invoice) {
    const invoice = await Invoice.findById(payload.invoice);
    if (!invoice) {
      const error = new Error("Invoice not found");
      error.statusCode = 404;
      throw error;
    }

    if (invoice.client.toString() !== payload.client.toString()) {
      const error = new Error("Invoice does not belong to client");
      error.statusCode = 400;
      throw error;
    }
  }

  const action = await CollectionAction.create({
    client: payload.client,
    invoice: payload.invoice,
    agent: agentId,
    type: payload.type,
    actionDate: payload.actionDate || new Date(),
    result: payload.result || "",
    comment: payload.comment || "",
  });

  const populated = await action.populate([
    { path: "client", select: "companyName" },
    { path: "invoice", select: "invoiceNumber" },
    { path: "agent", select: "fullName email" },
  ]);

  return sanitizeCollectionAction(populated);
}

async function listCollectionActionsByClient(clientId) {
  const actions = await CollectionAction.find({ client: clientId })
    .populate("client", "companyName")
    .populate("invoice", "invoiceNumber")
    .populate("agent", "fullName email")
    .sort({ actionDate: -1, createdAt: -1 });

  return actions.map(sanitizeCollectionAction);
}

async function listCollectionActionsByInvoice(invoiceId) {
  const actions = await CollectionAction.find({ invoice: invoiceId })
    .populate("client", "companyName")
    .populate("invoice", "invoiceNumber")
    .populate("agent", "fullName email")
    .sort({ actionDate: -1, createdAt: -1 });

  return actions.map(sanitizeCollectionAction);
}

module.exports = {
  createCollectionAction,
  listCollectionActionsByClient,
  listCollectionActionsByInvoice,
};
