/**
 * Created with JetBrains WebStorm.
 * User: Jmarry
 * Date: 13-6-16
 * Time: 下午1:42
 * To change this template use File | Settings | File Templates.
 */
var mongoose=require('mongoose')
    ,Schema=mongoose.Schema
    ,crypto=require('crypto')
    ,utils = require('../../lib/utils')
    ,userModel=new Schema({
        name:String,
        email:String,
        hash_password:String,
        salt:String
    });
userModel.virtual('password').set(function(password){
    this._password=password;
    this.salt=this.marksalt();
    this.hash_password=this.encryptPassword(password);
}).get(function(){
        return this._password;
    });
userModel.virtual('gravatar').get(function(){
    return utils.gravatar(this.email,{d: 'identicon'});
});
userModel.path('name').validate(function(name){
    return name?
        'string'===typeof name?
            name.length:null:null;
},'设置name失败');
userModel.path('email').validate(function(email){
    return email?
        'string'===typeof email?
            email.length:null:null;
},'设置email失败');
userModel.path('email').validate(function(email,fn){
    var user=mongoose.model('User');
    if(this.isNew||this.isModified('email')){
        user.find({email:email}).exec(function(err,users){
            fn(err|users.length===0);
        })
    }else{
        fn(true);
    }
},'邮箱已经被绑定了');
userModel.path('hash_password').validate(function(password){
    return password?
        'string'===typeof password?
            password.length:null:null;
},'设置password失败');

userModel.methods={
    checkPassword:function(password){
        return this.encryptPassword(password)===this.hash_password;
    },
    marksalt:function(){
        return Math.round(new Date().getTime() * Math.random()) + '';
    },
    encryptPassword:function(password){
        return password?crypto.createHmac('sha1',this.salt).update(password).digest('hex'):'';
    },
    editOneparam:function(params,cb){
        for(var param in params){
            this[param]=params[param];
        }
        this.save(cb);
    }
};
userModel.statics={
    show:function(id,fn){
        this.findOne({_id:id},fn);
    }
};
exports=module.exports=mongoose.model('User',userModel);
