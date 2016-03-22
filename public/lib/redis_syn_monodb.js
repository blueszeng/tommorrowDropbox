var DBModelManger, _getUserData, client, redis, userModle;

redis = require('redis');

client = redis.createClient();

DBModelManger = require('./dbmodelmanger');

userModle = DBModelManger.get('user');

_getUserData = function(_username, cb) {
  return client.hgetall(_username, function(err, object) {
    if (err) {
      return cb("is serr");
    }
    if (object) {
      return cb(object);
    } else {
      return userModle.findByField("name", _username).done(function(err, data) {
        var _save_data;
        if (err) {
          return cb("is serr");
        }
        if (data) {
          _save_data = {
            name: data.name,
            password: data.password,
            discriable: data.discriable
          };
          return client.hmset(_username, _save_data, function(err) {
            console.log("errrr-->", err);
            return cb(_save_data);
          });
        }
      });
    }
  });
};

module.exports = {
  getUserData: _getUserData
};

//# sourceMappingURL=maps/redis_syn_monodb.js.map
