import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/tre/logic/CopyInterface";
import { PromptDto } from "common/src/app/models/PromptDto";

/**
 * Entity representing a prompt in the database.
 */
@Entity('prompts')
export class PromptEntity implements PromptDto, CopyInterface<PromptDto> {
    /**
     * Unique identifier for the prompt.
     */
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    /**
     * Title of the prompt.
     */
    @Column({ name: 'title' })
    public title: string = "";

    /**
     * Input associated with the prompt.
     */
    @Column({ name: 'input' })
    public input: string = "";

    /**
     * JSON representation of the prompt.
     */
    @Column({ name: 'json' })
    public json: string = "";

    /**
     * Copies properties from the source PromptDto to this entity.
     * @param source - The source PromptDto to copy from.
     */
    public copyFrom(source: PromptDto): void {
        this.guid = source.guid;
        this.title = source.title;
        this.input = source.input;
        this.json = source.json;
    }

    /**
     * Copies properties from this entity to the destination PromptDto.
     * @param dest - The destination PromptDto to copy to.
     */
    public copyTo(dest: PromptDto): void {
        dest.guid = this.guid;
        dest.title = this.title;
        dest.input = this.input;
        dest.json = this.json;
    }
}
