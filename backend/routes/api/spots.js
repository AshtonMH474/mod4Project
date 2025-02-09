const express = require('express');
const { Op} = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Spot,Image,User,Review,Booking} = require('../../db/models');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const booking = require('../../db/models/booking');
const multer = require('multer');
const cloudinary = require('../../config/cloudinary');



const router = express.Router();


const upload = multer({ dest: 'uploads/' });

router.post('/', async(req,res,next) => {
    const {token} = req.cookies;

    if(token){
        const {address, city, state, country,lat,lng,name,
             description,price } = req.body;

     const decodedPayload = jwt.decode(token);

    let ownerId = decodedPayload.data.id;

    try{
        await Spot.create({
        ownerId:ownerId,
        address:address,
        city:city,
        state:state,
        country:country,
        lat:lat,
        lng:lng,
        name:name,
        description:description,
        price:price

        },{validate:true});


        let newSpot = await Spot.findOne({
        where:{address:address},
        attributes:{exclude:['avgRating', 'numReviews']}
    });
        res.status(201).json(newSpot);

        }catch(err){
            if (err.name === 'SequelizeValidationError') {
                const errors = err.errors.reduce((acc, error) => {
                  acc[error.path] = error.message;
                  return acc;
                }, {});

        res.status(400);
        if(errors.address)errors.address = "Street address is required";
        if(errors.city) errors.city = "City is required";
        if(errors.state) errors.state = "State is required";
        if(errors.country) errors.country = "Country is required";
        if(errors.lat) errors.lat = "Latitude must be within -90 and 90";
        if(errors.lng) errors.lng = "Longitude must be within -180 and 180";
        if(errors.name) errors.name = "Name must be less than 50 characters";
        if(errors.description) errors.description = "Description is required";
        if(errors.price) errors.price = "Price per day must be a positive number";


        res.json({message:"Bad Request",errors:errors});
            }
        }

    }else res.status(401).json({message: "Authentication required"});

})


router.get('/', async(req,res) => {
let {size,page,minLat,maxLat,minLng,maxLng,minPrice,maxPrice} = req.query;
if(!size) size = 20;
if(!page) page = 1;
if(!minLat) minLat = -1000000;
if(!maxLat) maxLat = 1000000;
if(!minLng) minLng = -1000000;
if(!maxLng) maxLng = 1000000;
if(!minPrice) minPrice = 0;
if(!maxPrice) maxPrice = 1000000;

if(typeof page == 'string')page = parseInt(req.query.page);
if(typeof size == 'string')size = parseInt(req.query.size);
if(typeof minLat == 'string')minLat = parseInt(minLat);
if(typeof maxLat == 'string')maxLat = parseInt(maxLat);
if(typeof minLng == 'string')minLng = parseInt(minLng);
if(typeof maxLng == 'string')maxLng = parseInt(maxLng);
if(typeof minPrice == 'string')minPrice = parseInt(minPrice);
if(typeof maxPrice == 'string')maxPrice = parseInt(maxPrice);

let errors = {}

if(isNaN(size) || size < 1 || size > 20) errors.size = 'Size must be between 1 and 20';
if(isNaN(page) || page < 1) errors.page = 'Page must be greater than or equal to 1';

if(isNaN(maxLat)) errors.maxLat = "Maximum latitude is invalid";
if(isNaN(minLat)) errors.minLat = "Minimum latitude is invalid";

if(isNaN(maxLng)) errors.maxLng = 'Maximum longitude is invalid';
if(isNaN(minLng)) errors.minLng = 'Minimum longitude is invalid';

if(minPrice < 0 || isNaN(minPrice)) errors.minPrice = "Minimum price must be greater than or equal to 0"
if(maxPrice < 0  ||isNaN(maxPrice)) errors.maxPrice = "Maximum price must be greater than or equal to 0"
for(let error in errors){
    if(error){
        let obj = {
            message:'Bad Request',
        }
        obj.errors = errors;
        return res.status(400).json(obj);
    }
}






let spots = await Spot.findAll(
  {
    where: {
        lat:{
            [Op.between] :[minLat,maxLat]
        },
        lng:{
            [Op.between]:[minLng,maxLng]
        },
        price:{
            [Op.between]: [minPrice,maxPrice]
        }
    },
    attributes:{exclude:['numReviews']},
    limit:size,
    offset:size * (page - 1)

  }
);

//function down below
let arr = await previewImage(spots);
let obj = {
    Spots:arr
}

res.json({Spots:obj.Spots,page,size});

});

router.get('/current', async(req,res,next) => {
    const {token} = req.cookies;
    if(token){
    const decodedPayload = jwt.decode(token);

    let currSpots = await Spot.findAll({where:{ownerId:decodedPayload.data.id}});
    let arr = await previewImage(currSpots);

    let obj = {
        Spots:arr
    }

    res.json(obj);
}else return res.status(401).json({
    message: "Authentication required"
  })
})

router.get('/:spotId', async(req,res,next) => {
    let spotId = req.params.spotId;

    let spot = await Spot.findOne({
        where:{id:spotId},
        attributes:['id','ownerId',"address","city",
        "state",'country',"lat",'lng',
        "name", "description","price","createdAt","updatedAt",
        "numReviews",['avgRating', 'avgStarRating']],
        include: [{
            model:Image,
            as: 'SpotImages',
            attributes:{exclude:['createdAt','updatedAt',"imageableId","imageableType"]}
        },
        {
            model:User,
            as:'Owner',
            attributes:['id','firstName','lastName']


        }
    ]
    });

    if(spot)res.json(spot);
    else{
        res.status(404).json({
            message: "Spot couldn't be found"
          });
    }
})




router.post('/:spotId/images',upload.single('file'), async(req,res,next) => {
    const {token} = req.cookies;

    if(token){
    const decodedPayload = jwt.decode(token);


    let spotId = Number(req.params.spotId);
    let spot = await Spot.findOne({where:{id:spotId}});
    if(!spot) return res.status(404).json({message:"Spot couldn't be found"});

    if(spot.ownerId == decodedPayload.data.id){
        const {preview} = req.body;



        //    await Image.create({
        //     imageableType:'Spot',
        //     imageableId: spotId,
        //     url:url,
        //     preview:preview
        //    },{validate:true});

        //    let newImage = await Image.findOne({
        //     where:{url:url},
        //     attributes:{exclude:['imageableId','imageableType','createdAt','updatedAt']}
        //    });

        //   return res.status(201).json(newImage);
        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
              upload_preset: 'FormatImages', // Use your preset
            });





            let newImage = await Image.create({
                imageableType:'Spot',
                    imageableId: spotId,
                    url:result.secure_url,
                    preview:preview,

                   },{validate:true});

            res.json(newImage);
          } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ error: 'Error uploading image' });
          }

    }else return res.status(403).json({message: "Forbidden"});
}
return res.status(401).json({message: "Authentication required"});
})


router.put('/:spotId', async(req,res,next) => {
    const {token} = req.cookies;

    if(token){
    const decodedPayload = jwt.decode(token);

    let spotId = Number(req.params.spotId);
    let spot = await Spot.findOne({
        where:{id:spotId},
        attributes:{exclude:['avgRating', 'numReviews']}
    });
    if(!spot)return res.status(404).json({message:"Spot couldn't be found"});

    if(spot && token && decodedPayload.data.id == spot.ownerId){
        const {address,city,state,country,lat,
        lng,name,description,price} = req.body;

        try{
            await spot.update({
              address:address,
              city:city,
              state:state,
              country:country,
              lat:lat,
              lng:lng,
              name:name,
              description:description,
              price:price
            },{validate:true});

            res.json(spot);

        }catch(err){
            if (err.name === 'SequelizeValidationError') {
                const errors = err.errors.reduce((acc, error) => {
                  acc[error.path] = error.message;
                  return acc;
                }, {});

        res.status(400);
        if(errors.address)errors.address = "Street address is required";
        if(errors.city) errors.city = "City is required";
        if(errors.state) errors.state = "State is required";
        if(errors.country) errors.country = "Country is required";
        if(errors.lat) errors.lat = "Latitude must be within -90 and 90";
        if(errors.lng) errors.lng = "Longitude must be within -180 and 180";
        if(errors.name) errors.name = "Name must be less than 50 characters";
        if(errors.description) errors.description = "Description is required";
        if(errors.price) errors.price = "Price per day must be a positive number";


        res.json({message:"Bad Request",errors:errors});
            }
        }


    }else{
       res.status(403);
       res.json({message: "Forbidden"});
    }
}else res.status(401).json({message: "Authentication required"});

})


router.delete('/:spotId', async(req,res,next) => {
    const {token} = req.cookies;

    if(token){
    const decodedPayload = jwt.decode(token);


    let spotId = Number(req.params.spotId);

    let spot = await Spot.findOne({ where:{id:spotId} });
    if(!spot) return res.status(404).json({message: "Spot couldn't be found" });
    if(token && decodedPayload.data.id == spot.ownerId){
        console.log(decodedPayload.data.id)
        await spot.destroy();
        return res.json({ message: "Successfully deleted"});
    }
    else return res.status(403).json({message:"Forbidden"});
    } else return res.status(401).json({message: "Authentication required"})
})


router.get('/:spotId/reviews', async(req,res) => {
    let spotId = Number(req.params.spotId);
    let spot = await Spot.findOne({where:{id:spotId}});

    if(spot){
        let arr = [];
        let reviews = await Review.findAll({where:{spotId:spotId}});

        for(let curr of reviews){
            let user = await User.findOne({where:{id:curr.userId}});
            let userObj = {
                id:user.id,
                firstName:user.firstName,
                lastName:user.lastName
            }

            let obj = {
                id:curr.id,
                userId:curr.userId,
                spotId:curr.spotId,
                review:curr.review,
                stars:curr.stars,
                createdAt:curr.createdAt,
                updatedAt:curr.updatedAt,
                User:userObj
            };

            let reviewImages = await Image.findAll({
                where:{
                    imageableType:'Review',
                    imageableId:curr.id
                },
                attributes:['id','url']
            });

            obj.ReviewImages = reviewImages;
            arr.push(obj);
        }
        res.json({Reviews:arr});
    }else res.status(404).json({message:"Spot couldn't be found"});
})

router.post('/:spotId/reviews', async(req,res) => {
    const {token} = req.cookies;

    if(token){
    const decodedPayload = jwt.decode(token);

    let userId = decodedPayload.data.id;
    let spotId = Number(req.params.spotId);

    let spot = await Spot.findOne({where:{id:spotId}});
    let user = await User.findOne({where:{id:Number(userId)}});

    if(token && user && spot){
        let countReview = await Review.findOne({where:{
            spotId:spot.id,
            userId:user.id
        }});

    if(countReview) return res.status(500).json({message:"User already has a review for this spot"});

    const {review,stars} = req.body;

    try{
        await Review.create({
            userId:user.id,
            spotId:spot.id,
            review:review,
            stars:stars
        },{validate:true});


        let reviewsForSpot = await Review.findAll({where:{spotId:spot.id}});
        let numReviewsSpot = await countReviews(reviewsForSpot);
        let average = await averageRating(reviewsForSpot);
        average = round(average,1);





        await spot.update({
            numReviews: numReviewsSpot,
            avgRating:average
          });

        let myReview = await Review.findOne({
            where:{
                userId:user.id,
                spotId:spot.id,
                review:review,
                stars:stars
            }
        });

        res.status(201).json(myReview);
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

    }else res.status(404).json({message:"Spot couldn't be found"});
}return res.status(401).json({message:"Authentication required"})
})

router.post('/:spotId/bookings', async(req,res) => {
    const {token} = req.cookies;

    if(token){
        const decodedPayload = jwt.decode(token);

        let userId = Number(decodedPayload.data.id);
        let spot = await Spot.findOne({where:{id:Number(req.params.spotId)}});

        if(!spot)return res.status(404).json({message: "Spot couldn't be found"});
        // console.log(userId,spot.ownerId)
        if(spot && spot.ownerId != userId){
            let {startDate, endDate} = req.body;

            let errorBooking = await Booking.findOne({where:{
                spotId:Number(req.params.spotId),
                [Op.or]: [
                    {
                        startDate: { [Op.lte]: new Date(startDate) },
                        endDate: { [Op.gte]: new Date(startDate) }
                      },

                      {
                        startDate: { [Op.between]: [new Date(startDate), new Date(endDate)] }
                      },

                      {
                        startDate: { [Op.lte]: new Date(endDate) },
                        endDate: { [Op.gte]: new Date(endDate) }
                      }

                ]
            }})

            if(errorBooking)return res.status(403).json({

                    message: "Sorry, this spot is already booked for the specified dates",
                    errors: {
                      "startDate": "Start date conflicts with an existing booking",
                      "endDate": "End date conflicts with an existing booking"
                    }

            })



            try{

                let newBooking = await Booking.create({
                    spotId:Number(req.params.spotId),
                    userId:userId,
                    startDate:startDate,
                    endDate:endDate
                },{validate:true});
                return res.status(201).json(newBooking);
            }catch(err){
                res.status(400).json({
                    message: "Bad Request", // (or "Validation error" if generated by Sequelize),
                    errors: {
                      startDate: "startDate cannot be in the past",
                      endDate: "endDate cannot be on or before startDate"
                    }
                  })
            }
        }else return res.status(403).json({message:'Forbidden'});

    }else return res.status(401).json({message:"Authentication required"});
})

router.get('/:spotId/bookings', async(req,res) => {
    const {token} = req.cookies;

    if(token){
    const decodedPayload = jwt.decode(token);

    let userId = Number(decodedPayload.data.id);

    let spot = await Spot.findOne({where:{id:Number(req.params.spotId)}});
    if(!spot)return res.status(404).json({message: "Spot couldn't be found"});

    if(userId == spot.ownerId){
        let arr = [];
        let bookings = await Booking.findAll({where:{spotId:spot.id}});
        for(let book of bookings){
            let user = await User.findOne({where:{id:book.userId}});
            let obj = {
                User:{
                    id:user.id,
                    firstName:user.firstName,
                    lastName:user.lastName
                },
                id:book.id,
                spotId:book.spotId,
                userId:book.userId,
                startDate:book.startDate,
                endDate:book.endDate,
                createdAt:book.createdAt,
                updatedAt:book.updatedAt
            };
            arr.push(obj);
        }
        res.json({Bookings:arr});
    }else {
        let arr = []
        let bookings = await Booking.findAll({where:{spotId:spot.id}});

        for(let book of bookings){
            let obj = {
                spotId:book.spotId,
                startDate:book.startDate,
                endDate:book.endDate,
            };
            arr.push(obj);
        }
        res.json({Bookings:arr});
    }

    }else return res.status(401).json({message:"Authentication required"});
})


module.exports = router;

async function previewImage(spots, arr =[]){

    for(let el of spots){
        let obj = {
            id:el.id,
            ownerId:el.ownerId,
            address:el.address,
            city:el.city,
            state:el.state,
            country:el.country,
            lat:el.lat,
            lng:el.lng,
            name:el.name,
            description:el.description,
            price :el.price,
            createdAt:el.createdAt,
            updatedAt:el.updatedAt,
            avgRating:el.avgRating
        }

        let image = await Image.findOne({where:{
            imageableType:'Spot',
            preview:true,
            imageableId:el.id

        }});
        if(!image)obj.previewImage=null

        if(image){
        obj.previewImage = image.url
        }
        arr.push(obj);

    }
    return arr;
}




 async function countReviews(arr){
    let count = 0;

    for(let spot of arr){
      count++
    }

    return count;
  }


   async function averageRating(reviews, arr = []){

    let count = 0;
    for(let review of reviews){
      arr.push(review.stars);

    }
    console.log(arr);

    for(let curr of arr){
      count += curr;
    }

    return count/arr.length

  }
   const round = (value, decimalPlace)=> {
    let multiplier = Math.pow(10, decimalPlace || 0);
    return Math.round(value * multiplier) / multiplier;

}
module.exports.averageRating = averageRating;
module.exports.countReviews = countReviews
module.exports.round = round
