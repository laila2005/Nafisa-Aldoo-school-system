import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import sequelize from '../config/database.js';
import { Semester } from '../types/index.js';

interface CourseAttributes {
  id: string;
  name: string;
  code: string;
  description?: string;
  gradeLevel: string;
  academicYear: string;
  semester: Semester;
  teacherId: string;
  maxStudents: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CourseCreationAttributes extends Optional<CourseAttributes, 'id' | 'isActive'> {}

class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  declare id: string;
  declare name: string;
  declare code: string;
  declare description?: string;
  declare gradeLevel: string;
  declare academicYear: string;
  declare semester: Semester;
  declare teacherId: string;
  declare maxStudents: number;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Course.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    gradeLevel: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    academicYear: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    semester: {
      type: DataTypes.ENUM(...Object.values(Semester)),
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    maxStudents: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

export default Course;
