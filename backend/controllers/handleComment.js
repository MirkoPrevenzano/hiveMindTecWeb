import { Comment, User, Idea } from '../models/db.js';
export class CommentController{
    
    static async getCommentIdeas(req,res){

        let limitNumberOfIdeas=parseInt(req.query.limit);
        let currentPage=parseInt(req.query.page);
        let offsetIdeas=limitNumberOfIdeas*(currentPage-1);

        return Comment.findAll({
            where: { IdeaId: req.params.id },
            include: [{
              model: User, 
              attributes: ['username'],
            }],
            attributes: {
              exclude: ['userId'] 
            }, order: [
                ['createdAt', 'DESC']
            ],
            limit:limitNumberOfIdeas,
            offset:offsetIdeas
        });  
    } 
  

    
    static async saveComment(req,res){
        
            const userComment = await User.findOne({ where: { username: req.body.username } });
            let idea= await Idea.findByPk(req.params.id);
            let newComment= new Comment({
                description: req.body.description,
                like: 0,
                UserId:userComment.id,
                IdeaId:req.body.ideaId
            });

            await newComment.save({validator:true});
            await idea.addComment(newComment);
            return newComment;
       
    }


    static async getCommentById(req,res){
        return await Comment.findByPk(req.params.id);
    }

    

}