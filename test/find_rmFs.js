/**
 * Created by Administrator on 2016/6/24.
 * 遍历文件夹
 * 若文件名存在于pathArr中则删掉此文件
 */

var fs=require('fs');

function iterator(files,parentPath,pathArr){
    files.forEach(function(itemFile){
        var currentPath=parentPath+itemFile;
        fs.stat(currentPath,function(err,stats){
            if(stats.isDirectory()){
                fs.readdir(currentPath,function(err,fils){
                    if(err){
                        return false;
                    }
                    iterator(fils,currentPath+"/",pathArr);
                })
            }
            else{
                if(pathArr.indexOf(itemFile)!=-1 || forName(pathArr,itemFile)){
                    //文件没有更改，删掉它
                    fs.exists(currentPath,function(exist){
                        if(exist){
                            fs.unlink(currentPath,function(err){
                                if(err){
                                    return false;
                                }
                            })
                        }
                    });
                }

                function forName(pathA,itemF){
                    var lag=false;
                    pathA.forEach(function(it){
                        if(it.indexOf(itemF)!=-1){
                            lag=true;
                            return true;
                        }
                    })
                    return lag;
                }
            }
        })
    })
}

module.exports=iterator;
