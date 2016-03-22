logger = require 'morgan'
bodyParser = require 'body-parser'
express = require 'express'
favicon = require 'serve-favicon'
path = require 'path'
config = require './../config'
errors = require "./../errors"
log4js = require 'log4js'
#routes = require './../controllers'
routeLoad = require './../lib/route_load'
cookieParser = require 'cookie-parser'
session = require 'express-session'
#MongoStore = (require 'connect-mongo')(session)
RedisStore = require('connect-redis')(session)

module.exports =
  (app) ->
   # app.use favicon(path.join(__dirname, 'public', 'favicon.ico'));
    app.use logger('dev')
    log4js.configure
      appenders: [
          type: 'console'
      ]
    logger = log4js.getLogger('normal')
    logger.setLevel('INFO')
    app.use log4js.connectLogger(logger, level: log4js.levels.INFO)
    app.use bodyParser.json()
    app.use bodyParser.urlencoded({ extended: false })
    app.use cookieParser()
    app.use express.static(path.join(__dirname, 'public'))
    app.use(session(secret: config.session_secret, store: new RedisStore()))
#    app.use session (secret: config.session_secret, store: new MongoStore(db: "user"))

    #    app.use routes.apiBaseUrl ,
#        routes.api((req, res, next ) ->
#            next()
#    )
    routeLoad.route app

    app.use errors.error404
    app.use errors.error505

