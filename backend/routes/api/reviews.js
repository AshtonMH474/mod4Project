const express = require('express');
const { Op} = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Spot,Image,User,Review} = require('../../db/models');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const spot = require('../../db/models/spot');

const router = express.Router();

// router.get('/current', async(req,res) => {
//     const {token} = req.cookies;
//     const decodedPayload = jwt.decode(token);

//     let userId = Number(decodedPayload.data.id);

//     if(token && userId != NaN){
//         let arr = [];
//         let reviews = await Review.findAll({
//             where:{userId:userId}
//         });

//         let user = await User.findOne({
//             where:{id:userId},
//             attributes:{exclude:['hashedPassword','email','username','createdAt','updatedAt']}
//         });

//         for(let curr of reviews){
//             let obj ={
//                 id:curr.id,
//                 userId:curr.userId,
//                 spotId:curr.spotId,
//                 review:curr.review,
//                 stars:curr.stars,
//                 createdAt:curr.createdAt,
//                 updatedAt:curr.updatedAt,
//                 User:{
//                     id:user.id,
//                     firstName:user.firstName,
//                     lastName:user.lastName
//                 }
//             };

//             let spot = await Spot.findOne({where:{id:curr.spotId}});
//             let spotPreviewImage = await Image.findOne({where:{
//                 imageableType:'Spot',
//                 preview:true,
//                 imageableId:curr.spotId

//             }});

//             let spotObj = {
//                 id:spot.id,
//                 ownerId:spot.ownerId,
//                 address:spot.address,
//                 city:spot.city,
//                 state:spot.state,
//                 country:spot.country,
//                 lat:spot.lat,
//                 lng:spot.lng,
//                 name:spot.name,
//                 price:spot.price,
//                 previewImage: spotPreviewImage.url
//             }

//             obj.Spot = spotObj;

//             let reviewImages = await Image.findAll({
//                 where:{
//                     imageableType:'Review',
//                     imageableId:curr.id
//                 },
//                 attributes:['id','url']
//             });

//             obj.ReviewImages = reviewImages;
//             arr.push(obj)
//         }
//         res.json({Reviews:arr});
//     }
// })

module.exports = router;
