import request from "supertest";
import app from "../app.js";
import pool from "../database/db.js";

describe("Auth", () => {
    it("should reject invalid login", async () => {
        const res = await request(app)
            .post("/users/login")
            .send({
                email: "fake@test.com",
                password: "wrong"
            });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("error");
    });
});

describe("Register", () => {
    it("should reject invalid register by email", async () => {
        const res = await request(app)
            .post("/users/register")
            .send({
                email: "faketest.com",
                name: "test",
                password: "Ab1234567@"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    it("should reject invalid register by username", async () => {
        const res = await request(app)
        .post("/users/register")
        .send({
            email: "faketest@gmail.com",
            name: "test",
            password: "Faketest12345"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
});

afterAll(async () => {
    await pool.end();
});