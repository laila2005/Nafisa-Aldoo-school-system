import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';

export class User extends Model {
  public id!: string;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public role!: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
  public phone?: string;
  public profilePicture?: string;
  public isActive!: boolean;
  public lastLogin?: Date;

  // Additional fields
  public dateOfBirth?: Date;
  public gender?: string;
  public address?: string;
  public city?: string;
  public state?: string;
  public postalCode?: string;
  public country?: string;
  public profilePictureUrl?: string;
  public bio?: string;
  public employeeId?: string;
  public studentId?: string;
  public qualification?: string;
  public experienceYears?: number;
  public emergencyContactName?: string;
  public emergencyContactPhone?: string;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
