import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';

export class User extends Model {
  declare id: string;
  declare schoolId: string;
  declare email: string;
  declare password: string;
  declare firstName: string;
  declare lastName: string;
  declare role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
  declare phone: string;
  declare profilePicture: string;
  declare isActive: boolean;
  declare lastLogin: Date;

  // Additional fields
  declare dateOfBirth: Date;
  declare gender: string;
  declare address: string;
  declare city: string;
  declare state: string;
  declare postalCode: string;
  declare country: string;
  declare profilePictureUrl: string;
  declare bio: string;
  declare employeeId: string;
  declare studentId: string;
  declare qualification: string;
  declare experienceYears: number;
  declare emergencyContactName: string;
  declare emergencyContactPhone: string;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    schoolId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'school_id',
      references: {
        model: 'schools',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'TEACHER', 'STUDENT', 'PARENT'),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
    profilePicture: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
    },
    gender: {
      type: DataTypes.STRING(20),
    },
    address: {
      type: DataTypes.TEXT,
    },
    city: {
      type: DataTypes.STRING(100),
    },
    state: {
      type: DataTypes.STRING(100),
    },
    postalCode: {
      type: DataTypes.STRING(20),
    },
    country: {
      type: DataTypes.STRING(100),
    },
    profilePictureUrl: {
      type: DataTypes.STRING(500),
    },
    bio: {
      type: DataTypes.TEXT,
    },
    employeeId: {
      type: DataTypes.STRING(50),
    },
    studentId: {
      type: DataTypes.STRING(50),
    },
    qualification: {
      type: DataTypes.STRING(255),
    },
    experienceYears: {
      type: DataTypes.INTEGER,
    },
    emergencyContactName: {
      type: DataTypes.STRING(100),
    },
    emergencyContactPhone: {
      type: DataTypes.STRING(20),
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
