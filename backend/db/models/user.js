'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(
        models.Spot,
        {
          foreignKey:'ownerId',
          onDelete:'CASCADE',
          hooks:true
        }
      )
    }
  };

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      },
      firstName: {
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
          len:[1,30]
        }
      },
      lastName: {
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
          len:[1,30]
        }
      }
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
    }
  );
  return User;
};









// 'use strict';
// const {Spot,User} = require('../models');

// async function findIds(){
// let arr = [];

// let person1 = await User.findOne({where:{firstName:'Demo'}});
// let person2 = await User.findOne({where:{firstName:'Fake'}});
// let person3 = await User.findOne({where:{firstName:'user2'}});

// console.log(person1.id);
// }

// findIds();
// const spots = [
//   {
//     ownerId: 8,
//     address: "123 Disney Lane",
//     city: "San Francisco",
//     state: "California",
//     country: "United States of America",
//     lat: 37.7645358,
//     lng: -122.4730327,
//     name: "App Academy",
//     description: "Place where web developers are created",
//     price: 123,
//     avgRating: 4.5,
//   },
//   {
//     ownerId: 7,
//     address: "24 Grand Cayon Ave",
//     city: "Phoinex",
//     state: "Arizona",
//     country: "United States of America",
//     lat: 37.7645358,
//     lng: -122.4730327,
//     name: "Rock Mount",
//     description: "Place where web developers are created",
//     price: 123,
//     avgRating: 2.5,
//   },
//   {
//     ownerId: 10,
//     address: "965 Breaking Bad",
//     city: "Alberque",
//     state: "New Mexico",
//     country: "United States of America",
//     lat: 37.7645358,
//     lng: -122.4730327,
//     name: "Walter White",
//     description: "Place where web developers are created",
//     price: 123,
//     avgRating: 1.0,
//   }
// ]
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     try {
//       await Spot.bulkCreate(spots, {
//         validate: true,
//       });
//     } catch (err) {
//       console.log(err);
//       throw err;
//     }
//     /**
//      * Add seed commands here.
//      *
//      * Example:
//      * await queryInterface.bulkInsert('People', [{
//      *   name: 'John Doe',
//      *   isBetaMember: false
//      * }], {});
//     */
//   },

//   async down (queryInterface, Sequelize) {
//     for (let spotInfo of spots) {
//       try {
//         await Spot.destroy({
//           where: spotInfo
//         });
//       } catch (err) {
//         console.log(err);
//         throw err;
//       }
//     }
//     /**
//      * Add commands to revert seed here.
//      *
//      * Example:
//      * await queryInterface.bulkDelete('People', null, {});
//      */
//   }
// };
