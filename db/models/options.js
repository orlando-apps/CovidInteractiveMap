const { Model, DataTypes } = require('sequelize');

const attributes ={
  option_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey:true
  },
  type: {
    type: DataTypes.STRING,
    allowNull:false
  },
}

const factory = (sequelize) => {
  class Options extends Model{}
  Options.init(attributes, { sequelize, modelName:'options' });
  return Options;
}

module.exports.factory = factory;