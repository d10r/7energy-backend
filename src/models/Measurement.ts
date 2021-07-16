import { Table, Column, Model, ForeignKey, BelongsTo, AllowNull } from 'sequelize-typescript';
import MeterPoint from './MeterPoint';

@Table
export default class Measurement extends Model {
    @Column
    timestamp: number; // UTC timestamp

    // TODO: force non-null: */ @AllowNull(false)*/

    @AllowNull(false)
    @Column
    value: number; // the actual measurement

    @Column
    signature: string; // cryptographic signature over the payload

    @ForeignKey(() => MeterPoint)
    @Column
    meterPointId: number

    @BelongsTo(() => MeterPoint)
    meterPoint: MeterPoint

/*
    checkSignature () {
        // ...
    }
 */

    toString(): string {
        return `measurement with timestamp ${this.timestamp}, value ${this.value} of meter point with id ${this.meterPointId}`;
    }
}
