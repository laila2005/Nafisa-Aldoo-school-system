import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection.js';
import { User } from './User.js';

export class Event extends Model {
  public id!: string;
  public title!: string;
  public description?: string;
  public eventType?: string;
  public startDate!: Date;
  public endDate!: Date;
  public location?: string;
  public createdBy!: string;
  public isPublished!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    eventType: {
      type: DataTypes.STRING(50),
      field: 'event_type',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'end_date',
    },
    location: {
      type: DataTypes.STRING(255),
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'created_by',
      references: {
        model: User,
        key: 'id',
      },
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_published',
    },
  },
  {
    sequelize,
    tableName: 'events',
    timestamps: true,
    underscored: true,
  }
);

export default Event;
