var fs=require('fs'),
    gulp = require('gulp'),
    path = require('path'),
    clean = require('gulp-clean'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    revCss = require('gulp-rev-css-url'),
    releaseTasks = require('gulp-release-tasks'),
    seq = require('run-sequence');

var CONFIG={
    revROOT:'dist/rev',
    DEPLOY:'F:/gitServer/staticResourceService/static',
    MANIFEST:'rev-manifest.json',
    tempResource:'dist/temp/',
    CDN:'http://127.0.0.1:3000/static/'
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


buildFn('js', 'src/js/*', 'js', 'js');
buildFn('css', 'src/styles/*', 'styles', 'styles');
buildFn('image', 'src/image/*', 'image', 'image');
revHtml('html', 'index.html', '');


gulp.task('default',['clean'],function (done) {
    fs.readdir(CONFIG.revROOT,function(err,files){
        if(err){
            return false;
        }
        console.log(files)
        if(files.length){
            files.forEach(function(item){
                fs.readFile(CONFIG.revROOT+'/'+item+'/'+CONFIG.MANIFEST,'utf-8',function(err,data){
                    if(err){
                        return false;
                    }
                    var json=JSON.parse(data);
                    for(var name in json){
                        STORE.pathArr.push(json[name]);
                    }
                })
            })
        }

    })

    setTimeout(function(){
        console.log(STORE.pathArr)
        seq('js', 'css', 'image', 'html','beforeDeploy','deploy',done);
    },500)
});

gulp.task('beforeDeploy',function(){
    console.log('beforeDeploy');
    fs.readdir('dist/temp',function(err,files){
        files.forEach(function(item){
            fs.readdir(CONFIG.tempResource+item,function(err,files){
                console.log(files);
                if(err){
                    return false;
                }
                files.forEach(function(itemFiles){
                    if(STORE.pathArr.indexOf(itemFiles)!=-1){
                        //文件没有更改，删掉它
                        fs.exists(CONFIG.tempResource+item+"/"+itemFiles,function(exist){
                            if(exist){
                                fs.unlink(CONFIG.tempResource+item+"/"+itemFiles,function(err){
                                    if(err){
                                        return false;
                                    };
                                })
                            }
                        })

                    }
                })
            })
        })
    })
})

gulp.task('deploy',function(){
    console.log('delpoy')
    setTimeout(function(){
        gulp.src(CONFIG.tempResource+'**/**')
            .pipe(gulp.dest(CONFIG.DEPLOY))
    },1000)
})

releaseTasks(gulp);

function buildFn(taskName, srcPath, destPath, revPath) {
    gulp.task(taskName, function () {
        return gulp.src(srcPath)
            .pipe(rev())
            .pipe(gulp.dest(path.join(CONFIG.tempResource, destPath)))
            .pipe(rev.manifest())
            .pipe(gulp.dest(path.join('dist', 'rev/' + revPath)))
    })
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
                                'css': 'styles'
                            },
                            path;
                        path = pathMap[suffix];
                        path = path || 'image';
                        return CONFIG.CDN + path + "/" + manifest_value;
                    }
                }
            }))
            .pipe(gulp.dest(path.join('dist', desPath)));
    });

}