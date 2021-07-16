import {Table, Column, Model, ForeignKey, BelongsTo, HasMany, Index} from 'sequelize-typescript';
import Member from './Member';
import Measurement from './Measurement';

@Table
export default class MeterPoint extends Model {
    @Column
    metadata: string; // inner structure not (yet) exposed

    @Column
    publicKey: string;

    @Column @Index({ unique: true })
    mqttTopic: string;

    @ForeignKey(() => Member)
    @Column
    memberId: number

    @BelongsTo(() => Member)
    member: Member

    @HasMany(() => Measurement)
    measurements: Measurement[]


    toString(): string {
        return `meter point ${this.metadata} for member with id ${this.memberId}`;
    }
}
