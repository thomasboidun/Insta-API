'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('PictureComments', [
      {
        PictureId: 2,
        CommentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        PictureId: 1,
        CommentId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('PictureComments', null, {})
  }
};
