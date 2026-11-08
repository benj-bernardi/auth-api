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

    it("should reject login with empty email", async () => {
        const res = await request(app)
        .post("/users/login")
        .send({
            email: "",
            password: "test"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    it("should reject login with empty password", async () => {
        const res = await request(app)
        .post("/users/login")
        .send({
            email: "test@example.com",
            password: ""
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    it("should reject login with incorrect password", async () => {
        const res = await request(app)
        .post("/users/login")
        .send({
            email: process.env.TEST_USER_EMAIL,
            password: "WrongPassword123!"
        });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("error");
    });

    it("should reject invalid login by nonexistent email", async () => {
        const res = await request(app)
        .post("/users/login")
        .send({
            email: "fake.user.987@example.com",
            password: "test"
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
                name: "Test12345",
                password: "Faketest12345"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    it("should reject invalid register by username", async () => {
        const res = await request(app)
        .post("/users/register")
        .send({
            email: "username-test@gmail.com",
            name: "te!",
            password: "Faketest12345"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    it("should reject invalid register by password", async () => {
        const res = await request(app)
        .post("/users/register")
        .send({
            email: "password-test@gmail.com",
            name: "Test12345",
            password: "test"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    it("should reject invalid register with empty email", async () => {
        const res = await request(app)
        .post("/users/register")
        .send({
            email: "",
            name: "Test12345",
            password: "Faketest12345"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    it("should reject invalid register with empty name", async () => {
        const res = await request(app)
        .post("/users/register")
        .send({
            email: "username-test@example.com",
            name: "",
            password: "Faketest12345"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
});

afterAll(async () => {
    await pool.end();
});