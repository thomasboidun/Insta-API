'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Picture extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Picture.belongsToMany(models.User, { through: models.UserPicture });
      Picture.belongsToMany(models.Comment, { through: models.PictureComment });
      Picture.hasMany(models.PictureComment);
    }
  };
  Picture.init({
    source: {
      type: DataTypes.STRING,
      // unique: true
    },
    desc: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Picture',
  });
  return Picture;
};