const request = require("supertest");
const app = require("../src/app");

describe("Health route", () => {
  it("should return 200 on GET /api/health", async () => {
    const response = await request(app).get("/api/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
