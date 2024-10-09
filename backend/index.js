import express from 'express';
import { signupRouter } from './routes/signup.js';
import bodyParser from 'body-parser';
import { loginRouter } from './routes/login.js';
import{ideaRouter} from './routes/idea.js';
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import cors from "cors";
const app = express();
const PORT=3000;

const swaggerSpec = swaggerJSDoc({
    definition: {
      openapi: '3.1.0',
      info: {
        title: 'WEBTECH’S HIVEMIND PROJECT API',
        version: '1.0.0',
      },
    },
    apis: ['./routes/*.js'], 
  });
  
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(cors({ origin: 'http://localhost:4200' })); 


app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());


app.use(signupRouter);
app.use(loginRouter);
app.use(ideaRouter);


app.listen(PORT);



