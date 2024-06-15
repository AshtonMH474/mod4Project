const express = require('express');
const { Op} = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Spot,Image,User,Review,Booking} = require('../../db/models');
const { setTokenCookie, restoreUser } = require('../../utils/auth');


const router = express.Router();

router.get('/current', async(req,res) => {
    const {token} = req.cookies;

    if(token){
    const decodedPayload = jwt.decode(token);

    let userId = Number(decodedPayload.data.id);

    let bookings = await Booking.findAll({where:{userId:userId}});
    let arr = []
    for(let book of bookings){
        let spot = await Spot.findOne({where:{id:book.spotId}});
        let previewImage = await Image.findOne({
            where:{
                preview:true,
                imageableType:'Spot',
                imageableId: spot.id
            }
        })
        let obj = {
            id:book.id,
            spotId:book.spotId,
            Spot:{
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
                previewImage:previewImage.url
            },
            userId:book.userId,
            startDate:book.startDate,
            endDate:book.endDate,
            createdAt:book.createdAt,
            updatedAt:book.updatedAt
        }

        arr.push(obj);
    }

    res.json({Bookings:arr});

    }else return res.status(401).json({message:"Authentication required"});
})



module.exports = router;
