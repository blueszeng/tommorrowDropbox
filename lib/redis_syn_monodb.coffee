redis = require 'redis'
client = redis.createClient()
DBModelManger = require './dbmodelmanger'
userModle = DBModelManger.get('user')


_getUserData = (_username, cb) ->
  client.hgetall(_username, (err, object) ->
     if err
       return cb("is serr")
     if object
       return cb(object)
     else
       userModle.findByField("name", _username).done (err,data) ->
         if err
          return  cb("is serr")
         if data
           _save_data =
             name: data.name
             password: data.password
             discriable: data.discriable
           client.hmset(_username, _save_data, (err) ->
              console.log "errrr-->", err
              cb(_save_data)
           )


  )

module.exports =
  getUserData: _getUserData

