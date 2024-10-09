import {User,Idea} from '../models/db.js';
export async function checkNotAuthor (req, res, next)  {
    try {
        const ideaId = req.body.id;

        const idea = await Idea.findByPk(ideaId);
        const user= await User.findOne({where:{username:req.user.user}});
        if (!idea) {
            return res.status(404).json("Idea not found");
        }

        if (idea.UserId === user.id) {
            return res.status(403).json("You cannot like your own idea");
        }

        next();
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};