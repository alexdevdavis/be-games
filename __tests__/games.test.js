process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test("Returns an object detailing all available endpoints in api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        const endpointKeys = Object.keys(endpoints);
        expect(endpointKeys).toHaveLength(9);
        for (let i = 0; i < endpointKeys.length; i++) {
          expect(endpoints[endpointKeys[i]]).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              queries: expect.any(Array),
              exampleResponse: expect.any(Object),
            })
          );
        }
      });
  });
});

describe("GET /categories", () => {
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
  test("200: return object's array default sorting is by date, in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: return object's array can be sorted according to client query, defaults to descending", () => {
    return request(app)
      .get("/api/reviews?sort_by=owner")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("owner", { descending: true });
      });
  });
  test("200: return object's array can be ordered according to client query", () => {
    return request(app)
      .get("/api/reviews?sort_by=owner&order_by=asc")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("owner", { ascending: true });
      });
  });
  test("200: return object's array can be filtered according to client query", () => {
    return request(app)
      .get("/api/reviews?category=social+deduction")
      .expect(200)
      .then(({ body: { reviews } }) => {
        reviews.forEach((review) => {
          expect(review.category).toBe("social deduction");
        });
      });
  });
  test("200: return object's array can be sorted, ordered and filtered according to client query", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes&order=desc&category=social+deduction")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("votes", { descending: true });
        reviews.forEach((review) => {
          expect(review.category).toBe("social deduction");
        });
      });
  });
  test("200: return object is empty when passed an existing category with no reviews", () => {
    return request(app)
      .get("/api/reviews?category=children%27s+games")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toEqual([]);
      });
  });

  test("400: returns an error message when passed an invalid sort_by query", () => {
    return request(app)
      .get("/api/reviews?sort_by=bearcuts")
      .expect(400)
      .then(({ text }) => {
        expect(text).toBe("invalid sort by request");
      });
  });
  test("400: returns an error message when passed an invalid order_by query", () => {
    return request(app)
      .get("/api/reviews?order_by=bread")
      .expect(400)
      .then(({ text }) => {
        expect(text).toBe("invalid order by request");
      });
  });
  test("400: returns an error message when passed an invalid category", () => {
    return request(app)
      .get("/api/reviews?category=3")
      .expect(400)
      .then(({ text }) => {
        expect(text).toBe("invalid category request");
      });
  });

  test("404: returns an error message when passed a non-existent category", () => {
    return request(app)
      .get("/api/reviews?sort_by=title&category=palm+oil")
      .expect(404)
      .then(({ text }) => {
        expect(text).toBe("category not found");
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

  test("400: returns an error when passed an invalid review_id data type", () => {
    return request(app)
      .get("/api/reviews/sausage/comments")
      .expect(400)
      .then(({ text }) => {
        expect(text).toBe("invalid review id request");
      });
  });

  test("400: returns an error message if req.body is missing mandatory keys", () => {
    const invalidKeys = {
      usernaym: "mallionaire",
      boty: "This review is savage",
    };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(invalidKeys)
      .expect(400)
      .then(({ text }) => {
        expect(text).toBe("invalid comment");
      })
      .then(() => {
        return request(app)
          .post("/api/reviews/4/comments")
          .send({
            username: "mallionaire",
            boty: "This review is savage",
          })
          .expect(400)
          .then(({ text }) => {
            expect(text).toBe("invalid comment");
          });
      });
  });
  test("404: returns an error message if review_id in path doesn't exist", () => {
    return request(app)
      .post("/api/reviews/1066/comments")
      .send(postedComment)
      .expect(404)
      .then(({ text }) => {
        expect(text).toBe("review not found");
      });
  });
  test("404: returns an error message if user doesn't exist in database", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "malcolm hibblebottom", body: "This review is savage" })
      .expect(404)
      .then(({ text }) => {
        expect(text).toBe("user not found");
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

describe("DELETE /api/comments/:comment_id", () => {
  test("204: returns only a status code upon successful deletion", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("404: returns an error message if no comment matching comment_id is found", () => {
    return request(app)
      .delete("/api/comments/1984")
      .expect(404)
      .then(({ text }) => {
        expect(text).toEqual("delete unsuccessful: comment not found");
      });
  });
  test("400: returns an error message if comment_id in request is not a number", () => {
    return request(app)
      .delete("/api/comments/wibble")
      .expect(400)
      .then(({ text }) => {
        expect(text).toEqual("invalid comment id request");
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
