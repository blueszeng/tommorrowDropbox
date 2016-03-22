var Schema, Sequelize, _loadMongoModel, _loadMySqlModel, config, db, mongoose, path, sequelize;

config = require('./../config');

path = require('path');

db = config.db;

if (db.mysql) {
  Sequelize = require('sequelize');
  sequelize = new Sequelize(db.mysql.database, db.mysql.username, db.mysql.password({
    define: {
      underscored: false,
      freezeTableName: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: false
    },
    host: db.mysql.host,
    maxConcurrentQueries: 120,
    logging: true
  }));
  console.log("mysql connect..");
} else {
  console.log("no configure mysql..");
}

_loadMySqlModel = function(modelName) {
  var model_config, obj, options;
  model_config = require(path.join(config.base_path, db.db_dir_name, modelName + config.script_ext));
  options = {};
  if (model_config.tableName) {
    options.tableName = model_config.tableName;
    delete model_config.tableName;
  }
  obj = sequelize.define(modelName.replace(/\/|\\/g, '_'), model_config, options);
  obj.db_type = 'sql';
  return obj;
};

if (db.mongodb) {
  mongoose = require('mongoose');
  Schema = mongoose.Schema;
  mongoose.connect('mongodb://localhost/user');
  console.log("mongoose connect..");
} else {
  console.log("no configure mongoose..");
}

_loadMongoModel = function(modelName) {
  var MongoModel;
  MongoModel = mongoose.model(modelName.replace(/\//g, '_'), new Schema(require(path.join(config.base_path, db.db_dir_name, modelName + config.script_ext))));
  MongoModel.db_type = 'mongodb';
  return MongoModel;
};

module.exports = {
  loadMySqlModel: _loadMySqlModel,
  loadMongoModel: _loadMongoModel
};

//# sourceMappingURL=maps/baseinit.js.map
