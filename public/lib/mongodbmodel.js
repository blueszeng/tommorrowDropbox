var BaseModel, MongodbModel, loadMongoModel,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseModel = require('./basemodel');

loadMongoModel = (require('./baseinit')).loadMongoModel;

MongodbModel = (function(superClass) {
  extend(MongodbModel, superClass);

  function MongodbModel(modelName, modelType) {
    MongodbModel.__super__.constructor.call(this, modelName, modelType, loadMongoModel);
  }

  MongodbModel.prototype.order = function(order) {
    return this.params.order = order;
  };

  MongodbModel.prototype.findAll = function() {
    var self;
    self = this;
    this.action = function(callback) {
      return self.Model.find().where(self.params.where).skip(self.params.offset).limit(self.params.limit).select(self.params.fields ? self.params.fields.join(' ') : null).sort(self.params.order).then(function(data) {
        return callback(null, data);
      })["catch"](function(err) {
        return callback(err);
      });
    };
    return this;
  };

  MongodbModel.prototype.findById = function(id) {
    var self;
    self = this;
    this.action = function(callback) {
      self.params.where = self.params.where || {};
      self.params.where[_id] = id;
      return self.Model.findOne(self.params.where, self.params.fields ? self.params.fields.join(' ') : null).then(function(data) {
        return callback(null, data);
      })["catch"](function(err) {
        return callback(err);
      });
    };
    return this;
  };

  MongodbModel.prototype.findByField = function(field, value) {
    var self;
    self = this;
    this.action = function(callback) {
      self.params.where = self.params.where || {};
      self.params.where[field] = value;
      return self.Model.findOne(self.params.where, self.params.fields ? self.params.fields.join(' ') : null).then(function(data) {
        return callback(null, data);
      })["catch"](function(err) {
        return callback(err);
      });
    };
    return this;
  };

  MongodbModel.prototype.count = function() {
    var self;
    self = this;
    this.action = function(callback) {
      return self.Model.count(self.params.where).then(function(count) {
        return callback(null, count);
      })["catch"](function(err) {
        return callback(err);
      });
    };
    return this;
  };

  MongodbModel.prototype.add = function(kv) {
    var self;
    self = this;
    this.action = function(callback) {
      return self.Model.create(kv).then(function(data) {
        return callback(null, data);
      })["catch"](function(err) {
        return callback(err);
      });
    };
    return this;
  };

  MongodbModel.prototype.update = function(kv) {
    var self;
    self = this;
    return this.action = function(callback) {
      if (self.result) {
        self.Model.update({
          _id: self.result._id
        }, kv).then(function() {
          return callback(null);
        })["catch"](function(err) {
          return callback(err);
        });
      } else {
        self.Model.update(self.params.where, kv).then(function() {
          return callback(null);
        })["catch"](function(err) {
          return callback(err);
        });
      }
      return this;
    };
  };

  MongodbModel.prototype["delete"] = function() {
    var self;
    self = this;
    return this.action = function(callback) {
      if (self.result) {
        self.Model.remove({
          _id: self.result._id
        }).then(function(data) {
          return callback(null, data);
        })["catch"](function(err) {
          return callback(err);
        });
      } else {
        self.Model.remove(self.params.where).then(function() {
          return callback();
        });
      }
      return this;
    };
  };

  MongodbModel.prototype.addCount = function(key) {
    var self;
    self = this;
    return this.action = function(callback) {
      var obj;
      if (self.result) {
        obj = {};
        obj[key] = self.result[key] * 1 + 1;
        self.Model.update(obj({
          _id: self.result._id
        })).then(function() {
          return callback(null);
        })["catch"](function(err) {
          return callback(err);
        });
      } else {
        callback(new Error('先调用findBy再调用addCount，please'));
      }
      return this;
    };
  };

  return MongodbModel;

})(BaseModel);

module.exports = MongodbModel;

//# sourceMappingURL=maps/mongodbmodel.js.map
