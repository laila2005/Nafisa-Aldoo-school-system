import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/connection';

interface SchoolAttributes {
  id: string;
  name: string;
  nameAr: string | null;
  code: string; // Unique identifier for the school
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo: string | null;
  subscriptionStatus: 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'EXPIRED';
  subscriptionPlan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  subscriptionStartDate: Date | null;
  subscriptionEndDate: Date | null;
  maxStudents: number;
  maxTeachers: number;
  maxStorage: number; // in MB
  settings: Record<string, any> | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SchoolCreationAttributes extends Optional<SchoolAttributes, 'id' | 'nameAr' | 'address' | 'phone' | 'email' | 'website' | 'logo' | 'subscriptionStartDate' | 'subscriptionEndDate' | 'settings'> {}

class School extends Model<SchoolAttributes, SchoolCreationAttributes> implements SchoolAttributes {
  declare id: string;
  declare name: string;
  declare nameAr: string | null;
  declare code: string;
  declare address: string | null;
  declare phone: string | null;
  declare email: string | null;
  declare website: string | null;
  declare logo: string | null;
  declare subscriptionStatus: 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'EXPIRED';
  declare subscriptionPlan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  declare subscriptionStartDate: Date | null;
  declare subscriptionEndDate: Date | null;
  declare maxStudents: number;
  declare maxTeachers: number;
  declare maxStorage: number;
  declare settings: Record<string, any> | null;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

School.init(
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
    nameAr: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subscriptionStatus: {
      type: DataTypes.ENUM('ACTIVE', 'SUSPENDED', 'TRIAL', 'EXPIRED'),
      allowNull: false,
      defaultValue: 'TRIAL',
    },
    subscriptionPlan: {
      type: DataTypes.ENUM('FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE'),
      allowNull: false,
      defaultValue: 'FREE',
    },
    subscriptionStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    subscriptionEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    maxStudents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50,
    },
    maxTeachers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    maxStorage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1000, // 1GB in MB
    },
    settings: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'schools',
    timestamps: true,
    underscored: true,
  }
);

export default School;
