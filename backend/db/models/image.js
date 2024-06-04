'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {

    getImageable(options){
      if(!this.imageableType) return Promise.resolve(null);
      const imageType = `get${this.imageableType}`;
      return this[imageType](options);
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(models.User, {
        foreignKey:"imageableId",
        constraints:false
      })

      Image.belongsTo(models.Spot, {
        foreignKey:"imageableId",
        constraints:false
      })

      Image.belongsTo(models.Review, {
        foreignKey:"imageableId",
        constraints:false
      })
    }
  }
  Image.init({
    imageableType:{
    type: DataTypes.ENUM("User","Spot", "Review"),
    },
    imageableId:{
    type:DataTypes.INTEGER,
    },
    url:{
     type:DataTypes.TEXT,
     allowNull:false
    },
    preview:{
     type:DataTypes.BOOLEAN,
     allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
