import { Table, Column, Model, Index, HasMany } from 'sequelize-typescript';
import Member from './Member';

@Table
export default class Rec extends Model {
    @Column @Index({ unique: true })
    name: string;

    @Column
    gridSegment: string; // inner structure not exposed

    @Column
    publicKey: string;

    @HasMany(() => Member)
    members: Member[]
}
