/**
 * Created with JetBrains WebStorm.
 * User: Jmarry
 * Date: 13-6-16
 * Time: 下午12:59
 * To change this template use File | Settings | File Templates.
 */
var path=require('path'),
    rootPath=path.normalize(__dirname+'/..');
module.exports={
    development:{
        db:'mongodb://localhost:27017/blog_dev',
        root:rootPath,
        qiniu:{
            ACCESS_KEY:'',
            SECRET_KEY:'',
            Bucket:''
        }
    },
    test:{
        db:'mongodb://localhost:27017/test',
        root:rootPath,
        qiniu:{
            ACCESS_KEY:'',
            SECRET_KEY:'',
            Bucket:'cssjser'
        }
    },
    production:{
        db:'mongodb://localhost:27017/cssjser',
        root:rootPath,
        qiniu:{
            ACCESS_KEY:'',
            SECRET_KEY:'',
            Bucket:'cssjser'
        }
    }
};