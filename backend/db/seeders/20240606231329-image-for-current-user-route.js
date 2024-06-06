'use strict';

const { User, Spot, Image } = require('../models');

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const spotImages = [
  {
    imageableType:'Spot',
    preview:true,
    url:'https://images.pexels.com/photos/20522435/pexels-photo-20522435/free-photo-of-wooden-abandoned-house-in-winter.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
]


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     let spot1 = await Spot.findOne({where:{address:'456 Elm Street'}});
     let arr = [spot1.id];
     spotImages[0].imageableId = arr[0]

    await Image.bulkCreate(spotImages, {
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
    const Op = Sequelize.Op;
    options.tableName = 'Images';
    await queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://images.pexels.com/photos/20522435/pexels-photo-20522435/free-photo-of-wooden-abandoned-house-in-winter.jpeg?auto=compress&cs=tinysrgb&w=800'] }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
