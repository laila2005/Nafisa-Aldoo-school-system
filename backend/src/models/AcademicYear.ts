import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';

export class AcademicYear extends Model {
  declare id: string;
  declare name: string;
  declare startDate: Date;
  declare endDate: Date;
  declare isCurrent: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

AcademicYear.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'end_date',
    },
    isCurrent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_current',
    },
  },
  {
    sequelize,
    tableName: 'academic_years',
    timestamps: true,
    underscored: true,
  }
);

export default AcademicYear;
