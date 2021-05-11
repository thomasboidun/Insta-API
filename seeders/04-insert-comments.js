'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Comments', [
      {
        UserId: 1,
        content: "\\_(*o*)_/",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: 2,
        content: "<3 <3 <3",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Comments', null, {})
  }
};
