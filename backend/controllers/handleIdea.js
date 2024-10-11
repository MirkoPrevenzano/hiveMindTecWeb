import{Idea, UserCommentLike} from '../models/db.js';
import {User} from '../models/db.js';
import { UserIdeaLike } from '../models/db.js';
import { CommentController } from './handleComment.js';
import{Comment} from '../models/db.js';
import sequelize, { where } from 'sequelize';
export class IdeaController{


    static async saveIdea(req,res){

        const textWithoutHtml = this.removeHtmlTags(req.body.description);
        if (textWithoutHtml.length > 400) {
            throw new Error("The description is too long");
        }
        const idUser=await User.findOne({ where: { username: req.user.user } });
        let newIdea= new Idea({
            title: req.body.title,
            description: req.body.description,
            UserId: idUser.id
        });
        return newIdea.save({validator:true});
    }

    
    static async getAllIdeas(req,res){
        
        return Idea.findAll({
            include: [{
                model: User, 
                attributes: ['username'],
            }],

            attributes: {
                exclude: ['userId']
            }
        });
    }


    static async getAnyIdeas(req,res){
        
        let limitNumberOfIdeas = parseInt(req.query.limit);
        let currentPage = parseInt(req.query.page);
        let currentOffset = limit * (currentPage - 1);

        return Idea.findAll({
            include: [{
                model: User, 
                attributes: ['username'],
            }],

            attributes: {
                exclude: ['userId'] 
            },

            limit: limitNumberOfIdeas,
            offset: currentOffset,
            order: [['createdAt', 'DESC']] 
        });
            
    }
   
    
    static async getIdeaById(req,res){
        return await Idea.findOne( {
            include: [{
                model: User, 
                attributes: ['username'],
            }],

            attributes: {
                exclude: ['userId'], 
        
            },
            where:{
                id: req.params.id
            }
        });
    }


    static async getIdeaComments(req, res){return CommentController.getCommentIdeas(req,res);}


    
    static async deleteComment(req,res){
        let commentDestroy= CommentController.getCommentById(req,res);
        return await commentDestroy.destroy();
    }

   
    static async handleIdeaLike(req,res){
        
        let idea= await Idea.findByPk(req.body.id);
        const user = await User.findOne({where:{username:req.user.user}});
        let userIdeaLike= await UserIdeaLike.findOne({where:{userId:user.id,ideaId:idea.id}});

        
        
        if(userIdeaLike ){
            this.updateUserIdeaLike(userIdeaLike, idea);
        }
        else{
            userIdeaLike= new UserIdeaLike({
                like:true,
                userId:user.id,
                ideaId:idea.id
            });
            await userIdeaLike.save({validator:true});
            idea.like++;
        }

        return idea.save({validator:true});
        
    }


    static async  updateUserIdeaLike(userIdeaLike, idea) {
        if (!userIdeaLike.like) {
            userIdeaLike.like = true;
            if (userIdeaLike.dislike) {
                userIdeaLike.dislike = false;
                idea.dislike--;
            }
            idea.like++;
            await userIdeaLike.save({ validator: true });
        } else {
            userIdeaLike.like = false;
            idea.like--;
            await userIdeaLike.save({ validator: true });
        }
    }
   

    static async handleDislikeIdea(req, res){
        
        let idea= await Idea.findByPk(req.body.id);
        const user = await User.findOne({where:{username:req.user.user}});
        let userIdeaLike= await UserIdeaLike.findOne({where:{userId:user.id,ideaId:idea.id}});
        
        

        if(userIdeaLike){
            this.updateUserIdeaDislike(userIdeaLike, idea);
        }
        else{
            userIdeaLike= new UserIdeaLike({
                dislike:true,
                userId:user.id,
                ideaId:idea.id
            });
            await userIdeaLike.save({validator:true});
            idea.dislike++;
        }
        return  idea.save({validator:true});

    }
        
    


    static async  updateUserIdeaDislike(userIdeaLike, idea) {
        if(!userIdeaLike.dislike){
            userIdeaLike.dislike=true;
            if(userIdeaLike.like){
                userIdeaLike.like=false;
                idea.like--;
            }
            idea.dislike++;
            await userIdeaLike.save({validator:true});
        }
        else{
            userIdeaLike.dislike=false;
            idea.dislike--;
            await userIdeaLike.save({validator:true});
        }
    }


    static async handleLikeComment(req, res) {
       
            let comment = await Comment.findByPk(req.params.id);
            const user = await User.findOne({ where: { username: req.user.user } });
            let userCommentLike = await UserCommentLike.findOne({ where: { userId: user.id, commentId: comment.id } });
            
            if (userCommentLike) {
                userCommentLike.like = !userCommentLike.like;
                await userCommentLike.save({ validator: true });
                comment.like += userCommentLike.like ? 1 : -1;
            } else {
                userCommentLike = new UserCommentLike({
                    like: true,
                    userId: user.id,
                    commentId: comment.id
                });
                await userCommentLike.save({ validator: true });
                comment.like++;
            }
            return await comment.save({ validator: true });
        
    }


    


    static async deleteIdea(req, res) {
        
            let idea = await Idea.findByPk(req.params.id);
            const user = await User.findOne({ where: { username: req.user.user } });
            if (idea.UserId !== user.id) {
                throw new Error("You are not the owner of this idea");
            }

            await idea.destroy();
        
    }


    static async getIdeaMostPopular(req,res, order){
        
        let limitNumberOfIdeas = parseInt(req.query.limit);
        let currentPage = parseInt(req.query.page);
        let offsetIdeas = limitNumberOfIdeas * (currentPage - 1);
        let currentWeek = new Date();
        currentWeek.setDate(currentWeek.getDate() - 7); 
        return Idea.findAll({
            include: [{
                model: User, 
                attributes: ['username'],
            }],
            attributes: {
                exclude: ['userId'],
            },
            order: [
                [sequelize.literal('CAST("like" AS FLOAT) /  CASE WHEN "dislike" = 0 THEN 1 ELSE "dislike" END'), order]
            ],
            where: {
                createdAt: {
                    [sequelize.Op.gt]: currentWeek
                }
            },
            limit: limitNumberOfIdeas,
            offset: offsetIdeas
            

        });
        
    }


    static async getIdeaMostControversial(req, res) {
        
        let limitNumberOfIdeas = parseInt(req.query.limit)
        let currentPage = parseInt(req.query.page);
        let offsetIdeas = limitNumberOfIdeas * (currentPage - 1);

        let currentWeek = new Date();
        currentWeek.setDate(currentWeek.getDate() - 7);
        
        return Idea.findAll({
            include: [{
                model: User,
                attributes: ['username'],
            }],
            attributes: {
                exclude: ['userId'],       
            },
            order: [
                [sequelize.literal('ABS("like" - "dislike")'), 'ASC'],
            ],
            where: { 
                [sequelize.Op.or]: [
                    {
                        like: {
                            [sequelize.Op.gt]: 0
                        }
                    },
                    {
                        dislike: {
                            [sequelize.Op.gt]: 0
                        }
                    }
                ],
                createdAt: {
                    [sequelize.Op.gt]: currentWeek
                }
            },
            limit: limitNumberOfIdeas,
            offset: offsetIdeas
        });
        
    }


    static async getIdeasByUser(req,res){
    
         
        let user = await User.findOne({ where: { username: req.query.user } });
      
        let limitNumberOfIdeas = parseInt(req.query.limit);
        let currentPage = parseInt(req.query.page);
        let offsetIdeas = limitNumberOfIdeas * (currentPage - 1);
        return await Idea.findAll({
            where: {
              UserId: user.id
            },
            include: [{
                model: User, 
                attributes: ['username'],
            }],
            attributes: {
                exclude: ['userId']
            },
            limit: limitNumberOfIdeas,
            offset: offsetIdeas,
            order: [['createdAt', 'DESC']] 
        });
    }

    static async getIdeaCommentsCount(req, res){
        return Comment.count({
            where: {
                IdeaId: req.params.id
            }
        });
    }


    static async handleUpdateIdea(req,res){ 
        return this.updateIdea(req);
    }


    static async updateIdea(req){
        const textWithoutHtml = this.removeHtmlTags(req.query.description);
        if (textWithoutHtml.length > 400) {
            throw new Error("The description is too long");
        }
        let ideaUpdate= await Idea.findByPk(req.params.id);
        ideaUpdate.title=req.query.title;
        ideaUpdate.description=req.query.description;
        return ideaUpdate.save({validator:true});
    }
    

    static removeHtmlTags(text){ return text.replace(/<[^>]*>?/gm, ''); }
}