import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import sequelize from '../config/database.js';
import { EnrollmentStatus } from '../types/index.js';

interface EnrollmentAttributes {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: Date;
  status: EnrollmentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EnrollmentCreationAttributes extends Optional<EnrollmentAttributes, 'id' | 'enrollmentDate'> {}

class Enrollment extends Model<EnrollmentAttributes, EnrollmentCreationAttributes> implements EnrollmentAttributes {
  declare id: string;
  declare studentId: string;
  declare courseId: string;
  declare enrollmentDate: Date;
  declare status: EnrollmentStatus;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
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
    enrollmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(EnrollmentStatus)),
      allowNull: false,
      defaultValue: EnrollmentStatus.ACTIVE,
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

export default Enrollment;
