import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import sequelize from '../config/database.js';
import { AttendanceStatus } from '../types/index.js';

interface AttendanceAttributes {
  id: string;
  studentId: string;
  courseId: string;
  date: Date;
  status: AttendanceStatus;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AttendanceCreationAttributes extends Optional<AttendanceAttributes, 'id'> {}

class Attendance extends Model<AttendanceAttributes, AttendanceCreationAttributes> implements AttendanceAttributes {
  declare id: string;
  declare studentId: string;
  declare courseId: string;
  declare date: Date;
  declare status: AttendanceStatus;
  declare notes?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
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
        model: 'users',
        key: 'id',
      },
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id',
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(AttendanceStatus)),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
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

export default Attendance;
