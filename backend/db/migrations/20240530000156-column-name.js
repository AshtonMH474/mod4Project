'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
options.tableName = 'Users';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(options,'firstName',{
      type: Sequelize.STRING(30),
      allowNull:false
    });

    await queryInterface.addColumn(options,'lastName',{
      type: Sequelize.STRING(30),
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
    await queryInterface.removeColumn(options, 'firstName');
    await queryInterface.removeColumn(options, 'lastName');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
