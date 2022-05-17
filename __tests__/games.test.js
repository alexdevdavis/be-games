process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const { forEach } = require("../db/data/test-data/categories.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/categories", () => {
  test("200: returns an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.categories)).toBe(true);
        expect(body.categories).toHaveLength(4);
        body.categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("200: returns an object with review properties", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toMatchObject({
          review_id: 1,
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Farmyard fun!",
          category: "euro game",
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  test("404: returns an error when passed a review_id not in the reviews table", () => {
    return request(app)
      .get("/api/reviews/55")
      .expect(404)
      .then((response) => {
        expect(response.text).toBe("no such review");
      });
  });
  test("400: returns an error when passed an invalid parametric endpoint review_id", () => {
    return request(app)
      .get("/api/reviews/sausage")
      .expect(400)
      .then((response) => {
        expect(response.text).toBe("bad request");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  const voteUpdate = { inc_votes: 3 };
  test("200: returns a review object with votes updated", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send(voteUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.updated_review).toMatchObject({
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: expect.any(String),
          votes: 8,
        });
      });
  });
  test("200: returns a review object with negative vote value if passed minus number takes votes below zero", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: -41 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updated_review).toMatchObject({
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: expect.any(String),
          votes: -36,
        });
      });
  });
  test("404: returns an error message if passed an unassigned review id", () => {
    return request(app)
      .patch("/api/reviews/42")
      .send(voteUpdate)
      .expect(404)
      .then((response) => {
        expect(response.text).toBe("no such review");
      });
  });
  test("400: returns an error message if passed an invalid review id", () => {
    return request(app)
      .patch("/api/reviews/winklepickers")
      .send({ inc_votes: 85 })
      .expect(400)
      .then((response) => {
        expect(response.text).toBe("bad request");
      });
  });
  test("400: returns an error message if passed an invalid vote value", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send({ inc_votes: "pickles" })
      .expect(400)
      .then((response) => {
        expect(response.text).toBe("invalid vote request");
      });
  });
  test("400: returns an error message if passed an invalid key on PATCH object", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send({ remy_martin: 19 })
      .expect(400)
      .then((response) => {
        expect(response.text).toBe("invalid vote request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: returns an object with an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        expect(body.users).toHaveLength(4);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("404: path not found", () => {
  test("404: returns an error message when client accesses an invalid endpoint", () => {
    return request(app)
      .get("/api/reeeviews")
      .expect(404)
      .then((response) => {
        expect(response.text).toBe("path not found");
      });
  });
  test("404: returns an error message when client accesses an invalid endpoint", () => {
    return request(app)
      .get("/aypeei")
      .expect(404)
      .then((response) => {
        expect(response.text).toBe("path not found");
      });
  });
});
