import express from 'express';
import { AuthentificationController } from '../controllers/auth.js';

export const signupRouter= express.Router();

signupRouter.get("/signup", (req, res) => {
  res.render("signup");
});


/**
 * @swagger
 * /signup:
 *   post:
 *     summary: User signup
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: 'mirko'
 *               password:
 *                 type: string
 *                 example: 'MIRKO'
 *               name:
 *                 type: string
 *                 example: 'mirko'
 *               surname:
 *                 type: string
 *                 example: 'mirko'
 *               email:
 *                 type: string
 *                 example: 'm.p@gmail.com'
 *     responses:
 *       200:
 *         description: Successfully registered user
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
 *                       example: 30
 *                     username:
 *                       type: string
 *                       example: '2'
 *                     password:
 *                       type: string
 *                       example: '4571f4c04205cce87bda02b544034ab309554f5d3a213e00ea582b35ed8ca556'
 *                     email:
 *                       type: string
 *                       example: 'M.P@GMAIL.COM'
 *                     surname:
 *                       type: string
 *                       example: '2'
 *                     name:
 *                       type: string
 *                       example: '1'
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-10-02T08:08:32.026Z'
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-10-02T08:08:32.026Z'
 *       401:
 *         description: Email or username already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Email already in use
 *       500:
 *         description: Could not save new user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Could not save new user
 */
signupRouter.post("/signup", async (req, res) => {
  console.log(req.body);
  try {
    const emailExists = await AuthentificationController.checkEmail(req, res);
    if (emailExists) {
      return res.status(401).json("Email already in use");
    }

    const usernameExists = await AuthentificationController.checkUsername(req, res);
    if (usernameExists) {
      return res.status(401).json("Username already in use");
    }

    const result = await AuthentificationController.saveUser(req, res);
    console.log(result);
    return res.json(result);
  } catch (error) {
    return res.status(500).json("Could not save new user");
  }
});
