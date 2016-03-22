config = require './../config'
path = require 'path'
filtersConfig = require './../config/filters.js'

class Controller
  constructor: (func, path, method) ->
    @func = func
    @filters = []
    @afterFilters = []
    @mainRounte = null
    @method = method
    @path = path
    @name = path.replace(/.*\//, "")
    @newName = null
    self = this
    for route of filtersConfig
      reg = RegExp route
      routeConfig = filtersConfig[route]
      if routeConfig[@method] and reg.test('/' + @path)
        routeConfig[@method].forEach (f) ->
          self.filters.push require(path.join(config.route.filters, f))
    @renderRoute = (req, res, next) ->
      console.log  res.render, path + '.jade',self.name + '.jade', req.sendData
      res.render(path + '.jade', req.sendData)

    @mainRoute = func.call @

  getRoutes: () ->
   # @filters.concat([@mainRoute]).concat(@afterFilters).concat [@renderRoute]
    @filters.concat([@mainRoute]).concat(@afterFilters)
  useFilters: (filters) ->
    self = @
    filters.forEach (filter_path)->
      self.filters.push require(path.join(config.base_path, config.route.filters, filter_path))
  userAfterFilters: (filters) ->
    self = @
    filters.forEach (filter_path)->
      self.afterFilters.push require(path.join(config.base_path, config.route.filters, filter_path))
  rename: (name) ->
    @newName = name

module.exports =
  Controller







