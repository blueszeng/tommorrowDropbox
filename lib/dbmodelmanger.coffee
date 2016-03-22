_ = require 'underscore'
config = require './../config'
class DBModelManger
  constructor: () ->
    @stack = {}
    @cache = {}
    @configs =  require './../config/dbbind'
    @initConfig = () ->
      for dbType, dbFun of @configs
        @stack[dbType] = dbFun
    @initConfig()

  inject: (dbType, modelFun) ->
    if not _.isString dbTypeor not _.isFunction modelFun
      new Error 'push arguments error'
    if  @stack[dbType]
      @stack[dbType]
    @stack[dbType] = modelFun

  get: (modelName, dbType) ->
    dbType = if dbType then dbType else  config.db.default_db
    if not _.isString dbType  or not _.isString modelName
      new Error 'push arguments error'
    if not @stack[dbType]
      new Error ' get error no dbType'
    if @cache[modelName]
      return @cache[modelName]
    @cache[modelName] =
      new @stack[dbType](modelName, dbType)


module.exports =
  new DBModelManger()


