import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import sequelize from '../config/database.js';
import { Gender, GradeLevel } from '../types/index.js';

interface StudentAttributes {
  id: number;
  userId: number;
  studentId: string;
  gradeLevel: GradeLevel;
  gender: Gender;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  enrollmentDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface StudentCreationAttributes extends Optional<StudentAttributes, 'id'> {}

class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
  declare id: number;
  declare userId: number;
  declare studentId: string;
  declare gradeLevel: GradeLevel;
  declare gender: Gender;
  declare guardianName?: string;
  declare guardianPhone?: string;
  declare guardianEmail?: string;
  declare enrollmentDate: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Student.init(
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
    studentId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    gradeLevel: {
      type: DataTypes.ENUM(...Object.values(GradeLevel)),
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM(...Object.values(Gender)),
      allowNull: false,
    },
    guardianName: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    guardianPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    guardianEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    enrollmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'students',
    timestamps: true,
  }
);

export default Student;
