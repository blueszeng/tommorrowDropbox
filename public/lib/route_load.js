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
