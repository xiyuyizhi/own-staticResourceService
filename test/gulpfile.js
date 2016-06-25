var fs=require('fs'),
    gulp = require('gulp'),
    path = require('path'),
    clean = require('gulp-clean'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    revCss = require('gulp-rev-css-url'),
    releaseTasks = require('gulp-release-tasks'),
    seq = require('run-sequence'),
    ftp=require('gulp-ftp'),
    gutil=require('gulp-util'),
    own_fs_util=require('own-fs-util');

var CONFIG={
    revROOT:'dist/rev',
    DEPLOY:'F:/workspaceForWebstorm/staticResourceService/static',
    MANIFEST:'rev-manifest.json',
    tempResource:'dist/temp/',
    CDN:'http://192.168.0.117:3000/static/'
};

var STORE={
    pathArr:[]//存储rev之前
};

gulp.task('clean', function () {
    return gulp.src(['dist/temp/**'], {
        read: false
    })
        .pipe(clean({
            force: true
        }));
});


buildFn('js', 'src/js/**/**', 'js', 'js','isJs');
buildFn('css-image',['src/styles/**/**','src/image/**/**'],'styimg','stying');
revHtml('html', 'index.html', '');


gulp.task('default',['clean'],function (done) {
    //先读取上一次的所有资源名称
    own_fs_util.cancatJson(CONFIG.revROOT,CONFIG.MANIFEST,STORE.pathArr)
    setTimeout(function(){
        seq('js', 'css-image', 'html','beforeDeploy','deploy',done);
    },500)
});

gulp.task('beforeDeploy',function(){
    //遍历文件，没有修改过的 删掉
    fs.readdir(CONFIG.tempResource,function(err,files){
        own_fs_util.iteratorDelete(files,CONFIG.tempResource,STORE.pathArr);
    })
})



gulp.task('deploy',function(){
    setTimeout(function(){
        /*gulp.src(CONFIG.tempResource+'**!/!**')
            .pipe(gulp.dest(CONFIG.DEPLOY))*/
        gulp.src(CONFIG.tempResource+'**/**')
            .pipe(ftp({
                host:'192.168.0.117',
                user:'deploy',
                pass:'administrator'
            }))
            .pipe(gutil.noop())
    },1000)
})

releaseTasks(gulp);

function buildFn(taskName, srcPath, destPath, revPath,type) {
    if(type){
        gulp.task(taskName, function () {
            return gulp.src(srcPath)
                .pipe(rev())
                .pipe(gulp.dest(path.join(CONFIG.tempResource, destPath)))
                .pipe(rev.manifest())
                .pipe(gulp.dest(path.join('dist', 'rev/' + revPath)))
        })
    }else{
        gulp.task(taskName, function () {
            return gulp.src(srcPath)
                .pipe(rev())
                .pipe(revCss())
                .pipe(gulp.dest(path.join(CONFIG.tempResource, destPath)))
                .pipe(rev.manifest())
                .pipe(gulp.dest(path.join('dist', 'rev/' + revPath)))
        })
    }

}


function revHtml(taskName, srcPath, desPath) {
    gulp.task(taskName, function () {
        return gulp.src(['dist/rev/**/**.json', srcPath])
            .pipe(revCollector({
                replaceReved: true,
                dirReplacements: {
                    'cdn/': function (manifest_value) {
                        var p = require('path');
                        var suffix = p.extname(manifest_value).substring(1),
                            pathMap = {
                                'js': 'js',
                                'css': 'styimg'
                            },
                            path;
                        path = pathMap[suffix];
                        path = path || 'styimg';
                        return CONFIG.CDN + path + "/" + manifest_value;
                    }
                }
            }))
            .pipe(gulp.dest(path.join('dist', desPath)));
    });

}