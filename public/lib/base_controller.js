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
