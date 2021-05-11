'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('UserPictures', [
      {
        UserId: 1,
        PictureId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: 2,
        PictureId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserPictures', null, {})
  }
};
