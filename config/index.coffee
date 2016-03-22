
config =
  port: 8080
  base_path: process.env.PWD
  assets_head: '/assets'
  session_secret: '12345567'
  script_ext: ".coffee"
  route:
      filters: ""
      controllers: ""
      template: ""
  db:
    db_dir_name: 'model'
    default_db: "mongodb"
#    mysql:
#      host: "127.0.0.1"
#      database: "user"
#      username: "root"
#      password: "123"
    mongodb:
      db:
        native_parser: true
      server:
        poolSize: 5
      user: ''
      pass: ''
      host: 'localhost'
      port: '27017'
      database: 'user'
module.exports =
  config
