import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { User } from './User';
import { Course } from './Course';

export class Grade extends Model {
  public id!: string;
  public studentId!: string;
  public courseId!: string;
  public category!: string;
  public score!: number;
  public maxScore!: number;
  public weight?: number;
  public comments?: string;
}

Grade.init(
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
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    maxScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    weight: {
      type: DataTypes.DECIMAL(5, 2),
    },
    comments: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: 'grades',
    timestamps: true,
  }
);

Grade.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
Grade.belongsTo(Course, { as: 'course', foreignKey: 'courseId' });

export default Grade;
