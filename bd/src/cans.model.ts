import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({tableName: 'cans'})
export class Cans extends Model<Cans> {
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @Column({type: DataType.FLOAT, allowNull: false})
  latitude: number;

  @Column({type: DataType.FLOAT, allowNull: false})
  longitude: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  content: number;
}