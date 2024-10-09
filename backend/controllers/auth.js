import { User } from '../models/db.js';
import jwt from "jsonwebtoken";

export class AuthentificationController {
    
  static async validateLoginCredentials(req,res) {
    try {
      let checkUser = new User({ username: req.body.username, password: req.body.password });
      const userLogin = await AuthentificationController.getUserByCredentials(checkUser);
      return userLogin ? true : false;
    } catch (error) {
      console.error("An error occurred:", error);
      return false;
    }
  }
  
  static getUserByCredentials(checkUser) {
    return User.findOne({
      where: {
        username: checkUser.username,
        password: checkUser.password
      }
    });
  }


  static async checkUsername(req,res)
  {
    return User.findOne({
      where: {
        username: req.body.username
      }
    });
  }

  static async checkEmail(req, res)
  {
    return await User.findOne({
      where: {
        email: req.body.email
      }
    });
  }
    
      
  static async saveUser(req, res){
    
    let newUser = new User({
      username: req.body.username, 
      password: req.body.password,
      email: req.body.email,
      surname: req.body.surname,
      name: req.body.name
    });
    return await newUser.save({validator:true}); 
  }

  static issueToken(username){
    return jwt.sign({user:username}, process.env.TOKEN_SECRET, {expiresIn: `${24*60*60}s`});
  }

}