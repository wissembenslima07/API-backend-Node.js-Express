jest.mock("../src/models/user.model", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../src/models/user.model");
const { loginUser } = require("../src/services/auth.service");

describe("auth.service - loginUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should login user and return JWT token", async () => {
    const user = {
      _id: { toString: () => "user-id-1" },
      fullName: "Manager Test",
      email: "manager@test.com",
      role: "manager",
      isActive: true,
      passwordHash: "hashed-pass",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fake-jwt-token");

    const result = await loginUser({
      email: "manager@test.com",
      password: "12345678",
    });

    expect(result.token).toBe("fake-jwt-token");
    expect(result.user.email).toBe("manager@test.com");
    expect(jwt.sign).toHaveBeenCalledTimes(1);
  });

  it("should fail when password is invalid", async () => {
    User.findOne.mockResolvedValue({
      _id: { toString: () => "user-id-1" },
      email: "manager@test.com",
      role: "manager",
      isActive: true,
      passwordHash: "hashed-pass",
    });
    bcrypt.compare.mockResolvedValue(false);

    await expect(
      loginUser({ email: "manager@test.com", password: "wrong" })
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it("should fail when user is inactive", async () => {
    User.findOne.mockResolvedValue({
      _id: { toString: () => "user-id-1" },
      email: "manager@test.com",
      role: "manager",
      isActive: false,
      passwordHash: "hashed-pass",
    });
    bcrypt.compare.mockResolvedValue(true);

    await expect(
      loginUser({ email: "manager@test.com", password: "12345678" })
    ).rejects.toMatchObject({ statusCode: 403 });
  });
});
