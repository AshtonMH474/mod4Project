'use strict';


const { Image,Spot } = require('../models');

const bcrypt = require("bcryptjs");



let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const spotImages = [
  {
    imageableType:'Spot',
    preview:true,
    url:'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhvdXNlfGVufDB8fDB8fHww'
  },
  {
    imageableType:'Spot',
    preview:true,
    url:'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGhvdXNlfGVufDB8fDB8fHww'
  },
  {
    imageableType:'Spot',
    preview:true,
    url:'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG91c2V8ZW58MHx8MHx8fDA%3D'
  },
  {
    imageableType:'Spot',
    preview:false,
    url:'https://media.istockphoto.com/id/1778738751/photo/summer-is-over-in-the-garden.webp?b=1&s=170667a&w=0&k=20&c=wUUWhgbs-sDdQ6yGrkH3dmJVUbuJ6WNcEkfzMCWOSr8='
  },
  {
    imageableType:'Spot',
    preview:false,
    url:'https://media.istockphoto.com/id/1455374627/photo/single-story-suburban-home-exterior-with-large-driveway.webp?b=1&s=170667a&w=0&k=20&c=tComMql95oxAvFe_f-qwN7c1zjadva-3113qBbvZVV8='
  },
  {
    imageableType:'Spot',
    preview:false,
    url:'https://media.istockphoto.com/id/1496294487/photo/firepit-area-in-back-yard.jpg?s=2048x2048&w=is&k=20&c=RC_dUINHPoFDBPMb0jBCXN95aoN57oCcs1GSgbnjN98='
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    let arr = await findSpotIds();
    spotImages[0].imageableId = arr[0];
    spotImages[1].imageableId = arr[1];
    spotImages[2].imageableId = arr[2];
    spotImages[3].imageableId = arr[1];
    spotImages[4].imageableId = arr[2];
    spotImages[5].imageableId = arr[0];

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
    // let arr = await findSpotIds();



    options.tableName = 'Images';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhvdXNlfGVufDB8fDB8fHww',
      'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGhvdXNlfGVufDB8fDB8fHww',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG91c2V8ZW58MHx8MHx8fDA%3D',
      'https://media.istockphoto.com/id/1778738751/photo/summer-is-over-in-the-garden.webp?b=1&s=170667a&w=0&k=20&c=wUUWhgbs-sDdQ6yGrkH3dmJVUbuJ6WNcEkfzMCWOSr8=',
      'https://media.istockphoto.com/id/1455374627/photo/single-story-suburban-home-exterior-with-large-driveway.webp?b=1&s=170667a&w=0&k=20&c=tComMql95oxAvFe_f-qwN7c1zjadva-3113qBbvZVV8=',
      'https://media.istockphoto.com/id/1496294487/photo/firepit-area-in-back-yard.jpg?s=2048x2048&w=is&k=20&c=RC_dUINHPoFDBPMb0jBCXN95aoN57oCcs1GSgbnjN98='
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


async function findSpotIds(){
  let arr = [];

  let spot1 = await Spot.findOne({where:{address:'123 Disney Lane'}});
  let spot2 = await Spot.findOne({where:{address:'24 Grand Cayon Ave'}});
  let spot3 = await Spot.findOne({where:{address:'965 Breaking Bad'}});

  arr.push(spot1.id, spot2.id,spot3.id);

  return arr;
}
