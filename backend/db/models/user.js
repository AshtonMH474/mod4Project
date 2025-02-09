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
        })

        User.hasMany(models.Image, {
          foreignKey: 'imageableId',
          onDelete:'CASCADE',
          constraints: false,
          scope: {
            imageableType: 'User'
          }
        })

        User.hasMany(
          models.Review,
          {
            foreignKey:'userId',
            onDelete:'CASCADE',
            hooks:true
          })


          User.hasMany(
            models.Booking,
            {
              foreignKey:'userId',
              onDelete:'CASCADE',
              hooks:true
            })
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
  User.beforeDestroy(async (user, options) => {
    await sequelize.models.Image.destroy({
      where: {
        imageableType: 'User',
        imageableId: user.id,
      },
    });
  });
  return User;
};
