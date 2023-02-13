require("dotenv").config({ path: ".env.testing" });

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { User } = require("../../../models/user");

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    const _id = new mongoose.Types.ObjectId().toHexString();
    const payload = { _id, isAdmin: true };

    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    expect(decoded).toMatchObject(payload);
  });
});
