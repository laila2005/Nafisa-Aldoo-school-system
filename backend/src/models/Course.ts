import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { User } from './User';

export class Course extends Model {
  public id!: string;
  public name!: string;
  public code!: string;
  public description?: string;
  public gradeLevel?: string;
  public academicYear?: string;
  public semester?: 'FALL' | 'SPRING' | 'SUMMER';
  public teacherId!: string;
  public maxStudents?: number;
  public isActive!: boolean;
}

Course.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    gradeLevel: {
      type: DataTypes.STRING,
    },
    academicYear: {
      type: DataTypes.STRING,
    },
    semester: {
      type: DataTypes.ENUM('FALL', 'SPRING', 'SUMMER'),
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    maxStudents: {
      type: DataTypes.INTEGER,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'courses',
    timestamps: true,
  }
);

Course.belongsTo(User, { as: 'teacher', foreignKey: 'teacherId' });

export default Course;
