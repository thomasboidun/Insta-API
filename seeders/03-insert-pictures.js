'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Pictures', [
      {
        // UserId: 1,
        source: "./",
        desc: "Hello wolrd!",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        // UserId: 2,
        source: "./",
        desc: "Welcome to Inst' Happy!",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Pictures', null, {})
  }
};
