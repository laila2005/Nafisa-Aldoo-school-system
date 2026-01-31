import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { User } from './User';

export class Settings extends Model {
  declare id: string;
  declare key: string;
  declare value: string | null;
  declare description: string | null;
  declare isSystem: boolean;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Settings.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.TEXT,
    },
    description: {
      type: DataTypes.TEXT,
    },
    isSystem: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_system',
    },
    updatedBy: {
      type: DataTypes.UUID,
      field: 'updated_by',
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'settings',
    timestamps: true,
    underscored: true,
  }
);

export default Settings;
