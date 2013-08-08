/**
 * Created with JetBrains WebStorm.
 * User: Jmarry
 * Date: 13-7-22
 * Time: 上午10:04
 * To change this template use File | Settings | File Templates.
 */
var settingModel=require('../model/message');
exports.messages=function(req,res,next){
    var query={
        prePage:10,
        page:0,
        criteria:{}
    };
    settingModel.list(query,function(err,docs){
        if(err)return next(err);
        if(docs.length){
            res.locals.messages=docs[0];
        }
        next();
    })
};
exports.add=function(req,res,next){
    var message=req.body;
    settingModel.create(message,function(err,doc){
        if(err)return next(err);
        res.redirect('/admin/settings');
    });
};
exports.addUrl=function(req,res,next){
    res.render('admin/message',{title:'公告管理',current:7,msg:req.flash('error')});
};