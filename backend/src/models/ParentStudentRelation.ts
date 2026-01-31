import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection.js';
import { User } from './User.js';

export class ParentStudentRelation extends Model {
  public id!: string;
  public parentId!: string;
  public studentId!: string;
  public relationship!: 'FATHER' | 'MOTHER' | 'GUARDIAN' | 'OTHER';
  public isPrimaryContact!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ParentStudentRelation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'parent_id',
      references: {
        model: User,
        key: 'id',
      },
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'student_id',
      references: {
        model: User,
        key: 'id',
      },
    },
    relationship: {
      type: DataTypes.ENUM('FATHER', 'MOTHER', 'GUARDIAN', 'OTHER'),
      allowNull: false,
    },
    isPrimaryContact: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_primary_contact',
    },
  },
  {
    sequelize,
    tableName: 'parent_student_relations',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['parent_id', 'student_id'],
      },
    ],
  }
);

export default ParentStudentRelation;
