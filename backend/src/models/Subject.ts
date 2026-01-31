import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection.js';

export class Subject extends Model {
  declare id: string;
  declare name: string;
  declare code: string;
  declare description: string | null;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Subject.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    tableName: 'subjects',
    timestamps: true,
    underscored: true,
  }
);

export default Subject;
