import { Entity, PrimaryColumn, Column } from "typeorm";
import { CopyInterface } from "common/src/tre/logic/CopyInterface";
import { PasswordDto } from "common/src/tre/models/PasswordDto";

@Entity("passwords")
export class PasswordEntity implements PasswordDto, CopyInterface<PasswordDto> {
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    @Column({ name: "users_guid" })
    public usersGuid: string = "";

    @Column({ name: "created" })
    public created: Date = new Date();

    @Column({ name: "salt" })
    public salt: string = "";

    @Column({ name: "hash" })
    public hash: string = "";

    @Column({ name: "iterations" })
    public iterations: number = 0;

    public copyFrom(source: PasswordDto): void {
        this.guid = source.guid;
        this.usersGuid = source.usersGuid;
        this.created = source.created;
        this.salt = source.salt;
        this.hash = source.hash;
        this.iterations = source.iterations;
    }

    public copyTo(dest: PasswordDto): void {
        dest.guid = this.guid;
        dest.usersGuid = this.usersGuid;
        dest.created = this.created;
        dest.salt = this.salt;
        dest.hash = this.hash;
        dest.iterations = this.iterations;
    }
}