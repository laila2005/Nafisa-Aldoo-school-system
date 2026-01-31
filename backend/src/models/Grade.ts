import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import sequelize from '../config/database.js';
import { GradeCategory } from '../types/index.js';

interface GradeAttributes {
  id: string;
  studentId: string;
  courseId: string;
  category: GradeCategory;
  score: number;
  maxScore: number;
  weight: number;
  comments?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface GradeCreationAttributes extends Optional<GradeAttributes, 'id'> {}

class Grade extends Model<GradeAttributes, GradeCreationAttributes> implements GradeAttributes {
  declare id: string;
  declare studentId: string;
  declare courseId: string;
  declare category: GradeCategory;
  declare score: number;
  declare maxScore: number;
  declare weight: number;
  declare comments?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
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
    category: {
      type: DataTypes.ENUM(...Object.values(GradeCategory)),
      allowNull: false,
    },
    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    maxScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'grades',
    timestamps: true,
  }
);

export default Grade;
