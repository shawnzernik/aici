import { EntitiesDataSource } from "../../data/EntitiesDataSource";
import { AuthLogic } from "../../logic/AuthLogic";

describe("AuthLogic", () => {
    it("should load the user from the database", async () => {
        const edm = new EntitiesDataSource();
        try {
            await edm.initialize();
            const auth = await AuthLogic.passwordLogin(edm, "administrator@localhost", "Welcome123");
            expect(auth).toBeInstanceOf(AuthLogic);
        }
        catch(err) {
            console.error(err);
        }
        finally {
            await edm.destroy();
        }
    });
});