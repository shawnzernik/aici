import { UserDto } from "common/src/models/UserDto";
import { UUIDv4 } from "common/src/logic/UUIDv4";
import { PasswordDto } from "common/src/models/PasswordDto";
import { SecurableDto } from "common/src/models/SecurableDto";
import { EntitiesDataSource } from "../../data/EntitiesDataSource";
import { UserEntity } from "../../data/UserEntity";
import { AuthLogic } from "../../logic/AuthLogic";

jest.mock("../../data/EntitiesDataSource");

describe("AuthLogic", () => {
    let userDtoMock: UserDto;
    let userEntityMock: UserEntity;

    let passwordDtoMockWelcome123: PasswordDto;
    let passwordDtoMockWelcome1234: PasswordDto;

    let securableDtoArrayMock: SecurableDto[];

    let entitiesDataSourceMock: jest.Mocked<EntitiesDataSource>;

    beforeEach(() => {
        userDtoMock = {
            guid: UUIDv4.generate(),
            displayName: "System Administrator",
            emailAddress: "administrator@localhost",
            smsPhone: "999-555-1111"
        }
        userEntityMock = new UserEntity();
        userEntityMock.copyFrom(userDtoMock);

        passwordDtoMockWelcome123 = {
            "guid": "f3354b1d-09ca-4f9f-8877-85b7d85e3de5",
            "usersGuid": userDtoMock.guid,
            "created": new Date("2024-01-02T00:00:00"),
            "salt": "b5ee835f4493bffe7d21c4d628b17309988cd777b67b292b4e765cc47f9d8844",
            "hash": "da499d8e0d3b15e673c3f0431bef9971061592756eb73dab24d8986ff6ef0bbd0553ac787d2a88fc89af85a330ac549cdf392ed1c0d47e9a148c0b9807fe8b4a",
            "iterations": 100000
        };
        passwordDtoMockWelcome1234 = {
            "guid": "99873c86-7f06-42dd-b197-c30b7d6fd7d7",
            "usersGuid": userDtoMock.guid,
            "created": new Date("2024-01-01T00:00:00"),
            "salt": "0e4aa1368e23e8226beaa2091f326249b8347f3e4b7895159665ff1f61141700",
            "hash": "6f935102c7e3ed297616c9573145a9f7ecd2fce0519abce4dfc9a00ac7519b75d73b389ecdeb75cd8e3e271b15e9a80c91deed733025b62bb8efdcb4f97a9653",
            "iterations": 100000
        };

        securableDtoArrayMock = [
            { guid: "d291a1f1-2b60-4f3d-b81c-7d69b31460a0", displayName: "Group:List" },
            { guid: "83a42cfa-749b-4c9e-8e20-0b742cf516a3", displayName: "Group:Read" },
            { guid: "7b24f958-2187-4f9d-b5f8-4e965b16f35e", displayName: "Group:Save" },
            { guid: "a9c82447-69b2-4bcf-8e95-85f6b91ae685", displayName: "Group:Delete" },
            { guid: "b7eaf6ed-81c1-4418-9d47-2385b0c02bb8", displayName: "Membership:List" },
            { guid: "3e593b5b-4f48-4d60-89ec-254b3e29e68e", displayName: "Membership:Read" },
            { guid: "7d88b7e0-5d26-4b78-9020-c8b57c4ff48d", displayName: "Membership:Save" },
            { guid: "c0f3a998-4e38-4b3e-8c55-0eb1222a54d6", displayName: "Membership:Delete" },
            { guid: "485cbd10-5d1f-4c19-8b58-c76b1d6b514d", displayName: "Password:List" },
            { guid: "e28b8f82-7d0b-44d3-8c88-1337c7d12d96", displayName: "Password:Read" },
            { guid: "f97fb1f4-1848-4f8d-9e9b-3b8a10e5fb62", displayName: "Password:Save" },
            { guid: "1c7bcb4a-7c35-4e3e-815c-c4e3b4dc302e", displayName: "Password:Delete" },
            { guid: "ad61e5d3-9f4c-4d71-8d85-03e3ab0bdbdb", displayName: "Self:Password:List" },
            { guid: "d0939c2f-6af9-4a2c-bcf5-8fb2f5e0f23d", displayName: "Self:Password:Read" },
            { guid: "35f16b53-57d7-4070-86c4-8b431fa2d234", displayName: "Self:Password:Save" },
            { guid: "fcfb7bde-bcf3-4d74-835e-403e65b2cb14", displayName: "Self:Password:Delete" },
            { guid: "61a0c6b4-67f2-4a93-b9d6-9aafae7fefc0", displayName: "Permission:List" },
            { guid: "a084b47b-3b6b-4c15-b7da-bb0eb1b232f1", displayName: "Permission:Read" },
            { guid: "84b19a76-7f5b-47e3-9c82-cf2a6b5fcd2c", displayName: "Permission:Save" },
            { guid: "c53f736b-e6c5-4d2e-a9b0-30c087b5e89d", displayName: "Permission:Delete" },
            { guid: "4e71d587-8f9b-4413-888b-5e5f8d23d916", displayName: "Securable:List" },
            { guid: "ed8c5b48-3c28-4b12-93df-02d64b8a3d4c", displayName: "Securable:Read" },
            { guid: "6d5363f3-d7a3-4343-a0b0-4e1d6cb1b655", displayName: "Securable:Save" },
            { guid: "53b79625-d2e5-4c45-9c41-46f962f1c8cb", displayName: "Securable:Delete" },
            { guid: "4d6f2e58-62f9-497f-b56d-0f2182d3df31", displayName: "User:List" },
            { guid: "62e76a4e-b0b1-4680-8c9a-4f7a1d9d8c94", displayName: "User:Read" },
            { guid: "bdb78850-5ae7-4a39-b3ef-95e35b84e874", displayName: "User:Save" },
            { guid: "92e6c3e7-99df-4736-b1d5-03241e1e64a1", displayName: "User:Delete" },
            { guid: "5f38b156-82e5-4d3c-812c-e52b174789f8", displayName: "Self:User:List" },
            { guid: "22b1a14c-13ab-4c71-bd11-3d8ec4f3c5b5", displayName: "Self:User:Read" },
            { guid: "6c7b3df7-7a8e-4500-a5c1-6a4a09e735c2", displayName: "Self:User:Save" },
            { guid: "1c510776-14d0-42e5-8230-8e9a41dbd761", displayName: "Self:User:Delete" }
        ];

        entitiesDataSourceMock = new EntitiesDataSource() as jest.Mocked<EntitiesDataSource>;
        entitiesDataSourceMock.userRepository = jest.fn().mockReturnValue({
            findOneBy: jest.fn()
        }) as any;

        entitiesDataSourceMock.passwordRepository = jest.fn().mockReturnValue({
            findBy: jest.fn()
        }) as any;
    });


    describe("passwordLogin", () => {
        it("should throw an error when user is not found", async () => {
            (entitiesDataSourceMock.userRepository().findOneBy as jest.Mock).mockResolvedValue(null);

            try {
                const auth = await AuthLogic.passwordLogin(entitiesDataSourceMock, "invalid_user@localhost", "password");
            }
            catch (err) {
                expect((err as Error).message).toBe("Invalid login!");
            }
        });

        it("should throw an error when no passwords are found", async () => {
            (entitiesDataSourceMock.userRepository().findOneBy as jest.Mock).mockResolvedValue(userEntityMock);
            (entitiesDataSourceMock.passwordRepository().findBy as jest.Mock).mockResolvedValue([]);

            try {
                const auth = await AuthLogic.passwordLogin(entitiesDataSourceMock, "administrator@localhost", "password");
            }
            catch (err) {
                expect((err as Error).message).toBe("Invalid login!");
            }
        });

        it("should throw an error when the password is incorrect", async () => {
            (entitiesDataSourceMock.userRepository().findOneBy as jest.Mock).mockResolvedValue(userEntityMock);
            (entitiesDataSourceMock.passwordRepository().findBy as jest.Mock).mockResolvedValue([passwordDtoMockWelcome123]);

            try {
                const auth = await AuthLogic.passwordLogin(entitiesDataSourceMock, "administrator@localhost", "password");
            }
            catch (err) {
                expect((err as Error).message).toBe("Invalid login!");
            }
        });

        it("should return AuthLogic when the password is correct", async () => {
            (entitiesDataSourceMock.userRepository().findOneBy as jest.Mock).mockResolvedValue(userEntityMock);
            (entitiesDataSourceMock.passwordRepository().findBy as jest.Mock).mockResolvedValue([passwordDtoMockWelcome123]);

            jest.spyOn(AuthLogic as any, "loadAllowedSecurablesForUser").mockResolvedValue(securableDtoArrayMock);

            const auth = await AuthLogic.passwordLogin(entitiesDataSourceMock, "administrator@localhost", "Welcome123");

            expect(auth).toBeInstanceOf(AuthLogic);
            expect(auth.user).toEqual(userEntityMock);
            expect(auth.securables).toEqual(securableDtoArrayMock);
        });

        it("should return AuthLogic when the second password is correct", async () => {
            (entitiesDataSourceMock.userRepository().findOneBy as jest.Mock).mockResolvedValue(userEntityMock);
            (entitiesDataSourceMock.passwordRepository().findBy as jest.Mock).mockResolvedValue([
                passwordDtoMockWelcome1234,
                passwordDtoMockWelcome123
            ]);

            jest.spyOn(AuthLogic as any, "loadAllowedSecurablesForUser").mockResolvedValue(securableDtoArrayMock);

            const auth = await AuthLogic.passwordLogin(entitiesDataSourceMock, "administrator@localhost", "Welcome123");

            expect(auth).toBeInstanceOf(AuthLogic);
            expect(auth.user).toEqual(userEntityMock);
            expect(auth.securables).toEqual(securableDtoArrayMock);
        });

        it("should return AuthLogic when the first password is correct", async () => {
            (entitiesDataSourceMock.userRepository().findOneBy as jest.Mock).mockResolvedValue(userEntityMock);
            (entitiesDataSourceMock.passwordRepository().findBy as jest.Mock).mockResolvedValue([
                passwordDtoMockWelcome123,
                passwordDtoMockWelcome1234
            ]);

            jest.spyOn(AuthLogic as any, "loadAllowedSecurablesForUser").mockResolvedValue(securableDtoArrayMock);

            const auth = await AuthLogic.passwordLogin(entitiesDataSourceMock, "administrator@localhost", "Welcome123");

            expect(auth).toBeInstanceOf(AuthLogic);
            expect(auth.user).toEqual(userEntityMock);
            expect(auth.securables).toEqual(securableDtoArrayMock);
        });

        it("should throw an error when the token is invalid", async () => {
            try {
                const auth = await AuthLogic.tokenLogin("invalid_token");
            }
            catch (err) {
                expect((err as Error).message).toBe("Invalid token!");
            }
        });

        it("should return AuthLogic when the token is valid", async () => {
            (entitiesDataSourceMock.userRepository().findOneBy as jest.Mock).mockResolvedValue(userEntityMock);
            (entitiesDataSourceMock.passwordRepository().findBy as jest.Mock).mockResolvedValue([
                passwordDtoMockWelcome123,
                passwordDtoMockWelcome1234
            ]);

            jest.spyOn(AuthLogic as any, "loadAllowedSecurablesForUser").mockResolvedValue(securableDtoArrayMock);

            const auth = await AuthLogic.passwordLogin(entitiesDataSourceMock, "administrator@localhost", "Welcome123");
            const token = auth.tokenize();
            const newAuth = await AuthLogic.tokenLogin(token);

            expect(newAuth).toBeInstanceOf(AuthLogic);
            expect(newAuth.user).toEqual(auth.user);
            expect(newAuth.securables).toEqual(auth.securables);
        });
    });
});