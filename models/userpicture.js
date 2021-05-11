'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserPicture extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserPicture.belongsTo(models.User);
      UserPicture.belongsTo(models.Picture);
    }
  };
  UserPicture.init({
    // UserId: DataTypes.INTEGER,
    // PictureId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserPicture',
  });
  return UserPicture;
};