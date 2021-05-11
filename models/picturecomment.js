'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PictureComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PictureComment.belongsTo(models.Comment);
      PictureComment.belongsTo(models.Picture);
    }
  };
  PictureComment.init({
    // PictureId: DataTypes.INTEGER,
    // CommentId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PictureComment',
  });
  return PictureComment;
};