jest.mock("../src/models/payment.model", () => ({
  Payment: {
    create: jest.fn(),
  },
}));

jest.mock("../src/models/invoice.model", () => ({
  Invoice: {
    findById: jest.fn(),
  },
}));

const { Payment } = require("../src/models/payment.model");
const { Invoice } = require("../src/models/invoice.model");
const { createManualPayment } = require("../src/services/payment.service");

describe("payment.service - createManualPayment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update invoice status to partial after payment", async () => {
    const save = jest.fn().mockResolvedValue(undefined);
    const invoice = {
      _id: { toString: () => "invoice-1" },
      amountTotal: 1000,
      amountPaid: 100,
      status: "unpaid",
      save,
    };

    Invoice.findById.mockResolvedValue(invoice);
    Payment.create.mockResolvedValue({
      _id: { toString: () => "payment-1" },
      invoice: "invoice-1",
      amount: 300,
      paymentDate: new Date("2026-06-01T00:00:00.000Z"),
      method: "cash",
      note: "manual payment",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await createManualPayment({
      invoice: "invoice-1",
      amount: 300,
      method: "cash",
    });

    expect(invoice.amountPaid).toBe(400);
    expect(invoice.status).toBe("partial");
    expect(save).toHaveBeenCalledTimes(1);
    expect(result.invoice.status).toBe("partial");
  });

  it("should update invoice status to paid when fully paid", async () => {
    const save = jest.fn().mockResolvedValue(undefined);
    const invoice = {
      _id: { toString: () => "invoice-1" },
      amountTotal: 1000,
      amountPaid: 700,
      status: "partial",
      save,
    };

    Invoice.findById.mockResolvedValue(invoice);
    Payment.create.mockResolvedValue({
      _id: { toString: () => "payment-2" },
      invoice: "invoice-1",
      amount: 300,
      paymentDate: new Date("2026-06-02T00:00:00.000Z"),
      method: "cash",
      note: "second payment",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await createManualPayment({
      invoice: "invoice-1",
      amount: 300,
      method: "cash",
    });

    expect(invoice.amountPaid).toBe(1000);
    expect(invoice.status).toBe("paid");
    expect(result.invoice.status).toBe("paid");
  });
});
