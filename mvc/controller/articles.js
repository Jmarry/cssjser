/**
 * Created with JetBrains WebStorm.
 * User: Jmarry
 * Date: 13-6-19
 * Time: 上午10:54
 * To change this template use File | Settings | File Templates.
 */
var articlesModel=require('../model/articles'),
    utils=require('../../lib/utils');
exports.post=function(req,res,next){
    res.render('articles/new',{title:'发表文章',msg:req.flash('error'),post:new articlesModel({}),current:2});
};
exports.create=function(req,res,next){
    var post=req.body;
    post.user=req.session.user._id;
    articlesModel.create(post,function(err,doc){
        if(err){
            req.flash('error',utils.errors(err));
            return res.redirect('/post/');
        }
        res.redirect('/post/'+post.title);
    });
};
exports.list=function(req,res,next){
    var page=(req.query.page>0?req.query.page:1)- 1,
        query={
            prePage:10,
            page:page,
            criteria:{}
        },keys=req.query.search,id=req.category_id;
    if(keys)query.criteria.title=new RegExp(keys,'ig');
    if(id){
        query.criteria.category=id;
        req.category=req.params.category;
    }
    articlesModel.list(query,function(err,docs){
        if(err)return next(err);
        articlesModel.count(query.criteria).exec(function(err,count){
            if(err)return next(err);
            res.locals.list=docs;
            res.locals.page=page+1;
            res.locals.pages=Math.ceil(count/query.prePage);
            next();
        });
    });
};
exports.RecentPosts=function(req,res,next){
    articlesModel.list({prePage:5,page:0},function(err,docs){
        if(err)return next(err);
        res.locals.recentposts=docs;
        next();
    })
};
exports.index=function(req,res){
    res.render('articles/list',{title:'首页'});
};
exports.listByCategory=function(req,res){
    res.render('articles/list',{title:req.category});
};
exports.show=function(req,res,next){
    var title=req.params.title;
    articlesModel.load(title,function(err,doc){
        if(err)return next(err);
        res.locals.title=title;
        res.locals.post=doc;
        req.postId=doc._id;
        req.route.method=='get'?doc.addRenders(function(err,count){
            if(err)return next(err);
            next();
        }):next();
    });
};
exports.addComment=function(req,res,next){
    req.body.replyId?
        res.redirect('/post/'+res.locals.post.title+'/#comment/'):
        res.locals.post.addComment(function(err,rtn){
            if(err)return next(utils.errors(err));
            res.redirect('/post/'+res.locals.post.title+'/#comment/');
        });
};
exports.detail=function(req,res,next){
    res.render('articles/show');
};
exports.edit=function(req,res,next){
    var title=req.params.title;
    articlesModel.load(title,function(err,doc){
        if(err)return next(err);
        res.render('articles/new',{title:'编辑文章',post:doc,msg:req.flash('error'),current:2});
    });
};
exports.update=function(req,res,next){
    var post=req.body;
    articlesModel.update({_id:post.pid},{$set:{title:post.title,body:post.body,tags:post.tags,category:post.category}},function(err,num){
        if(err)return next(err);
        console.log(num);
        res.redirect('/post/'+post.title);
    });
};
exports.del=function(req,res,next){
    var title=req.params.title;
    articlesModel.remove({title:title},function(err,num){
        if(err)return next();
        res.redirect('/');
    })
};