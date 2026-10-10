const request = require("supertest");
const express = require("express");
const ratingsRouter = require("../../routes/ratings");
const usersRouter = require("../../routes/users");
const { error } = require("node:console");
const { beforeEach, afterEach } = require("node:test");

const mockTokens = { "token-a": "user-a", "token-b": "user-b" };
const mockDbCalls = [];

jest.mock("../../lib/supabase", () => {
    const chain = new Proxy(
        {},
        {
            get: (_, method) => {
                if (method === "then")
                    return (resolve) => resolve({ data: [], error: null });
                return () => {
                    mockDbCalls.push(method);
                    return chain;
                };
            },
        },
    );

    return {
        supabase: {
            from: () => {
                mockDbCalls.push("from");
                return chain;
            },
            auth: {
                getUser: async (token) =>
                    mockTokens[token]
                        ? {
                              data: {
                                  user: { id: mockTokens[token] },
                                  error: null,
                              },
                          }
                        : {
                              data: {
                                  user: null,
                                  error: "bad token",
                              },
                          },
                admin: {
                    deleteUser: async (id) => {
                        mockDbCalls.push(`deleteUser:${id}`);
                        return { error: null };
                    },
                },
            },
        },
    };
});

const app = express();
app.use(express.json());
app.use("/api/users", usersRouter);
app.use("/api", ratingsRouter);

const asUserA = { Authorization: "Bearer token-a" };
const asUserB = { Authorization: "Bearer token-b" };

const stub = beforeEach(() => {
    mockDbCalls.length = 0;
    jest.spyOn(console, "log").mockImplementation();
});
afterEach(() => jest.restoreAllMocks());

describe("GIVEN a request with a missing or invalid token", () => {
    it("WHEN there is no token", async () => {
        const response = await request(app).delete(
            "/api/users/user-a/ratings/1",
        );

        const body = JSON.parse(response.text);

        //THEN they are told they're not logged in
        expect(response.status).toBe(401);
        expect(body.error).toBe("Missing auth token");
    });

    it("WHEN they call a protected route with a token supabase doesn't recognise", async () => {
        const response = await request(app)
            .delete("/api/users/user-a/ratings/1")
            .set("Authorization", "Bearer nonsense");

        const body = JSON.parse(response.text);

        //THEN they are refuted
        expect(response.status).toBe(403);
        expect(body.error).toBe("Invalid or expired token");
    });
});

describe("GIVEN user B is logged in and targets user A's data", () => {
    it("WHEN user B deletes one of user A's ratings", async () => {
        const response = await request(app)
            .delete("/api/users/user-a/ratings/1")
            .set(asUserB);
        const body = JSON.parse(response.text);

        // THEN it is refused
        expect(response.status).toBe(403);
        expect(body.error).toBe("Forbidden");
        expect(mockDbCalls).toStrictEqual([]);
    });

    it("WHEN user B attempts to edit user A's ratings", async () => {
        const response = await request(app)
            .put("/api/users/user-a/ratings/1")
            .set(asUserB)
            .send({ good_reason: "hacked" });
        const body = JSON.parse(response.text);

        //THEN it is refused and the data base was never touched
        expect(response.status).toBe(403);
        expect(mockDbCalls).toStrictEqual([]);
        expect(body.error).toBe("Forbidden");
    });

    it("WHEN user B adds a rating to user A's profile, with a valid body", async () => {
        const response = await request(app)
            .post("/api/users/user-a/ratings")
            .set(asUserB)
            .send({
                media: { media_type: "movie", tmdb_id: 1, title: "X-men" },
                x_coordinate: 0.5,
                y_coordinate: 0.5,
                good_reason: "eh",
                like_reason: "eh",
            });

        const body = JSON.parse(response.text);

        //THEN it is refused and the data base was never touched
        expect(response.status).toBe(403);
        expect(mockDbCalls).toStrictEqual([]);
        expect(body.error).toBe("Forbidden");
    });

    it("WHEN user B attempts to delete user A's account", async () => {
        const response = await request(app)
            .delete("/api/users/useer-a")
            .set(asUserB);

        const body = JSON.parse(response.text);

        //THEN it is refused and deleteUser was never called
        expect(response.status).toBe(403);
        expect(mockDbCalls).toStrictEqual([]);
        expect(body.error).toBe("Forbidden");
    });
});

describe("GIVEN user A is logged in and targets their own data", () => {});
