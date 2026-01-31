import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import sequelize from '../config/database.js';

interface MessageAttributes {
  id: string;
  senderId: string;
  recipientId: string;
  subject: string;
  content: string;
  attachments?: string[];
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'isRead' | 'attachments'> {}

class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  declare id: string;
  declare senderId: string;
  declare recipientId: string;
  declare subject: string;
  declare content: string;
  declare attachments?: string[];
  declare isRead: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    recipientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    subject: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'messages',
    timestamps: true,
  }
);

export default Message;
