var Controller, config, filtersConfig, path;

config = require('./../config');

path = require('path');

filtersConfig = require('./../config/filters.js');

Controller = (function() {
  function Controller(func, path, method) {
    var reg, route, routeConfig, self;
    this.func = func;
    this.filters = [];
    this.afterFilters = [];
    this.mainRounte = null;
    this.method = method;
    this.path = path;
    this.name = path.replace(/.*\//, "");
    this.newName = null;
    self = this;
    for (route in filtersConfig) {
      reg = RegExp(route);
      routeConfig = filtersConfig[route];
      if (routeConfig[this.method] && reg.test('/' + this.path)) {
        routeConfig[this.method].forEach(function(f) {
          return self.filters.push(require(path.join(config.route.filters, f)));
        });
      }
    }
    this.renderRoute = function(req, res, next) {
      console.log(res.render, path + '.jade', self.name + '.jade', req.sendData);
      return res.render(path + '.jade', req.sendData);
    };
    this.mainRoute = func.call(this);
  }

  Controller.prototype.getRoutes = function() {
    return this.filters.concat([this.mainRoute]).concat(this.afterFilters);
  };

  Controller.prototype.useFilters = function(filters) {
    var self;
    self = this;
    return filters.forEach(function(filter_path) {
      return self.filters.push(require(path.join(config.base_path, config.route.filters, filter_path)));
    });
  };

  Controller.prototype.userAfterFilters = function(filters) {
    var self;
    self = this;
    return filters.forEach(function(filter_path) {
      return self.afterFilters.push(require(path.join(config.base_path, config.route.filters, filter_path)));
    });
  };

  Controller.prototype.rename = function(name) {
    return this.newName = name;
  };

  return Controller;

})();

module.exports = Controller;

//# sourceMappingURL=maps/base_controller.js.map

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

var DBModelManger, _getUserData, client, redis, userModle;

redis = require('redis');

client = redis.createClient();

DBModelManger = require('./dbmodelmanger');

userModle = DBModelManger.get('user');

_getUserData = function(_username, cb) {
  return client.hgetall(_username, function(err, object) {
    if (err) {
      return cb("is serr");
    }
    if (object) {
      return cb(object);
    } else {
      return userModle.findByField("name", _username).done(function(err, data) {
        var _save_data;
        if (err) {
          return cb("is serr");
        }
        if (data) {
          _save_data = {
            name: data.name,
            password: data.password,
            discriable: data.discriable
          };
          return client.hmset(_username, _save_data, function(err) {
            console.log("errrr-->", err);
            return cb(_save_data);
          });
        }
      });
    }
  });
};

module.exports = {
  getUserData: _getUserData
};

//# sourceMappingURL=maps/redis_syn_monodb.js.map

var BaseController, approot, fs, glob, methods, path;

approot = process.env.PWD;

glob = require('glob');

methods = require('methods');

fs = require('fs');

path = require('path');

BaseController = require('./base_controller');

exports.route = function(app, paths) {
  var ctrlDir;
  paths = paths || {};
  app.set('views', path.join(approot, 'views'));
  app.set('view engine', 'jade');
  ctrlDir = approot + (paths.controllers || '/controllers');
  console.log("ctrDir", ctrlDir);
  return glob.sync(ctrlDir + '/**/*.+(coffee|js)').forEach(function(file) {
    var i, p, r, results, router, single;
    console.log("file", file);
    file = file.replace(/\/index.(js|coffee)$/, '');
    router = require(file);
    single = typeof router === 'function';
    if (!single) {
      new Error("router not  is function");
    }
    path = file.replace(ctrlDir.replace(/\/$/, ''), '').replace(/\.(coffee|js)$/, '');
    console.log(path);
    results = [];
    for (i in router) {
      p = path + i;
      if (p !== '/') {
        p = p.replace(/\/$/, '');
      }
      r = router[i];
      results.push(methods.forEach(function(method) {
        var controller, eachRouter;
        eachRouter = r[method];
        if (eachRouter) {
          controller = new BaseController(eachRouter, p.replace(/^\//, ''), method);
          if (controller.newName) {
            p = p.replace(controller.name(controller.newName));
          }
          console.log("route:" + method + ':' + p);
          console.log([p].concat(controller.getRoutes()));
          return app[method].apply(app, [p].concat(controller.getRoutes()));
        }
      }));
    }
    return results;
  });
};

//# sourceMappingURL=maps/route_load.js.map
