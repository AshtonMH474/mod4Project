const express = require('express');
const { Op} = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Spot,Image,User} = require('../../db/models');
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
    console.log(decodedPayload.data.email);

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
