var gulp = require('gulp'),
    path = require('path'),
    clean = require('gulp-clean'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    revCss = require('gulp-rev-css-url'),
    shell=require('gulp-shell'),
    releaseTasks = require('gulp-release-tasks'),
    seq = require('run-sequence');

var CONFIG={
    deploy:'F:/workspaceForWebstorm/staticResourceService/static'
};
var fs=require('fs'),
    revROOT='dist/rev',
    DEPLOY='F:/workspaceForWebstorm/staticResourceService/static',
    MANIFEST='rev-manifest.json';

var store={
    pathArr:[]
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
    fs.readdir(revROOT,function(err,files){
        if(err){
            console.log(err)
            return false;
        }
        console.log(files)
        if(files.length){
            files.forEach(function(item){
                fs.readFile(revROOT+'/'+item+'/'+MANIFEST,'utf-8',function(err,data){
                    if(err){
                        return false;
                    }
                    var json=JSON.parse(data);
                    for(var name in json){
                        store.pathArr.push(json[name]);
                    }
                })
            })
        }

    })

    setTimeout(function(){
        console.log(store.pathArr)
        seq('js', 'css', 'image', 'html','beforeDeploy','deploy',done);
    },1000)
});

gulp.task('beforeDeploy',function(){
    console.log('beforeDeploy');
    fs.readdir('dist/temp',function(err,files){
        files.forEach(function(item){
            fs.readdir('dist/temp/'+item,function(err,files){
                console.log(files);
                if(err){
                    console.log('1')
                    return false;
                }
                files.forEach(function(itemFiles){
                    if(store.pathArr.indexOf(itemFiles)!=-1){
                        //文件没有更改，删掉它
                        fs.exists('dist/temp/'+item+"/"+itemFiles,function(exist){
                            console.log(exist)
                            if(exist){
                                fs.unlink('dist/temp/'+item+"/"+itemFiles,function(err){
                                    if(err){
                                        console.log('2')
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
        gulp.src('dist/temp/**/**')
            .pipe(gulp.dest(CONFIG.deploy))
    },1000)
})

releaseTasks(gulp);

function buildFn(taskName, srcPath, destPath, revPath) {
    gulp.task(taskName, function () {
        return gulp.src(srcPath)
            .pipe(rev())
            .pipe(gulp.dest(path.join('dist/temp', destPath)))
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
                        return 'http://127.0.0.1:3000/static/' + path + "/" + manifest_value;
                    }
                }
            }))
            .pipe(gulp.dest(path.join('dist', desPath)));
    });

}