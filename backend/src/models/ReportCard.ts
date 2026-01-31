import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { User } from './User';
import { AcademicYear } from './AcademicYear';

export class ReportCard extends Model {
  public id!: string;
  public studentId!: string;
  public academicYearId!: string;
  public semester?: 'FALL' | 'SPRING' | 'SUMMER';
  public gpa?: number;
  public totalAttendancePercentage?: number;
  public generatedAt?: Date;
  public generatedBy?: string;
  public isPublished!: boolean;
  public publishedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ReportCard.init(
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
    academicYearId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'academic_year_id',
      references: {
        model: AcademicYear,
        key: 'id',
      },
    },
    semester: {
      type: DataTypes.ENUM('FALL', 'SPRING', 'SUMMER'),
    },
    gpa: {
      type: DataTypes.DECIMAL(3, 2),
    },
    totalAttendancePercentage: {
      type: DataTypes.DECIMAL(5, 2),
      field: 'total_attendance_percentage',
    },
    generatedAt: {
      type: DataTypes.DATE,
      field: 'generated_at',
    },
    generatedBy: {
      type: DataTypes.UUID,
      field: 'generated_by',
      references: {
        model: User,
        key: 'id',
      },
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_published',
    },
    publishedAt: {
      type: DataTypes.DATE,
      field: 'published_at',
    },
  },
  {
    sequelize,
    tableName: 'report_cards',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['student_id', 'academic_year_id', 'semester'],
      },
    ],
  }
);

export default ReportCard;
