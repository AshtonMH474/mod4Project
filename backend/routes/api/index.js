// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js')
const reviewRouter = require('./reviews.js');
const { Op} = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { restoreUser } = require("../../utils/auth.js");
const {Image,User,Review,Spot} = require('../../db/models');

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);
router.use('/spots',spotsRouter);
router.use('/reviews',reviewRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});


router.delete('/review-images/:imageId', async(req,res) => {
  const {token} = req.cookies;
  if(token){
    const decodedPayload = jwt.decode(token);

    let userId = Number(decodedPayload.data.id);
    let imageId = req.params.imageId;



    let foundImage = await Image.findOne({
        where:{
            id:Number(imageId),
            imageableType: 'Review'
        }
    })
    if(!foundImage) return res.status(404).json({
      message: "Review Image couldn't be found"
    });
    let review = await Review.findOne({where: {
        id:foundImage.imageableId,
        userId:userId
    }});

    if(foundImage && review){
      await foundImage.destroy();
      return res.json({
        message: "Successfully deleted"
      })
    }else  return res.status(403).json({
      message: "Forbidden"
    })
  }else return res.status(401).json({message:"Authentication required"});
})


router.delete('/spot-images/:imageId', async(req,res) => {
  const {token} = req.cookies;
  if(token){
    const decodedPayload = jwt.decode(token);

    let userId = Number(decodedPayload.data.id);
    let imageId = req.params.imageId;



    let foundImage = await Image.findOne({
        where:{
            id:Number(imageId),
            imageableType: 'Spot'
        }
    })
    if(!foundImage) return res.status(404).json({message: "Spot Image couldn't be found"});

    let spot = await Spot.findOne({where: {
        id:Number(foundImage.imageableId),
        ownerId:userId
    }});

    if(foundImage && spot){
      await foundImage.destroy();
      res.json({
        message: "Successfully deleted"
      })
    }else return res.status(403).json({
      message: "Forbidden"
    })
  }else return res.status(401).json({message:"Authentication required"});
})
module.exports = router;
