'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(
        models.User,{
          foreignKey:'ownerId',
          as:'Owner'
        })

        Spot.hasMany(models.Image, {
          as:'SpotImages',
          foreignKey: 'imageableId',
          constraints: false,
          scope: {
            imageableType: 'Spot'
          }
        })
        Spot.hasMany(
          models.Review,
          {
            foreignKey:'spotId',
            onDelete:'CASCADE',
            hooks:true
          })


          Spot.hasMany(
            models.Booking,
            {
              foreignKey:'spotId',
              onDelete:'CASCADE',
              hooks:true
            })
    }
  }
  Spot.init({
    ownerId:{
    type: DataTypes.INTEGER,
    allowNull:false,
    validate:{
      isNumeric:true,
      notEmpty:true
    }
    },
    address:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:true
      }
    },
    city:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:true
      }
    },
    state:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:true
      }
    },
    country:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:true
      }
    },
    lat: {
      type:DataTypes.FLOAT,
      allowNull:false,
      validate:{
        isNumeric:true,
      notEmpty:true,
      isFloat:true,
      min:-90,
      max:90
      }
    },
    lng: {
      type:DataTypes.FLOAT,
      allowNull:false,
      validate:{
        isNumeric:true,
      notEmpty:true,
      isFloat:true,
      min:-180,
      max:180
      }
    },
    name:{
      type: DataTypes.STRING,
      validate: {
        len:[1,50],
        notEmpty:true
      }
    },
    description:{
      type: DataTypes.STRING,
      validate: {
        notEmpty:true,
        len:[30,Infinity]
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull:false,
      validate: {
        isNumeric:true,
        notEmpty:true,
        min:1
      }
    },
    avgRating: {
      type: DataTypes.FLOAT,
      allowNull:false,
      defaultValue:0,
      validate: {
        isNumeric:true,
        notEmpty:true,
        isDecimal:true,
      }
    },
    numReviews:{
      type:DataTypes.INTEGER,
      allowNull:false,
      defaultValue:0
    }


  }, {
    sequelize,
    modelName: 'Spot',
  });
  Spot.beforeDestroy(async (spot, options) => {
    await sequelize.models.Image.destroy({
      where: {
        imageableType: 'Spot',
        imageableId: spot.id,
      },
    });
  });
  return Spot;
};





// 'use strict';

// const { User, Spot } = require('../models');

// const bcrypt = require("bcryptjs");

// let options = {};
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA;  // define your schema in options object
// }

// /** @type {import('sequelize-cli').Migration} */
// const spots = [
//   {
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
//       let users = await User.findAll();
//       spots[0].ownerId = arr[0];
//       spots[1].ownerId = arr[1];
//       spots[2].ownerId = arr[2];


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
//     let arr = await findIds();
//     options.tableName = 'Spots';
//     const Op = Sequelize.Op;
//     return queryInterface.bulkDelete(options, {
//       ownerId: { [Op.in]: [arr[0], arr[1], arr[2]] }
//     }, {});
//     /**
//      * Add commands to revert seed here.
//      *
//      * Example:
//      * await queryInterface.bulkDelete('People', null, {});
//      */
//   }
// };




//  async function findIds(){
//   let users = await User.findAll();


//   let arr = [];

//   let person1 = await User.findOne({where:{firstName:'Demo'}});
//   let person2 = await User.findOne({where:{firstName:'Fake'}});
//   let person3 = await User.findOne({where:{firstName:'user2'}});

//   arr.push(person1.id);
//   arr.push(person2.id);
//   arr.push(person3.id);

//   return arr;

//   }


//   module.exports = {
//     findIds
//   };
