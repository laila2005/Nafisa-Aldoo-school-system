import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import sequelize from '../config/database.js';
import { UserRole } from '../types/index.js';

interface UserAttributes {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  profilePicture?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'isActive' | 'lastLogin'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare email: string;
  declare password: string;
  declare firstName: string;
  declare lastName: string;
  declare role: UserRole;
  declare phone?: string;
  declare profilePicture?: string;
  declare isActive: boolean;
  declare lastLogin?: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
