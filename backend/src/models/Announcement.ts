import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection.js';
import { User } from './User.js';

export class Announcement extends Model {
  public id!: string;
  public title!: string;
  public content!: string;
  public announcementType?: string;
  public targetRole?: string;
  public createdBy!: string;
  public isPublished!: boolean;
  public publishedAt?: Date;
  public expiresAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Announcement.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    announcementType: {
      type: DataTypes.STRING(50),
      field: 'announcement_type',
    },
    targetRole: {
      type: DataTypes.STRING(50),
      field: 'target_role',
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
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_published',
    },
    publishedAt: {
      type: DataTypes.DATE,
      field: 'published_at',
    },
    expiresAt: {
      type: DataTypes.DATE,
      field: 'expires_at',
    },
  },
  {
    sequelize,
    tableName: 'announcements',
    timestamps: true,
    underscored: true,
  }
);

export default Announcement;
