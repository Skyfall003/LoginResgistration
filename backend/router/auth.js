const express = require("express");
const router = express.Router();
const connectDb = require("../db");
const User = require("../models/userSchema");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const cookieParser = require('cookie-parser');

router.use(express.json());
router.use(cookieParser());

router.get("/about", authenticate, (req, res) => {
  res.send(req.rootUser);
});

router.get("/getdata", authenticate, (req, res) => {
  res.send(req.rootUser);
});

router.get('/logout', (req,res) => {
  res.clearCookie('jwtoken', {path: '/'})
  res.status(200).send('user logout')
})

router.post('/contact', authenticate, async (req,res) => {
  try {
    const {name, email, phone, message} = req.body;

    const userContact = await User.findOne({_id: req.userId});

    if(userContact){
      const userMessage = await userContact.addMessage(name, email, phone, message);

      await userContact.save();

      res.status(201).json({message: "contacted successfully"});
    }
  } catch (error) {
    console.log(error)
  }
})

router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.json({ message: "User already exist" });
    } else if (password != cpassword) {
      return res.json({ message: "password is not matching" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });

      const token = await user.generateAuthToken();

      await user.save();

      res.json({ message: 'User register successfully', token });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (user) {
      const isMatched = await bcrypt.compare(password, user.password);

      if (!isMatched) {
        res.json({ message: "Invalid Crendentials p" });
      } else {
        const token = await user.generateAuthToken();

        res.cookie('jwtoken',token, {
          expires: new Date(Date.now() + 100000),
          httpOnly: true
        })
        res.json({ message: "User signin Sucessfully", token });
      }
    } else {
      res.json({ message: "Invalid Crendentials u" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
