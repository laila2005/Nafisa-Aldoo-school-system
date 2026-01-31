import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection.js';
import { Assignment } from './Assignment.js';
import { User } from './User.js';

export class AssignmentSubmission extends Model {
  public id!: string;
  public assignmentId!: string;
  public studentId!: string;
  public submissionFileUrl?: string;
  public submissionText?: string;
  public submittedAt?: Date;
  public isLate!: boolean;
  public pointsEarned?: number;
  public feedback?: string;
  public gradedAt?: Date;
  public gradedBy?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AssignmentSubmission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    assignmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'assignment_id',
      references: {
        model: Assignment,
        key: 'id',
      },
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
    submissionFileUrl: {
      type: DataTypes.STRING(500),
      field: 'submission_file_url',
    },
    submissionText: {
      type: DataTypes.TEXT,
      field: 'submission_text',
    },
    submittedAt: {
      type: DataTypes.DATE,
      field: 'submitted_at',
    },
    isLate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_late',
    },
    pointsEarned: {
      type: DataTypes.DECIMAL(5, 2),
      field: 'points_earned',
    },
    feedback: {
      type: DataTypes.TEXT,
    },
    gradedAt: {
      type: DataTypes.DATE,
      field: 'graded_at',
    },
    gradedBy: {
      type: DataTypes.UUID,
      field: 'graded_by',
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'assignment_submissions',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['assignment_id', 'student_id'],
      },
    ],
  }
);

export default AssignmentSubmission;
