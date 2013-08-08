/**
 * Created with JetBrains WebStorm.
 * User: Jmarry
 * Date: 13-6-25
 * Time: 下午3:20
 * To change this template use File | Settings | File Templates.
 */
var articles=require('../model/articles'),
    comments=require('../model/comment'),
    util=require('../../lib/utils');
exports.addcomment=function(req,res,next){
    var comment=req.body;
    if(req.body._csrf===req.session._csrf){
        if(req.session.user){
            comment.name=req.session.user.name;
            comment.email=req.session.user.email;
            comment.link='http://cssjser.com/';
            comment.isAuth=true;
        }
        if(comment.replyId){
            comments.findOne({_id:comment.replyId},function(err,rtn){
                if(err)return next(err);
                var replyer;
                if(comment.replyerId){
                    replyer=rtn.replys.id(comment.replyerId);
                    comment.replyer={
                        rid:replyer._id,
                        name:replyer.name,
                        email:replyer.email
                    }
                }else{
                    comment.replyer={
                        rid:rtn._id,
                        name:rtn.name,
                        email:rtn.email
                    };
                }
                rtn.addReply(comment,function(err,obj){
                    if(err)return next(err);
                    next()
                });
            });
        }else{
            comment.post=req.postId;
            comments.create(comment,function(err,rtn){
                if(err)return next(err);
                next();
            })
        }
    }else{
        next(new Error('安全校验失败!'));
    }
};
exports.list=function(req,res,next){
    var page=(req.query.page>0?req.query.page:1)- 1,
        query={
            prePage:10,
            page:page,
            criteria:{}
        };
    if(req.postId)query.criteria.post=req.postId;
    comments.count(query.criteria,function(err,count){
        if(err)return next(err);
        comments.list(query,function(err,docs){
            if(err)return next(err);
            docs.forEach(function(doc){
                if(doc.replys.length>0){
                    doc.replys.forEach(function(reply){
                        reply.avatar=util.gravatar(reply.email,{s:'identicon'});
                    });
                }
            });
            res.locals.comments=docs;
            res.locals.pages=Math.ceil(count/query.prePage);
            res.locals.page=page+1;
            res.locals.commentCount=count;
            next();
        });
    });
};
exports.RecentComments=function(req,res,next){
    comments.list({prePage:5,page:0,criteria:{}},function(err,docs){
        if(err)return next(err);
        res.locals.recentcomments=docs;
        next();
    })
};
exports.adminlist=function(req,res,next){
    res.render('admin/commentlist',{title:'评论列表',current:6})
};
exports.del=function(req,res,next){
    var commentId=req.params.commentId,
        replyId=req.body.replyId;
    comments.findOne({_id:commentId},function(err,doc){
        if(err)return next(util.errors(err));
        articles.findOne({_id:doc.post},function(err,subdoc){
            if(err)return next(util.errors(err));
            if(replyId){
                doc.delReply(replyId,function(err,rtn){
                    if(err)return next(util.errors(err));
                    subdoc.delComment(function(err,subrtn){
                        if(err)return next(util.errors(err));
                        res.redirect('/admin/comments');
                    });
                });
            }else{
                doc.remove(function(err,rtn){
                    if(err)return next(util.errors(err));
                    subdoc.delComment(function(err,subrtn){
                        if(err)return next(util.errors(err));
                        res.redirect('/admin/comments');
                    });
                });
            }
        })
    });
};