import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { AcademicYear } from './AcademicYear';
import { User } from './User';

export class ClassSection extends Model {
  public id!: string;
  public name!: string;
  public gradeLevel!: string;
  public academicYearId!: string;
  public classTeacherId?: string;
  public maxStudents!: number;
  public roomNumber?: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ClassSection.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    gradeLevel: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'grade_level',
    },
    academicYearId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'academic_year_id',
      references: {
        model: AcademicYear,
        key: 'id',
      },
    },
    classTeacherId: {
      type: DataTypes.UUID,
      field: 'class_teacher_id',
      references: {
        model: User,
        key: 'id',
      },
    },
    maxStudents: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
      field: 'max_students',
    },
    roomNumber: {
      type: DataTypes.STRING(50),
      field: 'room_number',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    tableName: 'class_sections',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['name', 'academic_year_id'],
      },
    ],
  }
);

export default ClassSection;
