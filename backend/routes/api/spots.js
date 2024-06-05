const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const {Spot,Image} = require('../../db/models');

const router = express.Router();

router.get('/', async(req,res) => {
let arr = [];
let spots = await Spot.findAll(
  {
    attributes:{exclude:['numReviews']},

  }
);


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
        avgRating:el.avgRating,
        createdAt:el.createdAt,
        updatedAt:el.updatedAt
    }

    let image = await Image.findOne({where:{
        preview:true,
        imageableId:el.id

    }});


    obj.previewImage = image.url
    arr.push(obj);

}


res.json(arr);

});


module.exports = router;
