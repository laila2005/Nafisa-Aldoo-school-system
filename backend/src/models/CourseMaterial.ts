import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection.js';
import { Course } from './Course.js';
import { User } from './User.js';

export class CourseMaterial extends Model {
  public id!: string;
  public courseId!: string;
  public title!: string;
  public description?: string;
  public materialType?: string;
  public fileUrl?: string;
  public fileSize?: number;
  public uploadedBy!: string;
  public weekNumber?: number;
  public isPublished!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CourseMaterial.init(
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
    materialType: {
      type: DataTypes.STRING(50),
      field: 'material_type',
    },
    fileUrl: {
      type: DataTypes.STRING(500),
      field: 'file_url',
    },
    fileSize: {
      type: DataTypes.INTEGER,
      field: 'file_size',
    },
    uploadedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'uploaded_by',
      references: {
        model: User,
        key: 'id',
      },
    },
    weekNumber: {
      type: DataTypes.INTEGER,
      field: 'week_number',
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_published',
    },
  },
  {
    sequelize,
    tableName: 'course_materials',
    timestamps: true,
    underscored: true,
  }
);

export default CourseMaterial;
