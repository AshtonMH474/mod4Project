'use strict';


const { Image,Review } = require('../models');

const bcrypt = require("bcryptjs");



let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const reviewImages = [
  //spot disney awesome spot
  {
    imageableType:'Review',
    url:'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'
  },
  //spot disney amazing spot but home
  {
    imageableType:'Review',
    url:'https://thumbs.dreamstime.com/b/inside-colourfull-traditional-messy-soviet-house-full-houseware-items-russia-messy-house-inside-kitchen-180124084.jpg'
  },
  //breakingbad this place sucks
  {
    imageableType:'Review',
    url:'https://c8.alamy.com/comp/AG43B2/inside-the-kitchen-of-a-poor-house-showing-pieces-of-raw-bloody-meat-AG43B2.jpg'
  },
  //breakingbad will be coming back
  {
    imageableType:'Review',
    url:'https://static.boredpanda.com/blog/wp-content/uploads/2019/04/ugly-ranch-style-house-for-sale-texas-4-5cc6e1fbc3c5b__700.jpg'
  },
  //grandcayon
  {
    imageableType:'Review',
    url:'https://i.ytimg.com/vi/SI_4vqMemVI/maxresdefault.jpg'
  }
]
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let review1 = await Review.findOne({where:{review:'This was an awesome spot!'}});
    reviewImages[0].imageableId = review1.id;

    let review2 = await Review.findOne({where:{review:'amazing spot but home is a disaster'}});
    reviewImages[1].imageableId = review2.id;

    let review3 = await Review.findOne({where:{review:'This place sucks'}});
    reviewImages[2].imageableId = review3.id;

    let review4 = await Review.findOne({where:{review:'will most likley be coming back'}});
    reviewImages[3].imageableId = review4.id;

    let review5 = await Review.findOne({where:{review:'beautiful home but location is scary'}});
    reviewImages[4].imageableId = review5.id;

    await Image.bulkCreate(reviewImages, {
      validate: true,
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
    options.tableName = 'Images';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
        'https://thumbs.dreamstime.com/b/inside-colourfull-traditional-messy-soviet-house-full-houseware-items-russia-messy-house-inside-kitchen-180124084.jpg',
        'https://c8.alamy.com/comp/AG43B2/inside-the-kitchen-of-a-poor-house-showing-pieces-of-raw-bloody-meat-AG43B2.jpg',
        'https://static.boredpanda.com/blog/wp-content/uploads/2019/04/ugly-ranch-style-house-for-sale-texas-4-5cc6e1fbc3c5b__700.jpg',
        'https://i.ytimg.com/vi/SI_4vqMemVI/maxresdefault.jpg'
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
