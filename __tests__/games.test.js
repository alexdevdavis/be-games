process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app.js");
const db = require("../db");
const seed = require("../db/seed");
const testData = require("../db/data/test-data");
require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/categories", () => {
    test("", () => {
        
    })
})