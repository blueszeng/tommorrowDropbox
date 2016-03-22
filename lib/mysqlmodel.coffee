BaseModel = require './basemodel'
loadMySqlModel =  require './baseinit'.loadMySqlModel
class MysqlModel extends BaseModel
  constructor: (modelName, modelType) ->
   super modelName modelType loadMySqlModel
  order: (order) ->
   order_str = ''
   for  i in order
     order_str += i + ' ' + order[i] + ' '
   @params.order = order_str

  findAll: () ->
   self = @
   @action = (callback) ->
     self.Model.findAll
       where: self.params.where
       limit: self.params.limit
       offset: self.params.offset
       attributes: self.params.fields
       order: self.params.order
       raw: self.params.raw
     .then (data) ->
       callback(null, data)
     .catch (err) ->
       callback(err)
   @
  findById: (id) ->
   self = @
   @action = (callback) ->
     self.params.where = self.params.where || {}
     self.params.where.id = id
     self.Model.find
       where: self.params.where
       attributes: self.params.fields
       order: self.params.order
       raw: self.params.raw
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
     self.Model.find
       where: self.params.where
       attributes: self.params.fields
       order: self.params.order
       raw: self.params.raw
     .then (data) ->
       callback(null, data)
     .catch (err) ->
       callback(err)
   @
  count: () ->
   self = @
   @action = (callback) ->
     self.Model.count
       where: self.params.where
     .then (count) ->
       callback(null, count)
     .catch (err) ->
       callback(err)
   @
  add: (kv) ->
    self = @
    @action = (callback) ->
      self.Model.create(kv)
      .then () ->
        callback(null, data)
      .catch (err) ->
        callback(err)
    @
  update: (kv) ->
   self = @
   @action = (callback) ->
     if self.result
       fields = k = v = null
       fields = []
       for k in data
         v = data[k]
         if self.Model.rawAttributes[k]
           fields.push(k)
       self.result.updateAttributes kv, fields
       .then (data) ->
         callback(null, data)
       .catch (err) ->
         callback(err)
     else
       self.Model.update(kv, self.params.where)
       .catch () ->
         callback()
     @
  delete: () ->
    self = @
    @action = (callback) ->
      if self.result
        self.result.destroy()
        .then (data) ->
          callback(null, data)
        .catch (err) ->
         callback(err)
      else
        self.Model.destroy self.params.where
        .then () ->
          callback()
      @
  addCount: (key) ->
    self = @
    @action = (callback) ->
      if self.result
        obj = {}
        obj[key] = self.result[key] * 1 + 1
        self.result.updateAttributes(obj, [key])
        .then (data) ->
          callback(null, data)
        .catch (err) ->
          callback(err)
      else
        callback(new Error('先调用findBy再调用addCount，please'))
      @
module.exports =
  MysqlModel