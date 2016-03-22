superagent = require 'superagent'
should = require 'should'
describe 'express routes',  () ->
  it 'postData test', (done) ->
    user =
      name:   'zeng5'
      password:  '123456'
      discriable: "zengyonggaung"
    superagent.post 'localhost:3000/admin/user/postData'
    .send user
    .end (e, res) ->
      should.not.exist e
      (typeof res.body).should.equal('object')
      res.body.name.should.equal user.name
      done()
  it 'getData test', (done) ->
      console.log "sbsbs"
      superagent.get 'localhost:3000/admin/user/getData/zeng5'
      .end (e, res) ->
        should.not.exist e
        (typeof res.body).should.equal('object')
        res.body.should.eql
          name: 'zeng5'
          password: '123456'
          discriable: 'zengyonggaung'
        done()


