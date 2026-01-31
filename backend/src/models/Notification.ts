import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { User } from './User';

export class Notification extends Model {
  public id!: string;
  public userId!: string;
  public title!: string;
  public message!: string;
  public notificationType?: string;
  public relatedId?: string;
  public isRead!: boolean;
  public readAt?: Date;
  public readonly createdAt!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      references: {
        model: User,
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    notificationType: {
      type: DataTypes.STRING(50),
      field: 'notification_type',
    },
    relatedId: {
      type: DataTypes.UUID,
      field: 'related_id',
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_read',
    },
    readAt: {
      type: DataTypes.DATE,
      field: 'read_at',
    },
  },
  {
    sequelize,
    tableName: 'notifications',
    timestamps: true,
    updatedAt: false,
    underscored: true,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['is_read'],
      },
    ],
  }
);

export default Notification;
