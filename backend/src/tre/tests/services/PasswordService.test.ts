import https from 'https';
import fetch from "node-fetch";
import { PasswordDto } from 'common/src/tre/models/PasswordDto';
import { Config } from '../../../Config';
import { EntitiesDataSource } from '../../data/EntitiesDataSource';
import { PasswordEntity } from '../../data/PasswordEntity';
import { UserEntity } from '../../data/UserEntity';
import { PasswordRepository } from '../../data/PasswordRepository';
import { UserRepository } from '../../data/UserRepository';

jest.setTimeout(Config.jestTimeoutSeconds * 1000);

describe("PasswordService", () => {
    let agent = new https.Agent({ rejectUnauthorized: false });
    let entityGuid = "faf76b3d-ed66-4182-a7c2-7ea6562785fe";
    let token: string | undefined;
    let eds: EntitiesDataSource;

    let userEntity = new UserEntity();
    userEntity.guid = entityGuid;
    userEntity.displayName = "Delete Me";
    userEntity.emailAddress = "deleteme@localhost";
    userEntity.smsPhone = "555-555-5555";

    beforeAll(async () => {
        eds = new EntitiesDataSource();
        await eds.initialize();

        await new UserRepository(eds).save(userEntity);

        const body = JSON.stringify({
            emailAddress: "administrator@localhost",
            password: "Welcome123"
        });

        const response = await fetch(Config.appUrl + "/api/v0/auth/login", {
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
        try { await new PasswordRepository(eds).delete({ guid: entityGuid }); }
        catch (err) { /* eat error */ }
        try { await new UserRepository(eds).delete({ guid: entityGuid }); }
        catch (err) { /* eat error */ }

        await eds.destroy();
    }, Config.jestTimeoutSeconds * 1000);

    test("POST /api/v0/password - save new should return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const entity = new PasswordEntity();
        entity.guid = entityGuid;
        entity.usersGuid = entityGuid;
        entity.hash = "HASH";
        entity.salt = "SALT";
        entity.iterations = 100000;

        const response = await fetch(Config.appUrl + "/api/v0/password", {
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

        let reloaded = await new PasswordRepository(eds).findOneByOrFail({ guid: entityGuid });
        expect(entity).toEqual(reloaded);
    }, Config.jestTimeoutSeconds * 1000);

    test("POST /api/v0/password overwrite should return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const entity = new PasswordEntity();
        entity.guid = entityGuid;
        entity.usersGuid = entityGuid;
        entity.hash = "HASHIE";
        entity.salt = "SALTIE";
        entity.iterations = 100000;

        const response = await fetch(Config.appUrl + "/api/v0/password", {
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

        let reloaded = await new PasswordRepository(eds).findOneByOrFail({ guid: entityGuid });
        expect(entity).toEqual(reloaded);
    }, Config.jestTimeoutSeconds * 1000);
    test("GET /api/v0/passwords should return password list", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch(Config.appUrl + "/api/v0/passwords", {
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

        const data = obj["data"] as PasswordDto[];

        expect(data.length > 0).toBeTruthy();
        expect(data[0].guid).toBeTruthy();
        expect(data[0].usersGuid).toBeTruthy();
        expect(data[0].hash).toBeTruthy();
        expect(data[0].salt).toBeTruthy();
        expect(data[0].iterations).toBeTruthy();
    }, Config.jestTimeoutSeconds * 1000);

    test("GET /api/v0/password/:guid should return password and 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch(Config.appUrl + "/api/v0/password/" + entityGuid, {
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

        const data = obj["data"] as PasswordDto;

        expect(data.guid).toEqual(entityGuid);
    }, Config.jestTimeoutSeconds * 1000);

    test("DELETE /api/v0/password/:guid should delete password and return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch(Config.appUrl + "/api/v0/password/" + entityGuid, {
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

        let entity = await new PasswordRepository(eds).findBy({ guid: entityGuid });
        expect(entity.length).toEqual(0);
    }, Config.jestTimeoutSeconds * 1000);
});