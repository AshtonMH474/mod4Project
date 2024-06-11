'use strict';

const { User, Spot, Image,Review } = require('../models');

const bcrypt = require("bcryptjs");
const review = require('../models/review');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const reviews = [
  {
    review: "This was an awesome spot!",
    stars: 5,
  },
  {
    review: "This place sucks",
    stars: 1,
  },
  {
    review: "Really nice area but the people next door suck!",
    stars: 3,
  },
  {
    review: "beautiful home but location is scary",
    stars: 4,
  },
  {
    review: "amazing spot but home is a disaster",
    stars: 2,
  },
  {
    review: "will most likley be coming back",
    stars: 5,
  },
  {
    review: "owner was unreachable",
    stars: 2,
  }
]




/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    //creates reviews
  let spot1 = await Spot.findOne({where:{address:'123 Disney Lane'}})
  let spot2 = await Spot.findOne({where:{address:'24 Grand Cayon Ave'}})
  let spot3 = await Spot.findOne({where:{address:'965 Breaking Bad'}})


  let user1 = await User.findOne({where:{firstName:'Demo'}});
  let user2 = await User.findOne({where:{firstName:'Fake'}});
  let user3 = await User.findOne({where:{firstName:'user2'}});
      //user2 made a review on disney lane
    reviews[0].userId = user3.id;
    reviews[0].spotId = spot1.id;

    //demo made a review on breaking bad
    reviews[1].userId = user1.id;
    reviews[1].spotId = spot3.id;
    //demo on grand cayon
    reviews[2].userId = user1.id;
    reviews[2].spotId = spot2.id;
    //user2 on grand cayon
    reviews[3].userId = user3.id;
    reviews[3].spotId = spot2.id;
    //fake on disney
    reviews[4].userId = user2.id;
    reviews[4].spotId = spot1.id;
    //fake on breaking bad
    reviews[5].userId = user2.id;
    reviews[5].spotId = spot3.id;
    //demo on breaking bad
    reviews[6].userId = user1.id;
    reviews[6].spotId = spot3.id;


    await Review.bulkCreate(reviews, {
      validate: true,
    });

    // gets numreviews and averageRatings for spots
    let reviewsForSpot1 = await Review.findAll({where:{spotId:spot1.id}});
    let numReviewsSpot1 = await countReviews(reviewsForSpot1);
    let average1 = await averageRating(reviewsForSpot1);
    average1 = round(average1,1);

    await spot1.update({
      numReviews: numReviewsSpot1,
      avgRating:average1
    });


    let reviewsForSpot2 = await Review.findAll({where:{spotId:spot2.id}});
    let numReviewsSpot2 = await countReviews(reviewsForSpot2);
    let average2 = await averageRating(reviewsForSpot2);
    average2 = round(average2,1);


    await spot2.update({
      numReviews: numReviewsSpot2,
      avgRating:average2
    });



    let reviewsForSpot3 = await Review.findAll({where:{spotId:spot3.id}});
    let numReviewsSpot3 = await countReviews(reviewsForSpot3);
    let average3 = await averageRating(reviewsForSpot3);

    average3 = round(average3,1);

    await spot3.update({
      numReviews: numReviewsSpot3,
      avgRating:average3
    });



    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    let spot1 = await Spot.findOne({where:{address:'123 Disney Lane'}});
    let spot2 = await Spot.findOne({where:{address:'24 Grand Cayon Ave'}});
    let spot3 = await Spot.findOne({where:{address:'965 Breaking Bad'}});

    // //updating spots back to original numReviews and AvgRating
    await spot1.update({
      numReviews: 0,
      avgRating:4.5
    });
    await spot2.update({
      numReviews: 0,
      avgRating:2.5
    });
    await spot3.update({
      numReviews: 0,
      avgRating:1
    });
    //deleting reviews


    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [spot1.id,spot2.id,spot3.id
      ] }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

  async function countReviews(arr){
    let count = 0;

    for(let spot of arr){
      count++
    }

    return count;
  }


  async function averageRating(reviews, arr = []){
    let spot = await Spot.findOne({where:{id:reviews[0].spotId}});
    if(spot.avgRating != 0) arr.push(spot.avgRating);

    let count = 0;
    for(let spot of reviews){
      arr.push(spot.stars);
    }

    for(let curr of arr){
      count += curr;
    }

    return count/arr.length

  }
  function round(value, decimalPlace) {
    let multiplier = Math.pow(10, decimalPlace || 0);
    return Math.round(value * multiplier) / multiplier;
}
