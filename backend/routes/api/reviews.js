const express = require('express');
const { Op} = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Spot,Image,User,Review} = require('../../db/models');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const spot = require('../../db/models/spot');
const { countReviews, averageRating, round } = require('./spots');

const router = express.Router();

router.get('/current', async(req,res) => {
    const {token} = req.cookies;

    if(token){
    const decodedPayload = jwt.decode(token);

    let userId = Number(decodedPayload.data.id);


        let arr = [];
        let reviews = await Review.findAll({
            where:{userId:userId}
        });

        let user = await User.findOne({
            where:{id:userId},
            attributes:{exclude:['hashedPassword','email','username','createdAt','updatedAt']}
        });

        for(let curr of reviews){
            let obj ={
                id:curr.id,
                userId:curr.userId,
                spotId:curr.spotId,
                review:curr.review,
                stars:curr.stars,
                createdAt:curr.createdAt,
                updatedAt:curr.updatedAt,
                User:{
                    id:user.id,
                    firstName:user.firstName,
                    lastName:user.lastName
                }
            };

            let spot = await Spot.findOne({where:{id:curr.spotId}});
            let spotPreviewImage = await Image.findOne({where:{
                imageableType:'Spot',
                preview:true,
                imageableId:curr.spotId

            }});

            let spotObj = {
                id:spot.id,
                ownerId:spot.ownerId,
                address:spot.address,
                city:spot.city,
                state:spot.state,
                country:spot.country,
                lat:spot.lat,
                lng:spot.lng,
                name:spot.name,
                price:spot.price,

            }
            if(spotPreviewImage) spotObj.previewImage = spotPreviewImage.url;
            else spotObj.previewImage = null;

            obj.Spot = spotObj;

            let reviewImages = await Image.findAll({
                where:{
                    imageableType:'Review',
                    imageableId:curr.id
                },
                attributes:['id','url']
            });

            obj.ReviewImages = reviewImages;
            arr.push(obj)
        }
        res.json({Reviews:arr});

}else return res.status(401).json({message:"Authentication required"})
})


router.post('/:reviewId/images', async(req,res) => {
    const {token} = req.cookies;

    if(token){
    const decodedPayload = jwt.decode(token);

    let userId = Number(decodedPayload.data.id);
    let reviewId = req.params.reviewId;

    let review = await Review.findOne({
        where:{
            id:Number(reviewId),
        }
    })
    if(!review) return res.status(404).json({message: "Review couldn't be found"});
    if(review && userId == review.userId){

        const {url} = req.body;

        let allReviewsImages = await Image.findAll({
            where:{
                imageableId:review.id
            }
        })
        // console.log(allReviewsImages.length)
        if(allReviewsImages.length >= 10) return res.status(403).json({
            message: "Maximum number of images for this resource was reached"
          });


         await Image.create({
            imageableType:'Review',
            url:url,
            imageableId: review.id
        },{validate:true});

        let newImage = await Image.findOne({where:{
            url:url,
            imageableType:'Review',
            imageableId:review.id
        },
        attributes:{exclude:['imageableType','imageableId','preview','createdAt','updatedAt']}
    });

        res.status(201).json(newImage);

    }else res.status(403).json({message: "Forbidden"});
}else return res.status(401).json({message:"Authentication required"})
})


router.put('/:reviewId', async(req,res) => {
    const {token} = req.cookies;
    if(token){
    const decodedPayload = jwt.decode(token);

    let userId = Number(decodedPayload.data.id);
    let reviewId = req.params.reviewId;

    let foundReview = await Review.findOne({
        where:{
            id:Number(reviewId)
        }
    })
    if(!foundReview) return res.status(404).json({message:"Review couldn't be found"});
    if(foundReview && foundReview.userId == userId){
        const {review,stars} = req.body

    try{

        foundReview.review = review;
        foundReview.stars = stars;

        await foundReview.validate();
        await foundReview.save();


        let spot = await Spot.findOne({where:{id:foundReview.spotId}});

        let reviewsForSpot = await Review.findAll({where:{spotId:foundReview.spotId}});
        updatingAverage(spot,reviewsForSpot)


       return res.json(foundReview);
    }catch(err){

        if (err.name === 'SequelizeValidationError') {
            const errors = err.errors.reduce((acc, error) => {
              acc[error.path] = error.message;
              return acc;
            }, {});

    res.status(400);
    if(errors.review)errors.review = "Review text is required";
    if(errors.stars) errors.stars = "Stars must be an integer from 1 to 5";


    res.json({message:"Bad Request",errors:errors});
        }
    }
    }else res.status(403).json({message:"Forbidden"});
    }else return res.status(401).json({message:"Authentication required"})
})

router.delete('/:reviewId', async(req,res) => {
    const {token} = req.cookies;
    if(token){

    const decodedPayload = jwt.decode(token);

    let userId = Number(decodedPayload.data.id);
    let reviewId = req.params.reviewId;

    let foundReview = await Review.findOne({
        where:{
            id:Number(reviewId)
        }
    })
    if(!foundReview)return res.status(404).json({message: "Review couldn't be found"});
    if(foundReview && foundReview.userId == userId){

        let spot = await Spot.findOne({where:{id:foundReview.spotId}});

        await foundReview.destroy();

        let reviewsForSpot = await Review.findAll({where:{spotId:spot.id}});
        updatingAverage(spot,reviewsForSpot)

        res.json({
            message: "Successfully deleted"
          });



    }else res.status(403).json({message: "Forbidden"});
}return res.status(401).json({message:"Authentication required"})
})

async function updatingAverage(spot,reviewsForSpot){
    let numReviewsSpot;
        if(!reviewsForSpot.length){
            numReviewsSpot = 0;
        }else numReviewsSpot = await countReviews(reviewsForSpot);
        let average;
        if(!reviewsForSpot.length) average = 0;
        else {
        average = await averageRating(reviewsForSpot);
        average = round(average,1);
        }

        // console.log(average)
        await spot.update({
            numReviews: numReviewsSpot,
            avgRating:average
          });

          return;
}

module.exports = router;
