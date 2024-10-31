import https from 'https';
import fetch from "node-fetch";

jest.setTimeout(0);

describe("WebApp", () => {
    let agent = new https.Agent({ rejectUnauthorized: false });

    test("GET /api/v0/health should return 200 with OK", async () => {
        const response = await fetch(
            "https://localhost:4433/api/v0/health",
            { agent: agent }
        );

        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data).toEqual({ data: "OK" });
    });

    test("GET /api/v0/liveness should return 200 with OK", async () => {
        const response = await fetch(
            "https://localhost:4433/api/v0/liveness",
            { agent: agent }
        );

        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data).toEqual({ data: "OK" });
    });
});