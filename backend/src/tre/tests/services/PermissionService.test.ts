import https from 'https';
import fetch from "node-fetch";
import { PermissionDto } from 'common/src/tre/models/PermissionDto';
import { Config } from '../../../Config';
import { EntitiesDataSource } from '../../data/EntitiesDataSource';
import { PermissionEntity } from '../../data/PermissionEntity';
import { GroupEntity } from '../../data/GroupEntity';
import { SecurableEntity } from '../../data/SecurableEntity';
import { PermissionRepository } from '../../data/PermissionsRepository';
import { GroupRepository } from '../../data/GroupRepository';
import { SecurableRepository } from '../../data/SecurableRepository';

jest.setTimeout(Config.jestTimeoutSeconds * 1000);

describe("PermissionService", () => {
    let agent = new https.Agent({ rejectUnauthorized: false });
    let entityGuid = "faf76b3d-ed66-4182-a7c2-7ea6562785fe";
    let token: string | undefined;
    let eds: EntitiesDataSource;

    let groupEntity = new GroupEntity();
    groupEntity.guid = entityGuid;
    groupEntity.displayName = "Delete Me";
    groupEntity.isAdministrator = false;

    let securableEntity = new SecurableEntity();
    securableEntity.guid = entityGuid;
    securableEntity.displayName = "Delete Me";

    beforeAll(async () => {
        eds = new EntitiesDataSource();
        await eds.initialize();

        await new SecurableRepository(eds).save(securableEntity);
        await new GroupRepository(eds).save(groupEntity);

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
        try { await new PermissionRepository(eds).delete({ guid: entityGuid }); }
        catch (err) { /* eat error */ }
        try { await new SecurableRepository(eds).delete({ guid: entityGuid }); }
        catch (err) { /* eat error */ }
        try { await new GroupRepository(eds).delete({ guid: entityGuid }); }
        catch (err) { /* eat error */ }

        await eds.destroy();
    }, Config.jestTimeoutSeconds * 1000);

    test("POST /api/v0/permission - save new should return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const entity = new PermissionEntity();
        entity.guid = entityGuid;
        entity.groupsGuid = entityGuid;
        entity.isAllowed = true;
        entity.securablesGuid = entityGuid;

        const response = await fetch(Config.appUrl + "/api/v0/permission", {
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

        let reloaded = await new PermissionRepository(eds).findOneByOrFail({ guid: entityGuid });
        expect(entity).toEqual(reloaded);
    }, Config.jestTimeoutSeconds * 1000);
    test("POST /api/v0/permission overwrite should return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const entity = new PermissionEntity();
        entity.guid = entityGuid;
        entity.groupsGuid = entityGuid;
        entity.isAllowed = false;
        entity.securablesGuid = entityGuid;

        const response = await fetch(Config.appUrl + "/api/v0/permission", {
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

        let reloaded = await new PermissionRepository(eds).findOneByOrFail({ guid: entityGuid });
        expect(entity).toEqual(reloaded);
    }, Config.jestTimeoutSeconds * 1000);
    test("GET /api/v0/permissions should return permission list", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch(Config.appUrl + "/api/v0/permissions", {
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

        const data = obj["data"] as PermissionDto[];

        expect(data.length > 0).toBeTruthy();
        expect(data[0].guid).toBeTruthy();
        expect(data[0].groupsGuid).toBeTruthy();
        expect(data[0].securablesGuid).toBeTruthy();
        expect(data[0].isAllowed === true || data[0].isAllowed === false).toBeTruthy();
    }, Config.jestTimeoutSeconds * 1000);
    test("GET /api/v0/permission/:guid should return permission and 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch(Config.appUrl + "/api/v0/permission/" + entityGuid, {
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

        const data = obj["data"] as PermissionDto;

        expect(data.guid).toEqual(entityGuid);
    }, Config.jestTimeoutSeconds * 1000);
    test("DELETE /api/v0/permission/:guid should delete permission and return 200", async () => {
        if (!token)
            throw new Error("No token - did beforeAll() fail?");

        const response = await fetch(Config.appUrl + "/api/v0/permission/" + entityGuid, {
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

        let entity = await new PermissionRepository(eds).findBy({ guid: entityGuid });
        expect(entity.length).toEqual(0);
    }, Config.jestTimeoutSeconds * 1000);
});