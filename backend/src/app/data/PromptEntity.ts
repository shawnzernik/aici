import { Entity, PrimaryColumn, Column } from "typeorm";
import { CopyInterface } from "common/src/tre/logic/CopyInterface";
import { PromptDto } from "common/src/app/models/PromptDto";

@Entity("prompts")
export class PromptEntity implements PromptDto, CopyInterface<PromptDto> {

    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    @Column({ name: "title" })
    public title: string = "";

    @Column({ name: "input" })
    public input: string = "";

    @Column({ name: "json" })
    public json: string = "";

    public copyFrom(source: PromptDto): void {
        this.guid = source.guid;
        this.title = source.title;
        this.input = source.input;
        this.json = source.json;
    }

    public copyTo(dest: PromptDto): void {
        dest.guid = this.guid;
        dest.title = this.title;
        dest.input = this.input;
        dest.json = this.json;
    }
}