import express from 'express';
import { IdeaController } from '../controllers/handleIdea.js';
import { authVerification } from '../middleware/authentication.js';
import { CommentController } from '../controllers/handleComment.js';
import { UserController } from '../controllers/handleUser.js';
import { checkNotAuthor } from '../middleware/checLikeIdea.js';
export const ideaRouter = express.Router();

/**
 * @swagger
 * /idea:
 *   post:
 *     summary: Create a new idea
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the idea
 *                 example: 'New idea'
 *               description:
 *                 type: string
 *                 description: The description of the idea
 *                 example: '<p>My new idea</p>'
 *     responses:
 *       200:
 *         description: Successfully created a new idea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dataValues:
 *                   type: object
 *                   properties:
 *                     like:
 *                       type: integer
 *                     dislike:
 *                       type: integer
 *                     id:
 *                       type: integer        
 *                     title:
 *                       type: string
 *                       example: 'New idea'
 *                     description:
 *                       type: string
 *                       example: '<p>My new idea</p>'
 *                     UserId:
 *                       type: integer
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-10-01T18:35:38.072Z'
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-10-01T18:35:38.072Z'
 *       500:
 *         description: Could not save new idea
 */
ideaRouter.post("/idea",authVerification, (req,res) => {
    const maxLength = 400;
    const textWithoutHtml = IdeaController.removeHtmlTags(req.body.description);
    if(!textWithoutHtml || textWithoutHtml.length > maxLength || !req.body.title){
        return res.status(400).json("Invalid input. Please check your input and try again.");
    }
    IdeaController.saveIdea(req,res).then((result)=>{
        res.json(result);
    }).catch(()=>{
        res.status(500).json("Could not save new idea");
    })
});



/**
 * @swagger
 * /idea/{id}:
 *   get:
 *     summary: Get idea by id
 *     description: Get idea by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: The ID of the idea
 *     responses:
 *       200:
 *         description: Successfully retrieved the idea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dataValues:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                       example: 'New idea'
 *                     description:
 *                       type: string
 *                       example: '<p>My new idea</p>'
 *                     like:
 *                       type: integer
 *                     dislike:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-10-01T18:35:38.072Z'
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-10-01T18:35:38.072Z'
 *                     UserId:
 *                       type: integer
 *       404:
 *         description: Idea not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Idea not found
 *       500:
 *         description: Could not get idea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Could not get idea
 */
ideaRouter.get("/idea/:id",authVerification, (req,res) => {
    IdeaController.getIdeaById(req,res).then((result)=>{
        if(result)
            res.json(result);
        else
            res.status(404).json("Idea not found");
    }).catch(()=>{
        res.status(500).json("Could not get idea")
    })
});

/**
 * @swagger
 * /idea/user/{user}:
 *   get:
 *     summary: Get ideas by user
 *     description: Get ideas by user
 *     parameters:
 *       - in: path
 *         name: user
 *         required: true
 *         schema:
 *           type: string
 *           description: The username
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           description: The page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           description: The number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved the ideas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   dataValues:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                         example: 'New idea'
 *                       description:
 *                         type: string
 *                         example: '<p>My new idea</p>'
 *                       like:
 *                         type: integer
 *                       dislike:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-10-01T18:35:38.072Z'
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-10-01T18:35:38.072Z'
 *                       UserId:
 *                         type: integer
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Ideas not found
 *       500:
 *         description: Could not get ideas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Could not get ideas
 */
ideaRouter.get("/idea/user/:user", authVerification,(req,res) => {
    IdeaController.getIdeasByUser(req,res).then((result)=>{
        if(result)
            res.json(result);
        else
            res.status(404).json("User not found");
    }).catch(()=>{
        res.status(500).json("Could not get ideas");
    })
});

/**
 * @swagger
 * /idea/{id}/comments:
 *   get:
 *     summary: Get comments by idea
 *     description: Get comments by idea
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: The ID of the idea
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           description: The page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           description: The number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved the comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   dataValues:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       description:
 *                         type: string
 *                         example: 'new comment'
 *                       time:
 *                         type: string
 *                         format: date-time
 *                         example: '15:00:00'
 *                       like:
 *                         type: integer
 *                       date:
 *                         type: string
 *                         format: date-time
 *                          example: '2024-10-01'
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-10-01T18:35:38.072Z'
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-10-01T18:35:38.072Z'
 *                       IdeaId:
 *                         type: integer
 *                       UserId:
 *                         type: integer
 *       500:
 *         description: Could not get comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Could not get comments
 */

ideaRouter.get("/idea/:id/comments",authVerification, (req,res) => {
    IdeaController.getIdeaComments(req,res).then((result)=>{
        res.json(result);
    }).catch(()=>{
        res.status(500).json("Could not get comments");
    })
});

/**
 * @swagger
 * /idea/{id}/comments:
 *   post:
 *     summary: Save a comment for an idea
 *     description: Save a comment for an idea
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the idea to save comment
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdeaId:
 *                 type: integer
 *                 example: 59
 *               description:
 *                 type: string
 *                 example: 'prova'
 *               User:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                     example: 'anto'
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 example: '2024-10-01T18:35:38.072Z'
 *               like:
 *                 type: integer
 *                 example: 0
 *               username:
 *                 type: string
 *                 example: 'anto'
 *     responses:
 *       200:
 *         description: Return comment saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dataValues:
 *                   type: object
 *                   properties:
 *                     time:
 *                       type: string
 *                       format: date-time
 *                       example: '15:00:00'
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-10-01'
 *                     id:
 *                       type: integer
 *                     description:
 *                       type: string
 *                       example: 'new comment'
 *                     like:
 *                       type: integer
 *                     UserId:
 *                       type: integer
 *                     IdeaId:
 *                       type: integer
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-10-01T18:35:38.072Z'
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-10-01T18:35:38.072Z'
 *       500:
 *         description: Could not save comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Could not save comment
 */
ideaRouter.post("/idea/:id/comments", authVerification,(req,res) => {  
    CommentController.saveComment(req,res).then((result)=>{
        res.json(result);
    }).catch(()=>{
        res.status(500).json("Could not save comment");
    })
});


/**
 * @swagger
 * /idea/{id}/like:
 *   post:
 *     summary: Like an idea
 *     description: Like an idea by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the idea to like
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully liked the idea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dataValues:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                       example: 'idea'
 *                     description:
 *                       type: string
 *                       example: 'idea s description'
 *                     like:
 *                       type: integer
 *                     dislike:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-10-01T18:35:38.072Z'
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-10-01T18:35:38.072Z'
 *                     UserId:
 *                       type: integer
 *       500:
 *         description: Could not like idea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Could not like idea
 */
ideaRouter.post("/idea/:id/like", authVerification,checkNotAuthor,(req,res) => {
    IdeaController.handleIdeaLike(req,res).then((result)=>{
        res.json(result);
    }).catch(()=>{
        res.status(500).json("Could not like idea");
    })
});

/**
 * @swagger
 * /idea/{id}/dislike:
 *   post:
 *     summary: Dislike an idea
 *     description: Dislike an idea by ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 
 *     responses:
 *       200:
 *         description: Successfully disliked the idea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dataValues:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                       example: 'idea'
 *                     description:
 *                       type: string
 *                       example: 'idea s description'
 *                     like:
 *                       type: integer
 *                     dislike:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-10-01T18:35:38.072Z'
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-10-01T18:35:38.072Z' 
 *                     UserId:
 *                       type: integer
 *       500:
 *         description: Could not dislike idea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Could not dislike idea
 */
ideaRouter.post("/idea/:id/dislike", authVerification,checkNotAuthor,(req,res) => {
    IdeaController.handleDislikeIdea(req,res).then((result)=>{
        res.json(result);
    }).catch((err)=>{
        res.status(500).json("Could not dislike idea"+err);
    })
});


/**
 * @swagger
 * /idea/{id}/comment/{commentId}/like:
 *   post:
 *     summary: Like a comment on an idea
 *     description: Like a comment on an idea by ID
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: Numeric ID of the comment
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully liked the comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dataValues:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     description:
 *                       type: string
 *                       example: 'a comment'
 *                     time:
 *                       type: string
 *                       format: date-time
 *                       example: '15:00:00'
 *                     like:
 *                       type: integer
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-10-01'
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-10-01T18:35:38.072Z'
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-10-01T18:35:38.072Z'
 *                     IdeaId:
 *                       type: integer
 *                     UserId:
 *                       type: integer
 *       500:
 *         description: Could not like comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Could not like comment
 */
ideaRouter.post("/idea/:id/comment/:id/like", authVerification,(req,res) => {
    IdeaController.handleLikeComment(req,res).then((result)=>{
        res.json(result);
    }).catch(()=>{
        res.status(500).json("Could not like comment");
    })
});


/**
 * @swagger
 * /idea/{id}:
 *   delete:
 *     summary: Delete an idea
 *     description: Delete an idea by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the idea to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted the idea
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Idea deleted successfully
 *       500:
 *         description: Could not delete idea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Could not delete idea
 */
ideaRouter.delete("/idea/:id", authVerification,(req,res) => {
    IdeaController.deleteIdea(req,res).then(()=>{
        res.json(  "Idea deleted successfully" );     
    }).catch((err)=>{
        res.status(500).json("Could not delete idea."+err.message);
    })
});

/**
 * @swagger
 * /ideaMostPopular:
 *   get:
 *     summary: Get the most popular ideas
 *     description: Retrieve the most popular ideas with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           description: The page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           description: The number of items per page
 *     responses:
 *       200:
 *         description: A list of the most popular ideas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   dataValues:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                         example: 'an idea popular'
 *                       description:
 *                         type: string
 *                         example: '<p>My new idea popular</p>'
 *                       like:
 *                         type: integer
 *                       dislike:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-10-01T18:35:38.072Z'
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-10-01T18:35:38.072Z'
 *                       UserId:
 *                         type: integer
 *       500:
 *         description: Could not get ideas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Could not get ideas
 */
ideaRouter.get("/ideaMostPopular", authVerification,(req,res) => {
    IdeaController.getIdeaMostPopular(req,res, 'DESC').then((result)=>{
        res.json(result);
    }).catch(()=>{
        res.status(500).json("Could not get ideas");
    })
});

/**
 * @swagger
 * /ideaMostUnpopular:
 *   get:
 *     summary: Get the most unpopular ideas
 *     description: Retrieve the most unpopular ideas with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           description: The page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           description: The number of items per page
 *     responses:
 *       200:
 *         description: A list of the most unpopular ideas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   dataValues:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                         example: 'an idea unpopular'
 *                       description:
 *                         type: string
 *                         example: '<p>My new idea unpopular</p>'
 *                       like:
 *                         type: integer
 *                       dislike:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-10-01T18:35:38.072Z'
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-10-01T18:35:38.072Z'
 *                       UserId:
 *                         type: integer
 *       500:
 *         description: Could not get ideas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Could not get ideas
 */
ideaRouter.get("/ideaMostUnpopular", authVerification,(req,res) => {
    IdeaController.getIdeaMostPopular(req,res,'ASC').then((result)=>{
        res.json(result);
    }).catch(()=>{
        res.status(500).json("Could not get ideas");
    })
});

/**
 * @swagger
 * /ideaMostControversial:
 *   get:
 *     summary: Get the most controversial ideas
 *     description: Retrieve the most controversial ideas with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           description: The page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           description: The number of items per page
 *     responses:
 *       200:
 *         description: A list of the most controversial ideas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   dataValues:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                         example: 'an idea controversial'
 *                       description:
 *                         type: string
 *                         example: '<p>My new idea controversial</p>'
 *                       like:
 *                         type: integer
 *                       dislike:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-10-01T18:35:38.072Z'
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-10-01T18:35:38.072Z'
 *                       UserId:
 *                         type: integer
 *       500:
 *         description: Could not get ideas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Could not get ideas
 */
ideaRouter.get("/ideaMostControversial", authVerification, (req,res) => {
    
    IdeaController.getIdeaMostControversial(req,res).then((result)=>{
        res.json(result);
    }).catch(()=>{
        res.status(500).json("Could not get ideas");
    })
});

/**
 * @swagger
 * /idea/{id}/comments/count:
 *   get:
 *     summary: Get comments count by idea
 *     description: Retrieve the count of comments for a specific idea
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the idea to get comments count
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Return comments count by idea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *       404:
 *         description: Could not get comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                  type: string
 *                  example: Comments not found
 *       500:
 *         description: Could not get comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                  type: string
 *                  example: Could not get comments
 */
ideaRouter.get("/idea/:id/comments/count", authVerification,(req,res) => {
    IdeaController.getIdeaCommentsCount(req,res).then((count)=>{
        if(count!==undefined)
            res.json({count});
        else        
            res.status(404).json("Comments not found");
    }).catch(()=>{
        res.status(500).json("Could not get comments");
    })
});

/**
 * @swagger
 * /idea/{id}:
 *   put:
 *     summary: Update an idea
 *     description: Update an idea by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the idea to update
 *         schema:
 *           type: integer
 *       - in: query
 *         name: title
 *         required: true
 *         description: Title of the idea
 *         schema:
 *           type: string
 *           example: 'update idea'
 *       - in: query
 *         name: description
 *         required: true
 *         description: Description of the idea
 *         schema:
 *           type: string
 *           example: '<p>Buongiorno, c’è del nuovo. Spero la decisiva.Ciao alessio.Aggiornato. Aggiornatissimo. Aggiornamento</p><p></p><p></p>'
 *     responses:
 *       200:
 *         description: Successfully updated the idea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dataValues:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                       example: 'update idea'
 *                     description:
 *                       type: string
 *                       example: '<p>Update idea</p>'
 *                     like:
 *                       type: integer
 *                     dislike:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-10-01T18:35:38.072Z'
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-10-01T18:35:38.072Z'
 *                     UserId:
 *                       type: integer
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                  type: string
 *                  example: Invalid input. Please check your input and try again.
 *       500:
 *         description: Could not update idea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Could not update idea
 */
ideaRouter.put("/idea/:id", authVerification,(req,res) => {
    const maxLength = 400; 
    const textWithoutHtml = IdeaController.removeHtmlTags(req.query.description);
    
    if(!textWithoutHtml || textWithoutHtml.length > maxLength || !req.query.title){
        return res.status(400).json("Invalid input. Please check your input and try again.");
    }
    IdeaController.updateIdea(req,res).then((result)=>{
        res.json(result);   
    }).catch(()=>{
        res.status(500).json("Could not update idea");
    })
});

/**
 * @swagger
 * /idea/user/{username}/exists:
 *   get:
 *     summary: Check if a username exists
 *     description: Check if a username exists in the system
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Username to check
 *         schema:
 *           type: string
 *           example: anto
 *     responses:
 *       200:
 *         description: Username exists
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *       500:
 *         description: Could not check username
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Could not get user
 */
ideaRouter.get("/idea/user/:username/exists",authVerification, (req,res) => {
    UserController.isUsername(req, res)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message || "Could not get user" });
        });
});