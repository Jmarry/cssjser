/**
 * Created with JetBrains WebStorm.
 * User: Jmarry
 * Date: 13-6-26
 * Time: 下午5:43
 * To change this template use File | Settings | File Templates.
 */
var categoryModel=require('../model/category'),
    utils=require('../../lib/utils');
exports.create=function(req,res,next){
    var category=req.body;
    categoryModel.create(category,function(err,doc){
        if(err){
            req.flash('error',utils.errors(err));
            return res.redirect('/admin/category/create');
        }
        res.redirect('/admin/category/list');
    })
};
exports.index=function(req,res,next){
    res.render('category/create',{title:'新建类别',category:new categoryModel({}),msg:req.flash('error'),current:4});
};
exports.list=function(req,res,next){
    var category={};
    categoryModel.findList(category,function(err,docs){
        if(err)return next(err);
        res.locals.categorys=docs;
        next();
    })
};
exports.showList=function(req,res,next){
    res.render('category/list',{title:'类别列表',current:4});
};
exports.getOneByName=function(req,res,next){
    var name=req.params.category;
    categoryModel.findOne({name:name},function(err,doc){
        if(err)return next(err);
        req.category_id=doc._id;
        res.locals.categoryName=doc.name;
        next();
    });
};
exports.edit=function(req,res,next){
    var categoryid=req.params.id;
    categoryModel.findOne({_id:categoryid},function(err,doc){
        if(err)return next(err);
        res.render('category/create',{title:'编辑类别',category:doc,msg:req.flash('error'),current:4});
    });
};
exports.update=function(req,res,next){
    var category=req.body,id=req.params.id;
    categoryModel.findOne({_id:id},function(err,doc){
        if(err)return next(utils.errors(err));
        doc.name=category.name;
        doc.link=category.link;
        doc.index=category.index;
        doc.save(function(err,rtn){
            if(err)return next(utils.errors(err));
            res.redirect('/admin/category/list/');
        })
    })
};
exports.del=function(req,res,next){
    var categoryid=req.params.id;
    categoryModel.remove({_id:categoryid},function(err,num){
        if(err)return next(utils.errors(err));
        res.redirect('/admin/category/list/');
    })
};