import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { User } from './User';
import { AcademicYear } from './AcademicYear';

export class FeePayment extends Model {
  public id!: string;
  public studentId!: string;
  public academicYearId!: string;
  public amount!: number;
  public feeType?: string;
  public dueDate?: Date;
  public paymentDate?: Date;
  public paymentMethod?: string;
  public transactionId?: string;
  public status!: 'PENDING' | 'PAID' | 'OVERDUE';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FeePayment.init(
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    feeType: {
      type: DataTypes.STRING(50),
      field: 'fee_type',
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      field: 'due_date',
    },
    paymentDate: {
      type: DataTypes.DATEONLY,
      field: 'payment_date',
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      field: 'payment_method',
    },
    transactionId: {
      type: DataTypes.STRING(100),
      field: 'transaction_id',
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'PAID', 'OVERDUE'),
      defaultValue: 'PENDING',
    },
  },
  {
    sequelize,
    tableName: 'fee_payments',
    timestamps: true,
    underscored: true,
  }
);

export default FeePayment;
