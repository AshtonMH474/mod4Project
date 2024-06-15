'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(
        models.User,{foreignKey:'userId'});

        Booking.belongsTo(
          models.Spot,{foreignKey:'spotId'});
    }
  }
  Booking.init({
    spotId:{
    type: DataTypes.INTEGER,
    allowNull:false
    },
    userId:{
    type: DataTypes.INTEGER,
    allowNull:false
    },
    startDate:{
    type: DataTypes.DATEONLY,
    allowNull:false,
    validate: {
      isDate:true,
      isTodayOrFuture(value){
          const currentDate = new Date();
          if (new Date(value) < currentDate) {
            throw Error();
        }

      }
    }
    },
    endDate:{
     type:DataTypes.DATEONLY,
     allowNull:false,
     validate: {
      isDate:true,
      afterStartDate(value){
        if (new Date(value) <= new Date(this.startDate)) throw Error();
      }
     }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
