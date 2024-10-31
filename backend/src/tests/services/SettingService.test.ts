import https from 'https';
import fetch from "node-fetch";
import { SettingDto } from 'common/src/models/SettingDto';
import { Config } from '../../Config';
import { EntitiesDataSource } from '../../data/EntitiesDataSource';
import { SettingEntity } from '../../data/SettingEntity';

jest.setTimeout(Config.jestTimeoutSeconds * 1000);

describe("SettingService", () => {
    let agent = new https.Agent({ rejectUnauthorized: false });
    let entityGuid = "c5f1c8b3-5a56-48d9-bd1d-61ecf9f1a1c8";
    let token: string | undefined;
    let eds: EntitiesDataSource;

    beforeAll(async () => {
        eds = new EntitiesDataSource();
        await eds.initialize();

        const body = JSON.stringify({
            emailAddress: "administrator@localhost",
            password: "Welcome123"
        });

        const response = await fetch("https://localhost:4433/api/v0/auth/login", {
            agent: agent,
            method: "POST",
            body: body,
            headers: { "Content-Type": "application/json" }
        });

        const obj = await response.json();
        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText} - ${obj.error}`);

        if (!obj["data"])
            throw new Error("Return from login did not provide a 'data' with the token!");

        token = obj["data"] as string;
    }, Config.jestTimeoutSeconds * 1000);

    afterAll(async () => {
        try { await eds.settingRepository().delete({ guid: entityGuid }); }
        finally { await eds.destroy(); }
    }, Config.jestTimeoutSeconds * 1000);

    test("POST /api/v0/setting - save new should return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const entity = new SettingEntity();
        entity.guid = entityGuid;
        entity.key = "Test Setting";
        entity.value = "Test Value";

        const response = await fetch("https://localhost:4433/api/v0/setting", {
            agent: agent,
            method: "POST",
            body: JSON.stringify(entity),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        const obj = await response.json();
        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText} - ${obj.error}`);

        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);

        let reloaded = await eds.settingRepository().findOneByOrFail({ guid: entityGuid });
        expect(entity).toEqual(reloaded);
    }, Config.jestTimeoutSeconds * 1000);

    test("GET /api/v0/settings should return settings list", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch("https://localhost:4433/api/v0/settings", {
            agent: agent,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        const obj = await response.json();
        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText} - ${obj.error}`);

        if (!obj["data"])
            throw new Error("No data returned!");

        const data = obj["data"] as SettingDto[];

        expect(data.length > 0).toBeTruthy();
        expect(data[0].guid).toBeTruthy();
    }, Config.jestTimeoutSeconds * 1000);

    test("GET /api/v0/setting/:guid should return setting and 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch("https://localhost:4433/api/v0/setting/" + entityGuid, {
            agent: agent,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        const obj = await response.json();
        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText} - ${obj.error}`);

        if (!obj["data"])
            throw new Error("No data returned!");

        const data = obj["data"] as SettingDto;

        expect(data.guid).toEqual(entityGuid);
    }, Config.jestTimeoutSeconds * 1000);

    test("DELETE /api/v0/setting/:guid should delete setting and return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch("https://localhost:4433/api/v0/setting/" + entityGuid, {
            agent: agent,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        const obj = await response.json();
        if (!response.ok)
            throw new Error(`Response: ${response.status} - ${response.statusText} - ${obj.error}`);

        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);

        let entity = await eds.settingRepository().findBy({ guid: entityGuid });
        expect(entity.length).toEqual(0);
    }, Config.jestTimeoutSeconds * 1000);
});