var BaseModel, _;

_ = require('underscore');

BaseModel = (function() {
  function BaseModel(modelName, modelType, loadModel) {
    var base;
    this.modelType = modelType;
    this.Model = loadModel(modelName);
    if (typeof (base = this.Model).sync === "function") {
      base.sync();
    }
    this.params = {};
    this.params.where = null;
    this.params.limit = 0;
    this.params.offset = 0;
    this.params.fields = null;
    this.params.order = '';
    this.params.raw = false;
    this.result = null;
    this.action = null;
  }

  BaseModel.prototype.getModel = function() {
    return this.Model;
  };

  BaseModel.prototype.where = function(param) {
    this.params.where = param;
    return this;
  };

  BaseModel.prototype.limit = function(limit) {
    this.params.limit = limit;
    return this;
  };

  BaseModel.prototype.offset = function(offset) {
    this.params.offset = offset;
    return this;
  };

  BaseModel.prototype.fields = function(fields) {
    this.params.fields = fields;
    return this;
  };

  BaseModel.prototype.order = function(order) {
    return this;
  };

  BaseModel.prototype.raw = function(raw) {
    this.params.raw = raw;
    return this;
  };

  BaseModel.prototype.done = function(callback) {
    if (this.action) {
      this.action(callback);
      this.params.where = null;
      this.params.limit = 0;
      this.params.offset = 0;
      this.params.fields = null;
      this.params.order = '';
      this.params.raw = false;
      this.result = null;
      return this.action = null;
    } else {
      return callback(new Error('没有指定动作'));
    }
  };

  return BaseModel;

})();

module.exports = BaseModel;

//# sourceMappingURL=maps/basemodel.js.map
