'use strict';

const { User, Spot,Image } = require('../models');

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */


const spotImages = [
  {
    imageableType:'Spot',
    preview:true,
    url:'https://media.istockphoto.com/id/1186784465/photo/enchanting-fairy-tree-home-inside-an-old-white-oak.jpg?s=612x612&w=0&k=20&c=XLN1e5l26tDCHh4eMH0RscTmH1z7BaHHryvJvJtlNKQ='
  },
  {
    imageableType:'Spot',
    preview:true,
    url:'https://i.pinimg.com/originals/a6/56/dd/a656dd97b6dc750d2ca216bad90a0df1.png'
  },
  {
    imageableType:'Spot',
    preview:true,
    url:'https://preview.redd.it/eric-cartmans-house-from-southpark-v0-8evpi18x4pja1.jpg?width=640&crop=smart&auto=webp&s=f842da38aae50c9f8321503af7c99f8087401955'
  }
]
const spots = [
  {
    address: "fairyland 666",
    city: "Clevland",
    state: "Ohio",
    country: "United States of America",
    lat: 38.7645358,
    lng: -120.4730327,
    name: "Wonderland",
    description: "Step through the enchanting gate of Wonderland, a captivating abode nestled in the heart of a lush, garden paradise. As you enter this spellbinding home, you are greeted by a charming, ivy-clad façade that seems to whisper secrets of magical tales. Inside, Wonderland unfolds like a storybook, with each room a unique chapter of comfort and imagination. The living area features an elegant blend of vintage charm and modern luxury, with walls adorned in whimsical wallpaper depicting fantastical landscapes. Plush velvet sofas and cozy armchairs invite you to relax and revel in the serene atmosphere, while an intricately carved fireplace adds a touch of old-world magic. The kitchen is a chef’s dream, equipped with state-of-the-art appliances hidden behind charming cabinetry. A grand island takes center stage, topped with marble and surrounded by high-backed stools, making it the perfect spot for casual dining or lively gatherings. Wonderland’s dining room is a feast for the eyes, with a long, oak table set beneath a sparkling chandelier. The room is framed by floor-to-ceiling windows that overlook a breathtaking garden filled with vibrant flowers, whimsical sculptures, and a winding cobblestone path leading to a serene pond. Each bedroom in Wonderland offers a different adventure. The master suite boasts a canopy bed draped in ethereal linens, while the en-suite bathroom features a luxurious freestanding tub set against a backdrop of mosaic tiles. Children’s rooms are adorned with playful themes, from enchanted forests to starlit skies, each designed to inspire dreams of fantastical worlds. The outdoor space of Wonderland is a retreat in itself, with a charming gazebo perfect for afternoon tea, a sparkling swimming pool with mosaic tiles reflecting the sky, and a sun-drenched patio for al fresco dining. The garden is an ever-changing canvas of color and wonder, with hidden nooks for reading, meditating, or simply enjoying the tranquility. Wonderland isn’t just a home; it’s a journey into a realm where everyday life merges seamlessly with the extraordinary, inviting you to live your own fairy tale.",
    price: 142,

  },
  {
    address: "spongebob house 365",
    city: "Biknki Bottom",
    state: "Hawaii",
    country: "United States of America",
    lat: 37.7645358,
    lng: -122.4730327,
    name: "pineapple",
    description: "SpongeBobs house is a vibrant, pineapple-shaped wonder with bright yellow walls, a quirky underwater garden, and cozy, ocean-themed interiors. It’s a whimsical, cheerful abode that captures the spirit of Bikini Bottom.",
    price: 123,

  },
  {
    address: "the sunny 402",
    city: "Denver",
    state: "Colordao",
    country: "United States of America",
    lat: 37.7645358,
    lng: -122.4730327,
    name: "South Park",
    description: "The South Park house is a modest, square suburban home with a classic American look. Its unassuming exterior contrasts with the wild antics of its residents, reflecting the town’s quirky charm.",
    price: 123,

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

    let arr = await findSpotIds();
    spotImages[0].imageableId = arr[0];
    spotImages[1].imageableId = arr[1];
    spotImages[2].imageableId = arr[2];


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
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
  await queryInterface.bulkDelete(options, {
      address: { [Op.in]: ["fairyland 666",
      'spongebob house 365', 'the sunny 402'] }
    }, {});

    options.tableName = 'Images';
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://media.istockphoto.com/id/1186784465/photo/enchanting-fairy-tree-home-inside-an-old-white-oak.jpg?s=612x612&w=0&k=20&c=XLN1e5l26tDCHh4eMH0RscTmH1z7BaHHryvJvJtlNKQ=',
      'https://i.pinimg.com/originals/a6/56/dd/a656dd97b6dc750d2ca216bad90a0df1.png',
      'https://preview.redd.it/eric-cartmans-house-from-southpark-v0-8evpi18x4pja1.jpg?width=640&crop=smart&auto=webp&s=f842da38aae50c9f8321503af7c99f8087401955',
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


  async function findSpotIds(){
    let arr = [];

    let spot1 = await Spot.findOne({where:{address:'fairyland 666'}});
    let spot2 = await Spot.findOne({where:{address:'spongebob house 365'}});
    let spot3 = await Spot.findOne({where:{address:'the sunny 402'}});

    arr.push(spot1.id, spot2.id,spot3.id);

    return arr;
  }
