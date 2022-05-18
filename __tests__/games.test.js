process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/categories", () => {
  test("200: returns an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(Array.isArray(categories)).toBe(true);
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/reviews", () => {
  test("200: returns an object with an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(Array.isArray(reviews)).toBe(true);
        expect(reviews.length).toBe(13);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              category: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });

  test("200: return object's array is sorted by date, in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("200: returns an object with review properties", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual(
          expect.objectContaining({
            review_id: 1,
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Farmyard fun!",
            category: "euro game",
            votes: 1,
            created_at: "2021-01-18T10:00:20.514Z",
          })
        );
      });
  });
  test("200: returns an object with a comment_count property", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review.comment_count).toBe(3);
      });
  });
  test("404: returns an error when passed a review_id not in the reviews table", () => {
    return request(app)
      .get("/api/reviews/55")
      .expect(404)
      .then(({ text }) => {
        expect(text).toBe("review not found");
      });
  });
  test("400: returns an error when passed an invalid parametric endpoint review_id", () => {
    return request(app)
      .get("/api/reviews/sausage")
      .expect(400)
      .then(({ text }) => {
        expect(text).toBe("bad request");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  const postedComment = {
    username: "mallionaire",
    body: "This review is savage",
  };
  test("201: returns posted comment, and adds comment to comments db", () => {
    return request(app)
      .post("/api/reviews/4/comments")
      .send(postedComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          expect.objectContaining({
            author: "mallionaire",
            body: "This review is savage",
            comment_id: 7,
            review_id: 4,
            votes: 0,
            created_at: expect.any(String),
          })
        );
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
      .then(({ body: { updated_review } }) => {
        expect(updated_review).toMatchObject({
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 8,
        });
      });
  });
  test("200: returns a review object with negative vote value if passed minus number takes votes below zero", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: -41 })
      .expect(200)
      .then(({ body: { updated_review } }) => {
        expect(updated_review).toMatchObject({
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: -36,
        });
      });
  });
  test("404: returns an error message if passed an unassigned review id", () => {
    return request(app)
      .patch("/api/reviews/42")
      .send(voteUpdate)
      .expect(404)
      .then(({ text }) => {
        expect(text).toBe("review not found");
      });
  });
  test("400: returns an error message if passed an invalid review id", () => {
    return request(app)
      .patch("/api/reviews/winklepickers")
      .send({ inc_votes: 85 })
      .expect(400)
      .then(({ text }) => {
        expect(text).toBe("bad request");
      });
  });
  test("400: returns an error message if passed an invalid vote value", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send({ inc_votes: "pickles" })
      .expect(400)
      .then(({ text }) => {
        expect(text).toBe("invalid vote request");
      });
  });
  test("400: returns an error message if passed an invalid key on PATCH object", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send({ remy_martin: 19 })
      .expect(400)
      .then(({ text }) => {
        expect(text).toBe("invalid vote request");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200: returns an object with an array of comments for identified review", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(Array.isArray(comments)).toBe(true);
        expect(comments).toHaveLength(3);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: 3,
            })
          );
        });
      });
  });
  test("200: returns an empty array if review_id is valid, but has no associated comments", () => {
    return request(app)
      .get("/api/reviews/4/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(0);
      });
  });
  test("400: returns an error message when request review_id data type is invalid", () => {
    return request(app)
      .get("/api/reviews/loudpurp/comments")
      .expect(400)
      .then(({ text }) => {
        expect(text).toBe("invalid review id request");
      });
  });
  test("404: returns an error message when requested review_id does not exist", () => {
    return request(app)
      .get("/api/reviews/1984/comments")
      .expect(404)
      .then(({ text }) => {
        expect(text).toBe("review not found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: returns an object with an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(Array.isArray(users)).toBe(true);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
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
      .then(({ text }) => {
        expect(text).toBe("path not found");
      });
  });
  test("404: returns an error message when client accesses an invalid endpoint", () => {
    return request(app)
      .get("/aypeei")
      .expect(404)
      .then(({ text }) => {
        expect(text).toBe("path not found");
      });
  });
});
