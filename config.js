/**
 * Created by Administrator on 2016/6/23.
 */

var config={
    PORT:3000,
    EXPIRES:60 * 60 * 24 * 360,
    fileMatch:/\.(css|js|png|jpg|ico|gif)$/,
    resourceRoot:/^static/
};

module.exports=config;