import {Table, Column, Model, ForeignKey, BelongsTo, HasMany} from 'sequelize-typescript';
import Rec from './Rec';
import MeterPoint from './MeterPoint';

@Table
export default class Member extends Model {
    @Column
    metadata: string; // name, address... inner structure not (yet) exposed

    @Column
    gridSegment: string; // inner structure not exposed

    @Column
    publicKey: string;

    @ForeignKey(() => Rec)
    @Column
    recId: number;

    @BelongsTo(() => Rec)
    rec: Rec;

    @HasMany(() => MeterPoint)
    meterPoints: Member[];

    toString(): string {
        return `member ${this.metadata} in rec with id ${this.recId}, gridSegment ${this.gridSegment}`;
    }
}
