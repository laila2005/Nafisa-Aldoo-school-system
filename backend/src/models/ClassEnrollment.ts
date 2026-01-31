import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { User } from './User';
import { ClassSection } from './ClassSection';
import { AcademicYear } from './AcademicYear';

export class ClassEnrollment extends Model {
  public id!: string;
  public studentId!: string;
  public classSectionId!: string;
  public academicYearId!: string;
  public enrollmentDate!: Date;
  public status!: 'ACTIVE' | 'DROPPED' | 'TRANSFERRED';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ClassEnrollment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'student_id',
      references: {
        model: User,
        key: 'id',
      },
    },
    classSectionId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'class_section_id',
      references: {
        model: ClassSection,
        key: 'id',
      },
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
    enrollmentDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      field: 'enrollment_date',
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'DROPPED', 'TRANSFERRED'),
      defaultValue: 'ACTIVE',
    },
  },
  {
    sequelize,
    tableName: 'class_enrollments',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['student_id', 'class_section_id', 'academic_year_id'],
      },
    ],
  }
);

export default ClassEnrollment;
