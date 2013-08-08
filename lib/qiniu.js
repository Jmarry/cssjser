/**
 * Created with JetBrains WebStorm.
 * User: Jmarry
 * Date: 13-7-11
 * Time: 下午2:32
 * To change this template use File | Settings | File Templates.
 */
var qiniu = require("qiniu"),
    mime = require('mime'),
    uuid=require('node-uuid'),
    bucket,
    options={
        scope:bucket
    },
    uploadPolicy=new qiniu.auth.PutPolicy(options);

exports.Init=function(cfg){
    // 配置密钥
    qiniu.conf.ACCESS_KEY = cfg.qiniu.ACCESS_KEY;
    qiniu.conf.SECRET_KEY = cfg.qiniu.SECRET_KEY;
    //仓库
    bucket=cfg.qiniu.Bucket;
};
exports.create=function(bucket){
    // 实例化带授权的 HTTP Client 对象
    var conn = new qiniu.digestauth.Client();

    qiniu.rs.mkbucket(conn, bucket, function(resp) {
        console.log("\n===> Make bucket result: ", resp);
        if (resp.code != 200) {
            return;
        }
    });
};
exports.upload=function(opts,fn){
    // 实例化带授权的 HTTP Client 对象
    var conn = new qiniu.digestauth.Client();
    // 实例化 Bucket 操作对象
    var rs = new qiniu.rs.Service(conn, bucket);
    var uploadToken = uploadPolicy.token(),
        localFile = opts.file,
        customMeta = opts.meta||'',
        callbackParams = {"bucket": bucket, "key": opts.fileName},
        enableCrc32Check = false,
        mimeType = mime.lookup(localFile),
        key=opts.fileName;
    rs.uploadFileWithToken(uploadToken,localFile,key,mimeType,customMeta,callbackParams,enableCrc32Check,function(resp){
        console.log("\n===> Upload File with Token result: ",resp);
        fn(resp);
    });
};
exports.show=function(filename){
    // 实例化带授权的 HTTP Client 对象
    var conn = new qiniu.digestauth.Client();
    // 实例化 Bucket 操作对象
    var rs = new qiniu.rs.Service(conn, bucket);
    rs.stat(filename, function(resp) {
        console.log("\n===> Stat result: ", resp);
        if (resp.code != 200) {
            // ...
            return;
        }
    });
};
exports.del=function(filename,fn){
    // 实例化带授权的 HTTP Client 对象
    var conn = new qiniu.digestauth.Client();
    // 实例化 Bucket 操作对象
    var rs = new qiniu.rs.Service(conn, bucket);
    rs.remove(filename, function(resp) {
        console.log("\n===> Delete result: ", resp);
        fn(resp);
    });
};