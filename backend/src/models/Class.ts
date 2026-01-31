import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import sequelize from '../config/database.js';
import { GradeLevel } from '../types/index.js';

interface ClassAttributes {
  id: number;
  className: string;
  gradeLevel: GradeLevel;
  section?: string;
  teacherId: number;
  roomNumber?: string;
  capacity?: number;
  academicYear: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ClassCreationAttributes extends Optional<ClassAttributes, 'id'> {}

class Class extends Model<ClassAttributes, ClassCreationAttributes> implements ClassAttributes {
  declare id: number;
  declare className: string;
  declare gradeLevel: GradeLevel;
  declare section?: string;
  declare teacherId: number;
  declare roomNumber?: string;
  declare capacity?: number;
  declare academicYear: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Class.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    className: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    gradeLevel: {
      type: DataTypes.ENUM(...Object.values(GradeLevel)),
      allowNull: false,
    },
    section: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teachers',
        key: 'id',
      },
    },
    roomNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    academicYear: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'classes',
    timestamps: true,
  }
);

export default Class;
