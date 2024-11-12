import express from "express";
import { Logger } from "./tre/Logger";
import { WebApp } from "./tre/WebApp";
import { AiciService } from "./app/services/AiciService";
import { DatasetService } from "./app/services/DatasetService";
import { FinetuneService } from "./app/services/FinetuneService";
import { PromptService } from "./app/services/PromptService";
import { AuthService } from "./tre/services/AuthService";
import { GroupService } from "./tre/services/GroupService";
import { ListFilterService } from "./tre/services/ListFilterService";
import { ListService } from "./tre/services/ListService";
import { MembershipService } from "./tre/services/MembershipService";
import { MenuService } from "./tre/services/MenusService";
import { PasswordService } from "./tre/services/PasswordService";
import { PermissionService } from "./tre/services/PermissionService";
import { SecurableService } from "./tre/services/SecurableService";
import { SettingService } from "./tre/services/SettingService";
import { UserService } from "./tre/services/UserService";

const app = new WebApp((logger: Logger, app: express.Express) => {
    new AuthService(logger, app);
    new GroupService(logger, app);
    new MembershipService(logger, app);
    new PasswordService(logger, app);
    new PermissionService(logger, app);
    new SecurableService(logger, app);
    new UserService(logger, app);
    new MenuService(logger, app);
    new ListService(logger, app);
    new ListFilterService(logger, app);
    new SettingService(logger, app);

    // add app routes here
    new AiciService(logger, app);
    new DatasetService(logger, app);
    new FinetuneService(logger, app);
    new PromptService(logger, app);

});
app.execute();
