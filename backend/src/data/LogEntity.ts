import { Entity, PrimaryColumn, Column } from "typeorm";
import { CopyInterface } from "common/src/logic/CopyInterface";
import { LogDto } from "common/src/models/LogDto";

/**
 * Represents a log entity in the database.
 * Implements the LogDto interface and the CopyInterface for copying data.
 */
@Entity("logs")
export class LogEntity implements LogDto, CopyInterface<LogDto> {
    /**
     * The unique identifier for the log entry.
     */
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    /**
     * The order number of the log entry, auto-incremented by the database.
     */
    @Column({ name: "order", type: "bigint", generated: "increment" })
    public order?: number;

    /**
     * The correlation ID associated with the log entry.
     */
    @Column({ name: "corelation" })
    public corelation: string = "";

    /**
     * The epoch time when the log entry was created.
     */
    @Column({ name: "epoch" })
    public epoch: string = "";

    /**
     * The level of the log entry (e.g., info, warning, error).
     */
    @Column({ name: "level" })
    public level: string = "";

    /**
     * The caller or source of the log entry.
     */
    @Column({ name: "caller" })
    public caller: string = "";

    /**
     * The message of the log entry.
     */
    @Column({ name: "message" })
    public message?: string = "";

    /**
     * Copies data from the provided LogDto source to this entity.
     * @param source - The source LogDto object to copy data from.
     */
    public copyFrom(source: LogDto): void {
        this.guid = source.guid;
        this.order = source.order;
        this.corelation = source.corelation;
        this.epoch = source.epoch;
        this.level = source.level;
        this.caller = source.caller;
        this.message = source.message;
    }

    /**
     * Copies data from this entity to the provided LogDto destination.
     * @param dest - The destination LogDto object to copy data to.
     */
    public copyTo(dest: LogDto): void {
        dest.guid = this.guid;
        dest.order = this.order;
        dest.corelation = this.corelation;
        dest.epoch = this.epoch;
        dest.level = this.level;
        dest.caller = this.caller;
        dest.message = this.message;
    }
}