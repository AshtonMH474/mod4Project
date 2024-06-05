const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const {Spot,Image} = require('../../db/models');

const router = express.Router();

router.get('/', async(req,res) => {
let spots = await Spot.findAll(
  {
    attributes:{exclude:['numReviews']},
    include:{
        model:Image,
        where:{preview:true},
        as:'previewImage',
        attributes:['url']
    }
  }
);

res.json(spots);

});


module.exports = router;
