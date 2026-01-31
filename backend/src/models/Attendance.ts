import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { User } from './User';
import { Course } from './Course';

export class Attendance extends Model {
  public id!: string;
  public studentId!: string;
  public courseId!: string;
  public date!: string;
  public status!: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  public notes?: string;
}

Attendance.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Course,
        key: 'id',
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PRESENT', 'ABSENT', 'LATE', 'EXCUSED'),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: 'attendance',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['studentId', 'courseId', 'date'],
      },
    ],
  }
);

Attendance.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
Attendance.belongsTo(Course, { as: 'course', foreignKey: 'courseId' });

export default Attendance;
