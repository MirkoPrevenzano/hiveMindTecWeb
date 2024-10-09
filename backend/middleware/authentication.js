
import jwt from 'jsonwebtoken';
export  function authVerification(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json("Token not found" );
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET); 
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({message:"Access denied!", error:error.toString() });
  }
};