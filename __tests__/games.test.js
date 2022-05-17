process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

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
  test("404: not found", () => {});
});

describe("GET /api/reviews/:review_id", () => {
  test("200: returns an object with review properties", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toMatchObject({
          review_id: 1,
          title: 'Agricola',
    designer: 'Uwe Rosenberg',
    owner: 'mallionaire',
    review_img_url:
      'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
    review_body: 'Farmyard fun!',
    category: 'euro game',
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
        expect(response.text).toBe("not found");
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
