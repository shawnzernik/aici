import https from 'https';
import fetch from "node-fetch";
import { DatasetDto } from 'common/src/models/DatasetDto';
import { Config } from '../../Config';
import { EntitiesDataSource } from '../../data/EntitiesDataSource';
import { DatasetEntity } from '../../data/DatasetEntity';

jest.setTimeout(Config.jestTimeoutSeconds * 1000);

describe("DatasetService", () => {
    let agent = new https.Agent({ rejectUnauthorized: false });
    let entityGuid = "4a5b6c7d-8e9f-10aa-bbcc-ddeeff001122"; // Sample GUID for dataset
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
        try { await eds.datasetRepository().delete({ guid: entityGuid }); }
        finally { await eds.destroy(); }
    }, Config.jestTimeoutSeconds * 1000);

    test("POST /api/v0/dataset - save new should return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const entity = new DatasetEntity();
        entity.guid = entityGuid;
        entity.title = "New Dataset";
        entity.includeInTraining = true;
        entity.json = "{\"key\":\"value\"}";

        const response = await fetch("https://localhost:4433/api/v0/dataset", {
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

        let reloaded = await eds.datasetRepository().findOneByOrFail({ guid: entityGuid });
        expect(entity).toEqual(reloaded);
    }, Config.jestTimeoutSeconds * 1000);
    
    test("POST /api/v0/dataset overwrite should return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const entity = new DatasetEntity();
        entity.guid = entityGuid;
        entity.title = "Updated Dataset";
        entity.includeInTraining = false;
        entity.json = "{\"key\":\"updatedValue\"}";

        const response = await fetch("https://localhost:4433/api/v0/dataset", {
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

        let reloaded = await eds.datasetRepository().findOneByOrFail({ guid: entityGuid });
        expect(entity).toEqual(reloaded);
    }, Config.jestTimeoutSeconds * 1000);
    
    test("GET /api/v0/datasets should return dataset list", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch("https://localhost:4433/api/v0/datasets", {
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

        const data = obj["data"] as DatasetDto[];

        expect(data.length > 0).toBeTruthy();
        expect(data[0].guid).toBeTruthy();
    }, Config.jestTimeoutSeconds * 1000);
    
    test("GET /api/v0/dataset/:guid should return dataset and 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch("https://localhost:4433/api/v0/dataset/" + entityGuid, {
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

        const data = obj["data"] as DatasetDto;

        expect(data.guid).toEqual(entityGuid);
    }, Config.jestTimeoutSeconds * 1000);
    
    test("DELETE /api/v0/dataset/:guid should delete dataset and return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch("https://localhost:4433/api/v0/dataset/" + entityGuid, {
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

        let entity = await eds.datasetRepository().findBy({ guid: entityGuid });
        expect(entity.length).toEqual(0);
    }, Config.jestTimeoutSeconds * 1000);
});