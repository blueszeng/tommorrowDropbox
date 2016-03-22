_ = require 'underscore'
class BaseModel
  constructor: (modelName, modelType, loadModel) ->

    @modelType = modelType
    @Model = loadModel modelName
    @Model.sync?()

    @params = {}
    @params.where = null
    @params.limit = 0
    @params.offset = 0
    @params.fields = null
    @params.order = ''
    @params.raw = false
    @result = null
    @action = null


  getModel: () ->
      @Model
  where: (param) ->
    @params.where = param
    @
  limit: (limit) ->
    @params.limit = limit
    @
  offset: (offset) ->
    @params.offset = offset
    @
  fields: (fields) ->
    @params.fields = fields
    @
  order: (order) ->
    @
  raw: (raw) ->
    @params.raw = raw
    @
  done: (callback)  ->
    if @action
      @action(callback)
      @params.where = null
      @params.limit = 0
      @params.offset = 0
      @params.fields = null
      @params.order = ''
      @params.raw = false
      @result = null
      @action = null
    else
      callback new Error('没有指定动作')

module.exports =
  BaseModel