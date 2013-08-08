/**
 * Created with JetBrains WebStorm.
 * User: Jmarry
 * Date: 13-7-11
 * Time: 下午11:39
 * To change this template use File | Settings | File Templates.
 */
var media=require('../model/media'),
    uuid=require('node-uuid'),
    util=require('../../lib/utils'),
    qiniu=require('../../lib/qiniu');
exports.create=function(req,res,next){
    res.render('media/create',{title:'新建媒体',msg:req.flash('error'),current:3});
};
exports.index=function(req,res,next){
    res.render('media/list',{title:'媒体中心',current:3});
};
exports.add=function(req,res,next){
    var uploadfile=req.files.img,
        meta=req.body.meta,
        name=uuid.v4();
    if(uploadfile && /(jpg|png|jpeg|gif)$/i.test(uploadfile.type)){
        name+=(uploadfile.type.indexOf('jpg')>-1||uploadfile.type.indexOf('jpeg')>-1)
            ?'.jpg':uploadfile.type.indexOf('png')>-1
            ?'.png':uploadfile.type.indexOf('gif')>-1
            ?'.gif':'';
        qiniu.upload({file:uploadfile.path,meta:meta,fileName:name},function(resp){
            if(resp.code!=200){
                req.flash('error','上传cdn失败!');
                return res.redirect('/admin/medias/create');
            }
            media.create({name:uploadfile.name,link:name,meta:meta},function(err,rtn){
                if(err)return next(util.errors(err));
                res.redirect('admin/medias/');
            })
        });
    }else{
        req.flash('error','上传格式不正确');
        return res.redirect('/admin/medias/create');
    }
};
exports.list=function(req,res,next){
    var page=(req.query.page>0?req.query.page:1)- 1,
        query={
            prePage:10,
            page:page,
            criteria:{}
        };
    media.count(query.criteria,function(err,count){
        if(err)return next(err);
        media.list(query,function(err,docs){
            if(err)return next(err);
            res.locals.medias=docs;
            res.locals.pages=Math.ceil(count/query.prePage);
            res.locals.page=page+1;
            next();
        });
    });
};
exports.del=function(req,res,next){
    var mediaId=req.params.mid;
    media.findOne({_id:mediaId},function(err,doc){
        if(err){
            req.flash('error',util.errors(err));
            return res.redirect('/admin/medias/create/');
        }
        doc.remove(function(err,obj){
            if(err){
                req.flash('error',util.errors(err));
                return res.redirect('/admin/medias/create/');
            }
            res.redirect('/admin/medias/');
        });
    });
};