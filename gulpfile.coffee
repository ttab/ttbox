require('coffee-script/register')
gulp       = require 'gulp'
coffee     = require 'gulp-coffee'
autoReload = require 'gulp-auto-reload'
sourcemaps = require 'gulp-sourcemaps'
replace    = require 'gulp-replace'
fs         = require 'fs'

gulp.task 'compile', ->
    css = fs.readFileSync './src/ttbox.css', encoding:'utf-8'
    gulp.src './src/*.coffee'
        .pipe sourcemaps.init()
        .pipe replace '%%%CSSSTYLES%%%%', css
        .pipe coffee()
        .on 'error', (e) ->
              console.log e.toString()
              @emit 'end'
        .pipe sourcemaps.write()
        .pipe gulp.dest './lib'

gulp.task 'watch', ['compile'], ->

    # server instance
    reloader = autoReload()
    # copy the client side script
    reloader.script()
        .pipe gulp.dest './lib'

    # watch rebuilt stuff
    gulp.watch ['./lib/*.js', './*.html'], reloader.onChange

    # watch to recompile
    gulp.watch ['./src/*'], ['compile']
