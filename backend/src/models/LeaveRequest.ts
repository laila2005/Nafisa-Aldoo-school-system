import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { User } from './User';

export class LeaveRequest extends Model {
  public id!: string;
  public userId!: string;
  public leaveType?: string;
  public startDate!: Date;
  public endDate!: Date;
  public reason?: string;
  public status!: 'PENDING' | 'APPROVED' | 'REJECTED';
  public approvedBy?: string;
  public approvalDate?: Date;
  public comments?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

LeaveRequest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      references: {
        model: User,
        key: 'id',
      },
    },
    leaveType: {
      type: DataTypes.STRING(50),
      field: 'leave_type',
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
    reason: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      defaultValue: 'PENDING',
    },
    approvedBy: {
      type: DataTypes.UUID,
      field: 'approved_by',
      references: {
        model: User,
        key: 'id',
      },
    },
    approvalDate: {
      type: DataTypes.DATE,
      field: 'approval_date',
    },
    comments: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: 'leave_requests',
    timestamps: true,
    underscored: true,
  }
);

export default LeaveRequest;
