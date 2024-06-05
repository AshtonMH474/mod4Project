'use strict';

const { User, Spot } = require('../models');

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
const spots = [
  {
    address: "123 Disney Lane",
    city: "San Francisco",
    state: "California",
    country: "United States of America",
    lat: 37.7645358,
    lng: -122.4730327,
    name: "App Academy",
    description: "Place where web developers are created",
    price: 123,
    avgRating: 4.5,
  },
  {
    address: "24 Grand Cayon Ave",
    city: "Phoinex",
    state: "Arizona",
    country: "United States of America",
    lat: 37.7645358,
    lng: -122.4730327,
    name: "Rock Mount",
    description: "Place where web developers are created",
    price: 123,
    avgRating: 2.5,
  },
  {
    address: "965 Breaking Bad",
    city: "Alberque",
    state: "New Mexico",
    country: "United States of America",
    lat: 37.7645358,
    lng: -122.4730327,
    name: "Walter White",
    description: "Place where web developers are created",
    price: 123,
    avgRating: 1.0,
  }
]
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      let arr = await findIds();
      spots[0].ownerId = arr[0];
      spots[1].ownerId = arr[1];
      spots[2].ownerId = arr[2];


      await Spot.bulkCreate(spots, {
        validate: true,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
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
    let arr = await findIds();
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [arr[0], arr[1], arr[2]] }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};




 async function findIds(){
  // let users = await User.findAll();


  let arr = [];

  let person1 = await User.findOne({where:{firstName:'Demo'}});
  let person2 = await User.findOne({where:{firstName:'Fake'}});
  let person3 = await User.findOne({where:{firstName:'user2'}});

  arr.push(person1.id);
  arr.push(person2.id);
  arr.push(person3.id);

  return arr;

  }



//   'use strict';

// const { User } = require('../models');
// const bcrypt = require("bcryptjs");

// let options = {};
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA;  // define your schema in options object
// }

// module.exports = {
//   async up (queryInterface, Sequelize) {
//     await User.bulkCreate([
//       {
//         email: 'demo@user.io',
//         username: 'Demo-lition',
//         hashedPassword: bcrypt.hashSync('password'),
//         firstName: 'Demo',
//         lastName: 'User'
//       },
//       {
//         email: 'user1@user.io',
//         username: 'FakeUser1',
//         hashedPassword: bcrypt.hashSync('password2'),
//         firstName: 'Fake',
//         lastName: 'User'
//       },
//       {
//         email: 'user2@user.io',
//         username: 'FakeUser2',
//         hashedPassword: bcrypt.hashSync('password3'),
//         firstName: 'user2',
//         lastName: 'Fake'
//       }
//     ], { validate: true });
//   },

//   async down (queryInterface, Sequelize) {
//     options.tableName = 'Users';
//     const Op = Sequelize.Op;
//     return queryInterface.bulkDelete(options, {
//       username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
//     }, {});
//   }
// };
