import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection.js';
import { User } from './User';

export class AuditLog extends Model {
  public id!: string;
  public userId?: string;
  public action!: string;
  public tableName!: string;
  public recordId?: string;
  public oldValues?: object;
  public newValues?: object;
  public ipAddress?: string;
  public userAgent?: string;
  public readonly createdAt!: Date;
}

AuditLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      field: 'user_id',
      references: {
        model: User,
        key: 'id',
      },
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    tableName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'table_name',
    },
    recordId: {
      type: DataTypes.UUID,
      field: 'record_id',
    },
    oldValues: {
      type: DataTypes.JSONB,
      field: 'old_values',
    },
    newValues: {
      type: DataTypes.JSONB,
      field: 'new_values',
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      field: 'ip_address',
    },
    userAgent: {
      type: DataTypes.TEXT,
      field: 'user_agent',
    },
  },
  {
    sequelize,
    tableName: 'audit_logs',
    timestamps: true,
    updatedAt: false,
    underscored: true,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['table_name'],
      },
      {
        fields: ['created_at'],
      },
    ],
  }
);

export default AuditLog;
