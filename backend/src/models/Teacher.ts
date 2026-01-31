import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import sequelize from '../config/database.js';

interface TeacherAttributes {
  id: number;
  userId: number;
  employeeId: string;
  department?: string;
  specialization?: string;
  hireDate: Date;
  salary?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TeacherCreationAttributes extends Optional<TeacherAttributes, 'id'> {}

class Teacher extends Model<TeacherAttributes, TeacherCreationAttributes> implements TeacherAttributes {
  declare id: number;
  declare userId: number;
  declare employeeId: string;
  declare department?: string;
  declare specialization?: string;
  declare hireDate: Date;
  declare salary?: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Teacher.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    employeeId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    specialization: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    hireDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'teachers',
    timestamps: true,
  }
);

export default Teacher;
