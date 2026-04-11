const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");


exports.postLogin = async (req, res, next) => {
  const validationErrors = {};
  if (!validator.isEmail(req.body.email))
    validationErrors.emailMsg = "Please enter a valid email address.";
  if (validator.isEmpty(req.body.password))
    validationErrors.passwordMsg =  "Password cannot be blank." ;

  if (Object.keys(validationErrors).length) {
    return res.status(400).json(validationErrors);
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  try{
    const { user, info } = await new Promise((resolve, reject) => {
      passport.authenticate("local", (err, user, info) => {
        if (err) return reject(err);
        resolve({ user, info });
      })(req, res, next);
    });
      if (!user) {;
        return res.status(401).json({info: info, user:null});
      }
        
      await new Promise ((resolve, reject) => {
        req.logIn(user, (err) => {
            if (err) reject(err);
            else resolve();
        });
      });
        
      res.status(200).json({user: req.user});  
  } catch (err){
    return next(err);
  };
};

exports.logout = async (req, res) => {
  try{
    await new Promise((resolve, reject) => {
      req.logout((err) =>{
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('User has logged out.');
    
    await new Promise ((resolve, reject) =>{
      req.session.destroy((err)=> {
        if (err) reject(err);
        else resolve();
      });
    });
    req.user = null;
    res.status(200).json({user:null});
  } catch (err) {
    console.log("Error : Failed to destroy the session during logout.", err);
  }
};


exports.postSignup = async (req, res, next) => {
  const validationErrors = {};
  if (!validator.isEmail(req.body.email))
    validationErrors.emailMsg= "Please enter a valid email address.";
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.passLengthMsg= "Password must be at least 8 characters long";
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.passConfirmMsg= "Passwords do not match";
  if (validator.isEmpty(req.body.userName))
    validationErrors.UNMsg =  "User Name cannot be blank." ;

  if (Object.keys(validationErrors).length) {
    return res.status(400).json(validationErrors);
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const existingUser = await User.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] }
    );
    
    if (existingUser) {
      return res.status(409).json({error: "Account with that email address or username already exists."});
    }
    
    await user.save();
    
    await new Promise((resolve, reject) => {
      req.logIn(user, (err) => {
          if (err) reject(err);
          else resolve();
      });
    });
    
    res.status(201).json({user: req.user});
    
    
  } catch (err) {        
      return next(err);        
  }
}

exports.getUser = (req, res) => {
    if (req.isAuthenticated()) {return res.json({user: req.user})}
    else { return res.status(401).json({user:null});}
}

