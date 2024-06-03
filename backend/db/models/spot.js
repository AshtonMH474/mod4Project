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
        models.User,
        {
          foreignKey:'ownerId'
        }
      )
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
      allowNull:false
    },
    city:{
      type:DataTypes.STRING,
      allowNull:false
    },
    state:{
      type:DataTypes.STRING,
      allowNull:false
    },
    country:{
      type:DataTypes.STRING,
      allowNull:false
    },
    lat: {
      type:DataTypes.DECIMAL(10,7),
      allowNull:false,
      validate:{
        isNumeric:true,
      notEmpty:true,
      isDecimal:true
      }
    },
    lng: {
      type:DataTypes.DECIMAL(10,7),
      allowNull:false,
      validate:{
        isNumeric:true,
      notEmpty:true,
      isDecimal:true
      }
    },
    name:{
      type: DataTypes.STRING,
      validate: {
        len:[0,25]
      }
    },
    description:{
      type: DataTypes.STRING,
      validate: {
        len:[0,100]
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull:false,
      validate: {
        isNumeric:true,
        notEmpty:true,
      }
    },
    avgRating: {
      type: DataTypes.DECIMAL(2,1),
      allowNull:false,
      validate: {
        isNumeric:true,
        notEmpty:true,
        isDecimal:true
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
  return Spot;
};
