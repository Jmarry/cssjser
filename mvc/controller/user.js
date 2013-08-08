/**
 * Created with JetBrains WebStorm.
 * User: Jmarry
 * Date: 13-6-17
 * Time: 下午1:43
 * To change this template use File | Settings | File Templates.
 */
var userModel=require('../model/user');
exports.login=function(req,res,next){
    res.render('users/login',{title:'登录',error:req.flash('error')});
};
exports.logIn=function(req,res,next){
    if(req.session.user){
        req.flash('error','已经登录');
        return res.redirect('/login');
    }
    var user=req.body;
    if(!user.email){
        req.flash('error','邮箱不能为空');
        return res.redirect('/login');
    }else if(!user.password){
        req.flash('error','密码不能为空');
        return res.redirect('/login');
    }
    userModel.findOne({email:user.email},function(err,doc){
        if(err)return next();
        if(!doc){
            req.flash('error','账号不存在');
            return res.redirect('/login');
        }
        if(doc.checkPassword(user.password)){
            req.session.user=doc;
            res.redirect('/user/');
        }else{
            req.flash('error','密码错误');
            res.redirect('/login');
        }
    })
};
exports.logout=function(req,res,next){
    req.session.user=null;
    res.redirect('/login');
};
exports.show=function(req,res,next){
    var id=req.session.user&&req.session.user._id;
    if(!id){
        return res.redirect('/login');
    }
    userModel.show(id,function(err,doc){
        if(err)return next();
        res.render('users/user',{title:'个人中心',user:doc,current:5});
    });
};
exports.editNandE=function(req,res,next){
    var user={name:req.body.name,email:req.body.email},id=req.session.user&&req.session.user._id;
    if(!id){
        return res.redirect('/login');
    }
    userModel.show(id,function(err,doc){
        if(err)return next();
        doc.editOneparam(user,function(err,doc){
            if(err)return next();
            res.redirect('/user/');
        });
    })
};
exports.edit=function(req,res,next){
    res.render('users/editPwd',{title:'修改密码',error:req.flash('err'),current:5});
};
exports.editPwd=function(req,res,next){
    var user=req.body,pwd=req.body.password,id=req.session.user&&req.session.user._id;
    if(user.password!==user.checkpassword){
        req.flash('err','两次输入的密码不一致');
        return res.redirect('/user/editPwd');
    }
    if(!id){
        return res.redirect('/login');
    }
    userModel.show(id,function(err,doc){
        if(err)return next();
        doc.editOneparam({password:pwd},function(err,doc){
            if(err)return next();
            res.redirect('/user/');
        });
    })
};
exports.checkLogin=function(req,res,next){
    req.session.user?next():res.redirect('/login/');
};
exports.checkLogout=function(req,res,next){
    req.session.user?res.redirect('/user/'):next();
};
exports.reg=function(req,res){
    var user=req.query;
    userModel.create(user,function(err,doc){
        if(err)return res.json({isSuccess:0,msg:err.message});
        req.session.user=doc;
        return res.json({isSuccess:1,msg:'success'});
    })
};