import express from 'express';
import { AuthentificationController } from '../controllers/auth.js';

export const loginRouter=express.Router();

loginRouter.get("/login", (req, res) => {
  res.render("login");
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and return a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Invalid credentials
 *       500:
 *         description: An error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred
 */
loginRouter.post("/login", async (req, res) => {
  try {
    const usernameExists = await AuthentificationController.checkUsername(req, res);
    if (!usernameExists) {
      return res.status(401).json("There is no user with this username.");
    }

    const isCredentialsValid = await AuthentificationController.validateLoginCredentials(req, res);
    if (!isCredentialsValid) {
      return res.status(401).json("Invalid credentials");
    }

    const token = AuthentificationController.issueToken(req.body.username);
    return res.status(200).json(token);
    
  } catch (error) {
    return res.status(500).json("An error occurred");
  }
});
