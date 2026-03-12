jest.mock("../src/models/client.model", () => ({
  Client: {
    findById: jest.fn(),
  },
}));

jest.mock("../src/models/invoice.model", () => ({
  Invoice: {
    create: jest.fn(),
  },
}));

const { Client } = require("../src/models/client.model");
const { Invoice } = require("../src/models/invoice.model");
const { createInvoice } = require("../src/services/invoice.service");

describe("invoice.service - createInvoice", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create invoice with partial status when amountPaid < amountTotal", async () => {
    Client.findById.mockResolvedValue({ _id: "client-1" });

    const populatedInvoice = {
      _id: { toString: () => "invoice-1" },
      client: { _id: { toString: () => "client-1" }, companyName: "Acme" },
      invoiceNumber: "INV-001",
      amountTotal: 1000,
      amountPaid: 200,
      dueDate: new Date("2026-12-01T00:00:00.000Z"),
      status: "partial",
      notes: "",
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    Invoice.create.mockResolvedValue({
      populate: jest.fn().mockResolvedValue(populatedInvoice),
    });

    const result = await createInvoice({
      client: "507f1f77bcf86cd799439011",
      invoiceNumber: "INV-001",
      amountTotal: 1000,
      amountPaid: 200,
      dueDate: "2026-12-01T00:00:00.000Z",
    });

    expect(Invoice.create).toHaveBeenCalledWith(
      expect.objectContaining({ status: "partial" })
    );
    expect(result.status).toBe("partial");
  });

  it("should reject when amountPaid > amountTotal", async () => {
    Client.findById.mockResolvedValue({ _id: "client-1" });

    await expect(
      createInvoice({
        client: "507f1f77bcf86cd799439011",
        amountTotal: 100,
        amountPaid: 150,
        dueDate: "2026-12-01T00:00:00.000Z",
      })
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});
