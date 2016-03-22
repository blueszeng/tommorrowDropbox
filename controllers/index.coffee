#api = require('./api')
#module.exports =
#    apiBaseUrl: '/dropbox/api/'
#    api: api

module.exports =
{
  "/out" :
    get : () ->
      return (req, res, next) ->
        req.sendData = title: "bbbbbbbbbbbbout1111"
        #res.render('login', req.sendData)
       # console.log "aaaaaaaaaaaaa--->"
        next()

# next()
  '/out':
    get: () ->
      return (req, res, next) ->
        console.log "aaaaaaaaaaaaa--->"
        res.send(req.sendData)

}