import https from 'https';
import fetch from "node-fetch";
import { ListFilterDto } from 'common/src/models/ListFilterDto';
import { Config } from '../../Config';
import { EntitiesDataSource } from '../../data/EntitiesDataSource';
import { ListFilterEntity } from '../../data/ListFilterEntity';
import { ListEntity } from '../../data/ListEntity';
import { UUIDv4 } from 'common/src/logic/UUIDv4';

jest.setTimeout(Config.jestTimeoutSeconds * 1000);

describe("ListFilterService", () => {
    let agent = new https.Agent({ rejectUnauthorized: false });
    let entityGuid = "faf76b3d-ed66-4182-a7c2-7ea6562785fe";
    let token: string | undefined;
    let eds: EntitiesDataSource;

    let listEntity = new ListEntity();
    listEntity.autoload = false;
    listEntity.editUrl = "http://edit";
    listEntity.guid = entityGuid;
    listEntity.leftMenuGuid = UUIDv4.generate();
    listEntity.topMenuGuid = UUIDv4.generate();
    listEntity.sql = "SELECT 'hello'";
    listEntity.title = "DELETE ME";

    beforeAll(async () => {
        eds = new EntitiesDataSource();
        await eds.initialize();

        await eds.listRepository().save(listEntity);

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
        try { await eds.listFilterRepository().delete({ guid: entityGuid }); }
        catch(err) { /* eat err */ }
        try { await eds.listRepository().delete({ guid: entityGuid }); }
        catch(err) { /* eat err */ }

        await eds.destroy();
    }, Config.jestTimeoutSeconds * 1000);

    test("POST /api/v0/list_filter - save new should return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const entity = new ListFilterEntity();
        entity.guid = entityGuid;
        entity.listsGuid = entityGuid;
        entity.label = "Filter Label";
        entity.sqlColumn = "column_name";
        entity.sqlType = "string";

        const response = await fetch("https://localhost:4433/api/v0/list_filter", {
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

        let reloaded = await eds.listFilterRepository().findOneByOrFail({ guid: entityGuid });
        expect(entity).toEqual(reloaded);
    }, Config.jestTimeoutSeconds * 1000);

    test("GET /api/v0/list_filters should return list of filters", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch("https://localhost:4433/api/v0/list_filters", {
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

        const data = obj["data"] as ListFilterDto[];

        expect(data.length > 0).toBeTruthy();
        expect(data[0].guid).toBeTruthy();
    }, Config.jestTimeoutSeconds * 1000);

    test("GET /api/v0/list_filter/:guid should return filter and 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch("https://localhost:4433/api/v0/list_filter/" + entityGuid, {
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

        const data = obj["data"] as ListFilterDto;

        expect(data.guid).toEqual(entityGuid);
    }, Config.jestTimeoutSeconds * 1000);

    test("DELETE /api/v0/list_filter/:guid should delete filter and return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch("https://localhost:4433/api/v0/list_filter/" + entityGuid, {
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

        let entity = await eds.listFilterRepository().findBy({ guid: entityGuid });
        expect(entity.length).toEqual(0);
    }, Config.jestTimeoutSeconds * 1000);
});