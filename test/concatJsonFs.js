/**
 * Created by Administrator on 2016/6/24.
 * 遍历文件夹，将rev()生成的rev-manifest.json中的json数据
 * 保存到数组中
 */

var fs=require('fs')

function cancatJsonn(_root,filename,container){
    fs.readdir(_root,function(err,files){
        if(err){
            return false;
        }
        if(files.length){
            files.forEach(function(item){
                fs.readFile(_root+'/'+item+'/'+filename,'utf-8',function(err,data){
                    if(err){
                        return false;
                    }
                    var json=JSON.parse(data);
                    for(var name in json){
                        container.push(json[name]);
                    }
                })
            })
        }

    });
}

module.exports=cancatJsonn;

