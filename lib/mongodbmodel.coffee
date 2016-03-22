BaseModel = require './basemodel'
loadMongoModel = (require './baseinit').loadMongoModel
class MongodbModel extends BaseModel
  constructor: (modelName, modelType) ->
    super(modelName, modelType, loadMongoModel)
  order: (order) ->
    @params.order = order

  findAll: () ->
    self = @
    @action = (callback) ->
      self.Model.find()
      .where(self.params.where)
      .skip(self.params.offset)
      .limit(self.params.limit)
      .select( if self.params.fields  then self.params.fields.join(' ') else null )
      .sort(self.params.order)
      .then (data) ->
        callback(null, data)
      .catch (err) ->
        callback(err)
    @
  findById: (id) ->
    self = @
    @action = (callback) ->
      self.params.where = self.params.where || {}
      self.params.where[_id] = id
      self.Model.findOne(self.params.where, if self.params.fields then  self.params.fields.join(' ') else null)
      .then (data) ->
        callback(null, data)
      .catch (err) ->
        callback(err)
    @
  findByField: (field, value) ->
    self = @
    @action = (callback) ->
      self.params.where = self.params.where || {}
      self.params.where[field] = value
      self.Model.findOne(self.params.where, if self.params.fields then self.params.fields.join(' ') else null)
      .then (data) ->
        callback(null, data)
      .catch (err) ->
        callback(err)
    @
  count: () ->
    self = @
    @action = (callback) ->
      self.Model.count self.params.where
      .then (count) ->
        callback(null, count)
      .catch (err) ->
        callback(err)
    @
  add: (kv) ->
    self = @
    @action = (callback) ->
      self.Model.create(kv)
      .then (data) ->
        callback(null, data)
      .catch (err) ->
        callback(err)
    @
  update: (kv) ->
    self = @
    @action = (callback) ->
      if self.result
        self.Model.update
          _id: self.result._id
          kv
        .then () ->
          callback(null)
        .catch (err) ->
          callback(err)
      else
        self.Model.update(self.params.where, kv)
        .then () ->
          callback(null)
        .catch (err) ->
          callback(err)
      @
  delete: () ->
    self = @
    @action = (callback) ->
      if self.result
        self.Model.remove
          _id: self.result._id
        .then (data) ->
          callback(null, data)
        .catch (err) ->
          callback(err)
      else
        self.Model.remove self.params.where
        .then () ->
          callback()
      @
  addCount: (key) ->
    self = @
    @action = (callback) ->
      if self.result
        obj = {}
        obj[key] = self.result[key] * 1 + 1
        self.Model.update obj
          _id: self.result._id
        .then () ->
          callback(null)
        .catch (err) ->
          callback(err)
      else
        callback(new Error('先调用findBy再调用addCount，please'))
      @


module.exports =
  MongodbModel
