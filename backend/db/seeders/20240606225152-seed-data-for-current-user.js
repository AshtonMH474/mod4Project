'use strict';

const { User, Spot, Image } = require('../models');

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


const spots = [
  {
    address: "456 Elm Street",
    city: "Los Angeles",
    state: "California",
    country: "United States of America",
    lat: 34.052235,
    lng: -118.243683,
    name: "CodeCamp",
    description: "Leading coding bootcamp jvjfgjgng ghgntgjt gkgtngt mgtgtkg gktgktgmtg gmgktgmkgt mkgtkg kgtmktgtk kgtkmtk kgmg gkmgg gmgg kmgm gg gg gg gg gg gg gg gg gg gg ggg ggg gg g g ggggrgmktgtg gtjgmtkg gktgktkm",
    price: 150,

  },
]

// const images = [
//   {
//     imageableType:'Spot',
//     preview:true,
//     url:'https://images.pexels.com/photos/20522435/pexels-photo-20522435/free-photo-of-wooden-abandoned-house-in-winter.jpeg?auto=compress&cs=tinysrgb&w=800'
//   }
// ]


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let person1 = await User.findOne({where:{firstName:'Demo'}});
    spots[0].ownerId = person1.id;

    await Spot.bulkCreate(spots, {
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
    // let person1 = await User.findOne({where:{firstName:'Demo'}});
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['456 Elm Street'] }
    }, {});



    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
