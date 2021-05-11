'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        firstname: null,
        lastname: null,
        username: "default.admin",
        RoleId: 1,
        email: "default.admin@intsaapi.lan",
        password: "$2b$10$8vB0p3mdAXw4o4h002Rld.5bcca5UsU.fqmXzNk.usJ0uNAfzRYCW", // admin
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: null,
        lastname: null,
        username: "default.user",
        RoleId: 2,
        email: "default.user@instaapi.lan",
        password: "$2b$10$OYURxJgKhoAl6b14TUliFe3ZHqHEIgc3dftRqX558AMEHXqf7E9Tm", // user
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
};
