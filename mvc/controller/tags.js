/**
 * Created with JetBrains WebStorm.
 * User: Jmarry
 * Date: 13-6-25
 * Time: 上午10:36
 * To change this template use File | Settings | File Templates.
 */
var articles=require('../model/articles');
exports.list=function(req,res,next){
    var page=(req.query.page>0?req.query.page:1)- 1,
        prePage=10,
        tags=req.params.tag;
    articles.list({page:page,prePage:prePage,criteria:{tags:new RegExp(tags,'ig')}},function(err,docs){
        if(err)return next(err);
        articles.count({tags:new RegExp(tags,'ig')}).exec(function(err,count){
            if(err)return next(err);
            res.render('articles/list',{title:tags,list:docs,page:page+1,pages:(count/prePage)});
        })
    })
};