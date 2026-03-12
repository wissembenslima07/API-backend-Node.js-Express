const { auth, authorize } = require("../src/middlewares/auth.middleware");

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

const jwt = require("jsonwebtoken");

function createRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("auth.middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 when token is missing", () => {
    const req = { headers: {} };
    const res = createRes();
    const next = jest.fn();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next when token is valid", () => {
    const req = { headers: { authorization: "Bearer valid-token" } };
    const res = createRes();
    const next = jest.fn();

    jwt.verify.mockReturnValue({ sub: "user-id", role: "manager" });

    auth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user.role).toBe("manager");
  });

  it("should return 403 when role is forbidden", () => {
    const req = { user: { role: "agent" } };
    const res = createRes();
    const next = jest.fn();

    authorize(["manager", "admin"])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next when role is allowed", () => {
    const req = { user: { role: "admin" } };
    const res = createRes();
    const next = jest.fn();

    authorize(["manager", "admin"])(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
