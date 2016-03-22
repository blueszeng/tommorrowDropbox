approot = process.env.PWD
glob = require 'glob'
methods = require 'methods'
fs = require 'fs'
path = require 'path'
BaseController = require './base_controller'
exports.route = (app, paths) ->
  paths = paths || {}
#  app.set('view', approot, paths.template)
  app.set('views', path.join(approot, 'views'));
  app.set('view engine', 'jade');
  ctrlDir = approot + (paths.controllers || '/controllers')
  console.log "ctrDir", ctrlDir
  glob.sync(ctrlDir + '/**/*.+(coffee|js)').forEach (file) ->
    console.log "file", file
    file = file.replace(/\/index.(js|coffee)$/,'')

    router = require file
    single = typeof router == 'function'
    new Error("router not  is function") if not single
    path = file.replace(ctrlDir.replace(/\/$/,''),'')
        .replace(/\.(coffee|js)$/, '')
    console.log path
    for i of router
      p = path + i
      p = p.replace(/\/$/, '')  unless p == '/'
      r = router[i]
      methods.forEach (method) ->
        eachRouter = r[method]
        if eachRouter
          controller = new BaseController(eachRouter, p.replace(/^\//, ''), method)
          if controller.newName
            p = p.replace controller.name controller.newName
          console.log "route:" + method + ':' + p
          console.log [p].concat(controller.getRoutes())
          app[method].apply(app, [p].concat(controller.getRoutes()))








