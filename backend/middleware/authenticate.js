const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');


const Authenticate = async (req,res,next) => {
   try {
      const token = req.cookies.jwtoken;
      if (!token) {
        throw new Error('No token provided');
      }
      const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
      const rootUser = await User.findOne({
        _id: verifyToken._id,
        'tokens.token': token,
      });
      if (!rootUser) {
        throw new Error('User not found');
      }
      req.token = token;
      req.rootUser = rootUser;
      req.userId = rootUser._id;
      next();
    } catch (error) {
      console.log(error);
      res.status(401).send({ error: 'Not authorized to access this resource' });
    }
}
 
module.exports = Authenticate