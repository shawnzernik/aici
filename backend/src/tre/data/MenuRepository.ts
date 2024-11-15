import { DataSource, Repository } from "typeorm";
import { MenuEntity } from "./MenuEntity";

export class MenuRepository extends Repository<MenuEntity> {
    public constructor(ds: DataSource) {
        super(MenuEntity, ds.createEntityManager(), ds.createQueryRunner());
    }
}