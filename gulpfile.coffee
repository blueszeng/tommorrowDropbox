gulp = require 'gulp'
coffee = require 'gulp-coffee'
gutil = require 'gulp-util'
sourcemaps = require 'gulp-sourcemaps'
jade = require 'gulp-jade'
concat = require 'gulp-concat'
uglify = require 'gulp-uglify'
rev = require 'gulp-rev-append'


#通配符路径匹配示例：
#“src/a.js”：指定具体文件；
#“*”：匹配所有文件    例：src/*.js(包含src下的所有js文件)；
#“**”：匹配0个或多个子文件夹    例：src/**/*.js(包含src的0个或多个子文件夹下的js文件)；
#“{}”：匹配多个属性    例：src/{a,b}.js(包含a.js和b.js文件)  src/*.{jpg,png,gif}(src下的所有jpg/png/gif文件)；
#“!”：排除文件    例：!src/a.js(不包含src下的a.js文件)；

# sourcemaps  use .map  .js files to debug .coffee
gulp.task 'coffee', (cb) ->
 gulp.src 'lib/*.coffee'
 .pipe sourcemaps.init()
 .pipe coffee(bare:true).on 'error', gutil.log
 .pipe sourcemaps.write('maps')
 .pipe gulp.dest './public/lib'

# Compile Jade templates
gulp.task 'jade', (cb) ->
 gulp.src './views/*.jade'
 .pipe jade(client:true)
 .pipe gulp.dest './public/jade'

# 使用gulp-concat合并javascript文件，减少网络请求。
# concat  is sanys.
gulp.task 'concat', () ->
 gulp.src './public/lib/*.js'
 .pipe concat 'all.js'
 .pipe gulp.dest 'dist/js'

 # 使用gulp-uglify压缩javascript文件，减小文件大小。
gulp.task 'uglify', () ->
 gulp.src('./public/lib/*.js')
 .pipe uglify
   #mangle: true,//类型：Boolean 默认：true 是否修改变量名
   #compress: true,//类型：Boolean 默认：true 是否完全压缩
   #preserveComments: all //保留所有注释
   mangle: except: ['require' ,'exports' ,'module' ,'$']  #排除混淆关键字
 .pipe gulp.dest 'dist/js'

#使用gulp-rev-append给页面的引用添加版本号，清除页面引用缓存。  no pass
gulp.task 'rev', () ->
 gulp.src 'views/index.html'
 .pipe rev()
 .pipe gulp.dest 'dist/html'

# watch方法是用于监听文件变化，文件一修改就会执行指定的任务
#gulp.watch(glob [, opts], tasks) or gulp.watch(glob [, opts, cb])
gulp.task 'watch1', (cb) ->
 gulp.watch 'lib/*.coffee', ['coffee'],() ->
  console.log "watch..over"

gulp.task 'default', ['coffee','jade','concat','uglify','rev','watch1'], () ->
 console.log "exec end ..."
# 将你的默认的任务代码放在这

