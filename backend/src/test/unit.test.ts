import * as request from "supertest";

import app from "../app";
import config from "../utils/config";

const { FLOORS } = config;

describe("1.0 Test api", () => {

    test("1.1 GET /api/init", async () => {
        // when
        const response = await request(
            app.callback())
            .get("/api/init");

        // then
        expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(response.statusCode).toEqual(200);
        expect(response.body).toMatchSnapshot();
    });

    test("1.2 GET /api/positions", async () => {
        // when
        const response = await request(
            app.callback())
            .get("/api/init");

        // then
        expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(response.statusCode).toEqual(200);
        expect(response.body).toMatchSnapshot();
    });

    test("1.3 PATCH /api/positions, returns 200", async () => {
        // given
        const destinationFloor = 1;
        const body = JSON.stringify({ destinationFloor });

        // when
        const response = await request(
            app.callback())
            .patch("/api/positions")
            .set({ "Content-Type": "application/json" })
            .send(body);

        // then
        expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(response.statusCode).toEqual(200);
        expect(response.body).toMatchSnapshot();
    });

    test("1.4 PATCH /api/positions, invalid destinationFloor, returns 500", async () => {
        // given
        const destinationFloor = FLOORS;
        const body = JSON.stringify({ destinationFloor });

        // when
        const response = await request(
            app.callback())
            .patch("/api/positions")
            .set({ "Content-Type": "application/json" })
            .send(body);

        // then
        expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        expect(response.statusCode).toEqual(500);
        expect(response.body).toMatchSnapshot();
    });

});