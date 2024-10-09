import {User} from '../models/db.js';
export class UserController{
    
    static async userByUsername(req,res){
        return await User.findOne({where:{username:req.user.user}});
    }

    static async isUsername(req,res){
       
        return new Promise((resolve, reject) => {
            const username = req.params.username;
            User.findOne({ where: { username: username } }).then((user) => {
                if (user) {
                  resolve(true);
                } else {
                  resolve(false);
                }
            });
                
                
        });
    }
          
}

