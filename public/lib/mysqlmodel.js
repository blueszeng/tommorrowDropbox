var BaseModel, MysqlModel, loadMySqlModel,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseModel = require('./basemodel');

loadMySqlModel = require('./baseinit'.loadMySqlModel);

MysqlModel = (function(superClass) {
  extend(MysqlModel, superClass);

  function MysqlModel(modelName, modelType) {
    MysqlModel.__super__.constructor.call(this, modelName(modelType(loadMySqlModel)));
  }

  MysqlModel.prototype.order = function(order) {
    var i, j, len, order_str;
    order_str = '';
    for (j = 0, len = order.length; j < len; j++) {
      i = order[j];
      order_str += i + ' ' + order[i] + ' ';
    }
    return this.params.order = order_str;
  };

  MysqlModel.prototype.findAll = function() {
    var self;
    self = this;
    this.action = function(callback) {
      return self.Model.findAll({
        where: self.params.where,
        limit: self.params.limit,
        offset: self.params.offset,
        attributes: self.params.fields,
        order: self.params.order,
        raw: self.params.raw
      }).then(function(data) {
        return callback(null, data);
      })["catch"](function(err) {
        return callback(err);
      });
    };
    return this;
  };

  MysqlModel.prototype.findById = function(id) {
    var self;
    self = this;
    this.action = function(callback) {
      self.params.where = self.params.where || {};
      self.params.where.id = id;
      return self.Model.find({
        where: self.params.where,
        attributes: self.params.fields,
        order: self.params.order,
        raw: self.params.raw
      }).then(function(data) {
        return callback(null, data);
      })["catch"](function(err) {
        return callback(err);
      });
    };
    return this;
  };

  MysqlModel.prototype.findByField = function(field, value) {
    var self;
    self = this;
    this.action = function(callback) {
      self.params.where = self.params.where || {};
      self.params.where[field] = value;
      return self.Model.find({
        where: self.params.where,
        attributes: self.params.fields,
        order: self.params.order,
        raw: self.params.raw
      }).then(function(data) {
        return callback(null, data);
      })["catch"](function(err) {
        return callback(err);
      });
    };
    return this;
  };

  MysqlModel.prototype.count = function() {
    var self;
    self = this;
    this.action = function(callback) {
      return self.Model.count({
        where: self.params.where
      }).then(function(count) {
        return callback(null, count);
      })["catch"](function(err) {
        return callback(err);
      });
    };
    return this;
  };

  MysqlModel.prototype.add = function(kv) {
    var self;
    self = this;
    this.action = function(callback) {
      return self.Model.create(kv).then(function() {
        return callback(null, data);
      })["catch"](function(err) {
        return callback(err);
      });
    };
    return this;
  };

  MysqlModel.prototype.update = function(kv) {
    var self;
    self = this;
    return this.action = function(callback) {
      var fields, j, k, len, v;
      if (self.result) {
        fields = k = v = null;
        fields = [];
        for (j = 0, len = data.length; j < len; j++) {
          k = data[j];
          v = data[k];
          if (self.Model.rawAttributes[k]) {
            fields.push(k);
          }
        }
        self.result.updateAttributes(kv, fields).then(function(data) {
          return callback(null, data);
        })["catch"](function(err) {
          return callback(err);
        });
      } else {
        self.Model.update(kv, self.params.where)["catch"](function() {
          return callback();
        });
      }
      return this;
    };
  };

  MysqlModel.prototype["delete"] = function() {
    var self;
    self = this;
    return this.action = function(callback) {
      if (self.result) {
        self.result.destroy().then(function(data) {
          return callback(null, data);
        })["catch"](function(err) {
          return callback(err);
        });
      } else {
        self.Model.destroy(self.params.where).then(function() {
          return callback();
        });
      }
      return this;
    };
  };

  MysqlModel.prototype.addCount = function(key) {
    var self;
    self = this;
    return this.action = function(callback) {
      var obj;
      if (self.result) {
        obj = {};
        obj[key] = self.result[key] * 1 + 1;
        self.result.updateAttributes(obj, [key]).then(function(data) {
          return callback(null, data);
        })["catch"](function(err) {
          return callback(err);
        });
      } else {
        callback(new Error('先调用findBy再调用addCount，please'));
      }
      return this;
    };
  };

  return MysqlModel;

})(BaseModel);

module.exports = MysqlModel;

//# sourceMappingURL=maps/mysqlmodel.js.map
