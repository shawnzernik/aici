import { Entity, PrimaryColumn, Column } from "typeorm";
import { CopyInterface } from "common/src/tre/logic/CopyInterface";
import { LogDto } from "common/src/tre/models/LogDto";

@Entity("logs")
export class LogEntity implements LogDto, CopyInterface<LogDto> {
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    @Column({ name: "order", type: "bigint", generated: "increment" })
    public order?: number;

    @Column({ name: "corelation" })
    public corelation: string = "";

    @Column({ name: "epoch" })
    public epoch: string = "";

    @Column({ name: "level" })
    public level: string = "";

    @Column({ name: "caller" })
    public caller: string = "";

    @Column({ name: "message" })
    public message?: string = "";

    public copyFrom(source: LogDto): void {
        this.guid = source.guid;
        this.order = source.order;
        this.corelation = source.corelation;
        this.epoch = source.epoch;
        this.level = source.level;
        this.caller = source.caller;
        this.message = source.message;
    }

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