import { DataTypes } from "sequelize";

export function createModel(db) {
  const UserIdeaLike = db.define('UserIdeaLike', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    like: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    dislike: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ideaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }

  },
  {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'ideaId']
      }
    ],
    
  }
);

  
  return UserIdeaLike;
}