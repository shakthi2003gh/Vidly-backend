require("dotenv").config({ path: ".env.testing" });

const mongoose = require("mongoose");
const request = require("supertest");
const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");
let server;

const genrePath = "/api/genres";
describe(genrePath, () => {
  beforeEach(async () => {
    server = require("../../index");
    await mongoose.connect(process.env.db);
  });

  afterEach(async () => {
    await server.close();
    await Genre.deleteMany({});
    await mongoose.connection.close();
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      const genres = [{ name: "genre1" }, { name: "genre2" }];
      await Genre.collection.insertMany(genres);

      const res = await request(server).get(genrePath);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get(genrePath + "/" + genre._id);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 if no genre with the given id exist", async () => {
      const id = mongoose.Types.ObjectId().toHexString();

      const res = await request(server).get(genrePath + "/" + id);
      expect(res.status).toBe(404);
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get(genrePath + "/1");
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token, name;

    const exec = () => {
      return request(server)
        .post(genrePath)
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre name is less than 5 characters", async () => {
      name = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre name is less than 50 characters", async () => {
      name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should save genre if it is valid", async () => {
      await exec();
      const genre = await Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });

    it("should return genre if it is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT /:id", () => {
    let id, name;

    const exec = () => {
      return request(server)
        .put(genrePath + "/" + id)
        .send({ name });
    };

    beforeEach(() => {
      const genre = new Genre({ name: "shakthi" });
      genre.save();
      id = genre._id.toHexString();
      name = "Updated genre";
    });

    it("should return 400 if input is invalid", async () => {
      name = "";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if no genre with the given id exist", async () => {
      id = mongoose.Types.ObjectId().toHexString();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return updated genre if given input is passed", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id", id);
      expect(res.body).toHaveProperty("name", name);
    });
  });

  describe("DELETE /:id", () => {
    let id, genre, token;

    const exec = () => {
      return request(server)
        .delete(genrePath + "/" + id)
        .set("x-auth-token", token);
    };

    beforeEach(async () => {
      genre = await new Genre({ name: "asdasf" }).save();
      token = new User({ isAdmin: true }).generateAuthToken();
      id = genre._id;
    });

    it("should return 403 if user is not admin", async () => {
      token = new User({ id: "ksadflsdkf" }).generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return 404 if id is invalid", async () => {
      id = mongoose.Types.ObjectId().toHexString();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return delete genre if input is passed", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });
});
