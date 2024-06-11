const express = require('express');
const { Op} = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Spot,Image,User,Review} = require('../../db/models');
const { setTokenCookie, restoreUser } = require('../../utils/auth');

const router = express.Router();

router.get('/', async(req,res) => {

let spots = await Spot.findAll(
  {
    attributes:{exclude:['numReviews']},

  }
);

//function down below
let arr = await previewImage(spots);
let obj = {
    Spots:arr
}

res.json(obj);

});

router.get('/current', async(req,res,next) => {
    const {token} = req.cookies;

    const decodedPayload = jwt.decode(token);

    let currSpots = await Spot.findAll({where:{ownerId:decodedPayload.data.id}});
    let arr = await previewImage(currSpots);

    let obj = {
        Spots:arr
    }

    res.json(obj);
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
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        res.json({message:err.message});
    }
})

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
        res.json(newSpot);

        }catch(err){
        res.status(400);
        err.message = 'Bad Request'
        err.errors = {
            address: "Street address is required",
            city: "City is required",
            state: "State is required",
            country: "Country is required",
            lat: "Latitude is not valid",
            lng: "Longitude is not valid",
            name: "Name must be less than 50 characters",
            description: "Description is required",
            price: "Price per day is required"
      }
        res.json({message:err.message,errors:err.errors});

        }

    }

})


router.post('/:spotId/images', async(req,res,next) => {
    const {token} = req.cookies;
    const decodedPayload = jwt.decode(token);

    let ownerId = decodedPayload.data.id;
    let spotId = Number(req.params.spotId);
    let spot = await Spot.findOne({where:{id:spotId}});

    if(spot && token && ownerId && ownerId == spot.ownerId){
        const {url, preview} = req.body;



           await Image.create({
            imageableType:'Spot',
            imageableId: ownerId,
            url:url,
            preview:preview
           },{validate:true});

           let newImage = await Image.findOne({
            where:{url:url},
            attributes:{exclude:['imageableId','imageableType','createdAt','updatedAt']}
           });

           res.json(newImage);

    }
   res.status(404).json({message:"Spot couldn't be found"});
})


router.put('/:spotId', async(req,res,next) => {
    const {token} = req.cookies;
    const decodedPayload = jwt.decode(token);

    let ownerId = decodedPayload.data.id;
    let spotId = Number(req.params.spotId);
    let spot = await Spot.findOne({
        where:{id:spotId},
        attributes:{exclude:['avgRating', 'numReviews']}
    });

    if(spot && token && ownerId && ownerId == spot.ownerId){
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
            res.status(400);
            err.message = "Bad Request";
            errors = {
                "address": "Street address is required",
                "city": "City is required",
                "state": "State is required",
                "country": "Country is required",
                "lat": "Latitude is not valid",
                "lng": "Longitude is not valid",
                 "name": "Name must be less than 50 characters",
                 "description": "Description is required",
                "price": "Price per day is required"
            }

            res.json({message:err.message, errors:errors})
        }


    }else{
       res.status(404);
       res.json({message:"Spot couldn't be found"});
    }

})


router.delete('/:spotId', async(req,res,next) => {
    const {token} = req.cookies;
    const decodedPayload = jwt.decode(token);

    let ownerId = decodedPayload.data.id;
    let spotId = Number(req.params.spotId);

    let spot = await Spot.findOne({ where:{id:spotId} });

    if(spot && token && ownerId && ownerId == spot.ownerId){
        await spot.destroy();
        res.json({ message: "Successfully deleted"});
    }
    else res.status(404).json({message: "Spot couldn't be found" });
})


router.get('/:spotId/reviews', async(req,res) => {
    let spotId = Number(req.params.spotId);
    let spot = await Spot.findOne({where:{id:spotId}});
    let reviews = await Review.findAll({where:{spotId:spotId}});
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

        if(image){
        obj.previewImage = image.url
        }
        arr.push(obj);

    }
    return arr;
}
