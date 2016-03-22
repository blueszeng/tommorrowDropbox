var DBModelManger, _, config;

_ = require('underscore');

config = require('./../config');

DBModelManger = (function() {
  function DBModelManger() {
    this.stack = {};
    this.cache = {};
    this.configs = require('./../config/dbbind');
    this.initConfig = function() {
      var dbFun, dbType, ref, results;
      ref = this.configs;
      results = [];
      for (dbType in ref) {
        dbFun = ref[dbType];
        results.push(this.stack[dbType] = dbFun);
      }
      return results;
    };
    this.initConfig();
  }

  DBModelManger.prototype.inject = function(dbType, modelFun) {
    if (!_.isString(dbTypeor(!_.isFunction(modelFun)))) {
      new Error('push arguments error');
    }
    if (this.stack[dbType]) {
      this.stack[dbType];
    }
    return this.stack[dbType] = modelFun;
  };

  DBModelManger.prototype.get = function(modelName, dbType) {
    dbType = dbType ? dbType : config.db.default_db;
    if (!_.isString(dbType || !_.isString(modelName))) {
      new Error('push arguments error');
    }
    if (!this.stack[dbType]) {
      new Error(' get error no dbType');
    }
    if (this.cache[modelName]) {
      return this.cache[modelName];
    }
    return this.cache[modelName] = new this.stack[dbType](modelName, dbType);
  };

  return DBModelManger;

})();

module.exports = new DBModelManger();

//# sourceMappingURL=maps/dbmodelmanger.js.map
