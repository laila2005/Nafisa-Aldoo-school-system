import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { Course } from './Course';
import { User } from './User';

export class Assignment extends Model {
  public id!: string;
  public courseId!: string;
  public title!: string;
  public description?: string;
  public dueDate!: Date;
  public totalPoints!: number;
  public createdBy!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Assignment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'course_id',
      references: {
        model: Course,
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'due_date',
    },
    totalPoints: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 100,
      field: 'total_points',
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'created_by',
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'assignments',
    timestamps: true,
    underscored: true,
  }
);

export default Assignment;
