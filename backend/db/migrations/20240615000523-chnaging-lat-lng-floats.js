'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn({ tableName:'Spots', schema: options.schema},'lat',{
      type: Sequelize.FLOAT,
      allowNull:false
    });
    await queryInterface.changeColumn({ tableName:'Spots', schema: options.schema},'lng',{
      type: Sequelize.FLOAT,
      allowNull:false
    });
    await queryInterface.changeColumn({ tableName:'Spots', schema: options.schema},'avgRating',{
      type: Sequelize.FLOAT,
      allowNull:false
    });
    /**
     *
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn({ tableName:'Spots', schema: options.schema},'lat',{
      type: Sequelize.DECIMAL(10,7),
      allowNull:false
    });
    await queryInterface.changeColumn({ tableName:'Spots', schema: options.schema},'lng',{
      type: Sequelize.DECIMAL(10,7),
      allowNull:false
    });
    await queryInterface.changeColumn({ tableName:'Spots', schema: options.schema},'avgRating',{
      type: Sequelize.DECIMAL(2,1),
      allowNull:false
    });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
