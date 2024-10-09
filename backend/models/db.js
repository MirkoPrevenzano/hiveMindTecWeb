import Sequelize from 'sequelize';
import { createModel as createUserModel } from "./user.js";
import { createModel as createIdeaModel } from "./idea.js";
import {createModel as createCommentModel} from "./comment.js";
import {createModel as createUserIdeaLikeModel} from "./userIdeaLike.js";
import{createModel as createUserCommentLikeModel} from "./userCommentLike.js";
import 'dotenv/config.js';

export const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "postgres",
});

createUserModel(db);
createIdeaModel(db);
createCommentModel(db); 
createUserIdeaLikeModel(db);
createUserCommentLikeModel(db);

export const {User, Comment, Idea, UserIdeaLike, UserCommentLike} = db.models;

User.Idea=User.hasMany(Idea);
Idea.hasMany(Comment, {onDelete: 'CASCADE'});
User.hasMany(Comment);
Comment.belongsTo(User);
Idea.belongsTo(User);
UserIdeaLike.belongsTo(User, { foreignKey: 'userId' });
UserIdeaLike.belongsTo(Idea, { foreignKey: 'ideaId', onDelete: 'CASCADE'});
UserCommentLike.belongsTo(User, { foreignKey: 'userId' });
UserCommentLike.belongsTo(Comment, { foreignKey: 'commentId', onDelete: 'CASCADE'});
UserIdeaLike.addHook('afterSave', async (userIdeaLike, options) => {
  if (!userIdeaLike.like && !userIdeaLike.dislike) {
    await userIdeaLike.destroy();
  }
});
UserCommentLike.addHook('afterSave', async (userCommentLike, options) => {
  if (!userCommentLike.like) {
    await userCommentLike.destroy();
  }
});


db.sync({ alter: true }).then( () => {
  console.log("Database synced correctly");
}).catch( err => {
  console.log("Error with database synchronization: " + err.message);
});

