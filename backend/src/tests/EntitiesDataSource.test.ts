import { UUIDv4 } from "common/src/logic/UUIDv4";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { UserEntity } from "../data/UserEntity";

describe("EntitiesDataSource", () => {
    it("shall connect and CRUD user", async () => {
        const edm = new EntitiesDataSource();
        try {
            await edm.initialize();
            const repo = edm.userRepository();

            let entity: UserEntity = new UserEntity();
            entity.guid = UUIDv4.generate();
            entity.displayName = "Delete Me";
            entity.emailAddress = "deleteme@localhost";
            entity.smsPhone = "111-222-3333";

            await repo.save(entity);

            let entities = await repo.findBy({ emailAddress: "deleteme@localhost" });
            if (entities.length < 1)
                throw new Error("Could not locate user!");

            entity = entities[0];
            expect(entity.emailAddress).toBe("deleteme@localhost");

            entity.displayName = "Delete Me Now";
            await repo.save(entity);

            entities = await repo.findBy({ emailAddress: "deleteme@localhost" });
            if (entities.length < 1)
                throw new Error("Could not locate user!");

            entity = entities[0];
            expect(entity.displayName).toBe("Delete Me Now");

            await repo.delete({ guid: entity.guid });
        }
        catch(err) {
            console.error(err);
        }
        finally {
            await edm.destroy();
        }
    });
});