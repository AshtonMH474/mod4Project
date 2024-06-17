const express = require('express')
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// ...

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();


const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Username is required'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
    check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First Name is required'),
    check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last Name is required'),
  // check('password')
  //   .exists({ checkFalsy: true })
  //   .isLength({ min: 6 })
  //   .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];






  // router.get('/', async(req,res) => {
  //   let arr = await findIds();
  //   console.log(arr);
  //   res.json(arr);
  // })



router.post(
    '/', validateSignup,
    async (req, res) => {
      // try{
      const { email, password, username, firstName, lastName } = req.body;
      let userWithEmail = await User.findOne({where:{email:email}});
      let userWithUserName = await User.findOne({where:{username:username}});
      if(userWithEmail && userWithUserName)return res.status(500).json({
        message: "User already exists",
        errors: {
          email: "User with that email already exists",
          username: "User with that username already exists"
        }
    })
      if(userWithUserName)return res.status(500).json({
        message: "User already exists",
        errors: {
          username: "User with that username already exists"
        }
    })
      if(userWithEmail) return res.status(500).json({
          message: "User already exists",
          errors: {
            email: "User with that email already exists",
            // "username": "User with that username already exists"
          }
      })
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ email, username, hashedPassword, firstName, lastName });

      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      };

      await setTokenCookie(res, safeUser);

      return res.status(201).json({
        user: safeUser
      });

    // }catch(err){
    //   res.json(validateSignup);

    //   let obj ={
    //     message:err.message,
    //     errors:{

    //     }
    //   };

    //   for(let i = 0; i < err.errors.length; i++){
    //     let path = err.errors[i].path
    //     obj[path] = err.errors[i].message
    //   }


    //   return res.status(400).json(obj);
    // }
    }
  );

module.exports = router;
