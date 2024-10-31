import https from 'https';
import fetch from "node-fetch";
import { FinetuneDto } from 'common/src/models/FinetuneDto';
import { Config } from '../../Config';
import { EntitiesDataSource } from '../../data/EntitiesDataSource';
import { FinetuneEntity } from '../../data/FinetuneEntity';

jest.setTimeout(Config.jestTimeoutSeconds * 1000);

describe("FinetuneService", () => {
    let agent = new https.Agent({ rejectUnauthorized: false });
    let entityGuid = "faf76b3d-ed66-4182-a7c2-7ea6562785fe";
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
        try { await eds.finetuneRepository().delete({ guid: entityGuid }); }
        finally { await eds.destroy(); }
    }, Config.jestTimeoutSeconds * 1000);

    test("POST /api/v0/finetune - save new should return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const entity = new FinetuneEntity();
        entity.guid = entityGuid;
        entity.displayName = "Delete Me";
        entity.suffix = "test";
        entity.id = "finetune-test-id";
        entity.model = "test-model";
        entity.trainingFile = "train-file.txt";
        entity.trainingData = "some training data";

        const response = await fetch("https://localhost:4433/api/v0/finetune", {
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

        let reloaded = await eds.finetuneRepository().findOneByOrFail({ guid: entityGuid });
        expect(entity.displayName).toEqual(reloaded.displayName);
    }, Config.jestTimeoutSeconds * 1000);

    test("POST /api/v0/finetune overwrite should return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const entity = new FinetuneEntity();
        entity.guid = entityGuid;
        entity.displayName = "Delete Me Dupe";
        entity.suffix = "test2";
        entity.id = "finetune-test-id";
        entity.model = "test-model-dup";
        entity.trainingFile = "train-file-dup.txt";
        entity.trainingData = "some more training data";

        const response = await fetch("https://localhost:4433/api/v0/finetune", {
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

        let reloaded = await eds.finetuneRepository().findOneByOrFail({ guid: entityGuid });
        expect(entity.displayName).toEqual(reloaded.displayName);
    }, Config.jestTimeoutSeconds * 1000);

    test("GET /api/v0/finetunes should return finetune list", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch("https://localhost:4433/api/v0/finetunes", {
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

        const data = obj["data"] as FinetuneDto[];

        expect(data.length > 0).toBeTruthy();
        expect(data[0].guid).toBeTruthy();
    }, Config.jestTimeoutSeconds * 1000);

    test("GET /api/v0/finetune/:guid should return finetune and 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch("https://localhost:4433/api/v0/finetune/" + entityGuid, {
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

        const data = obj["data"] as FinetuneDto;

        expect(data.guid).toEqual(entityGuid);
    }, Config.jestTimeoutSeconds * 1000);

    test("DELETE /api/v0/finetune/:guid should delete finetune and return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch("https://localhost:4433/api/v0/finetune/" + entityGuid, {
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

        let entity = await eds.finetuneRepository().findBy({ guid: entityGuid });
        expect(entity.length).toEqual(0);
    }, Config.jestTimeoutSeconds * 1000);
});