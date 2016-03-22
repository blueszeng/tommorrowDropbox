#express = require 'express'

#apiRoutes = (middleware) ->
#  router = express.Router()
#  # add router callback
#  router.get '/zeng', middleware, (req, res, next) ->
#    res.render('api', { title: 'Express' });
#
#module.exports = apiRoutes
DBModelManger = require './../../lib/dbmodelmanger'

redisData = require './../../lib/redis_syn_monodb'
_ = require 'lodash'
module.exports =
{
  "/getData/:name" :
      get : () ->
          return (req, res, next) ->
            console.log "data111-->", req.params['name'], redisData
            redisData.getUserData(req.params['name'], (data) ->
                res.send(data)
            )
      post : () ->
        return (req, res, next) ->
          res.render('login', req.sendData)

           # next()
  '/postData':
    post: () ->
        return (req, res, next) ->
          userModle = DBModelManger.get('user')
          _query =  if _.isEmpty req.query then req.body  else req.query
          console.log "ccc", _query
          user =
            name:    _query.name  or  'test'
            password:   _query.password  or  '123456'
            discriable: _query.discriable  or "this is discriable"
          console.log "user:", user
          userModle.add(user).done (err, data) ->
            console.log "user:", err, data
            res.send(data)

  '/putData':
    get: () ->
      return (req, res, next) ->
        res.send("sbsbsbsbsbsb")
  '/delData':
    get: () ->
      return (req, res, next) ->
        res.send("sbsbsbsbsbsb")



}





