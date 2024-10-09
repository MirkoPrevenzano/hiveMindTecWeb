import { DataTypes } from "sequelize";
export function createModel(db) {
    const UserCommentLike = db.define('UserCommentLike', {
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
        userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        },
        commentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        }
    },
    {
        indexes: [
        {
            unique: true,
            fields: ['userId', 'commentId']
        }
        ]
    }
    );
    
    return UserCommentLike;
    }

