import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import sequelize from '../config/database.js';
import { UserRole } from '../types/index.js';

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'isActive'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare email: string;
  declare password: string;
  declare firstName: string;
  declare lastName: string;
  declare role: UserRole;
  declare phoneNumber?: string;
  declare address?: string;
  declare dateOfBirth?: Date;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
