import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { User } from './User';
import { Course } from './Course';

export class Enrollment extends Model {
  public id!: string;
  public studentId!: string;
  public courseId!: string;
  public status!: 'ACTIVE' | 'DROPPED' | 'COMPLETED';
}

Enrollment.init(
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
    status: {
      type: DataTypes.ENUM('ACTIVE', 'DROPPED', 'COMPLETED'),
      defaultValue: 'ACTIVE',
    },
  },
  {
    sequelize,
    tableName: 'enrollments',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['studentId', 'courseId'],
      },
    ],
  }
);

Enrollment.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
Enrollment.belongsTo(Course, { as: 'course', foreignKey: 'courseId' });

export default Enrollment;
