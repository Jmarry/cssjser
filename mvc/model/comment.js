/**
 * Created with JetBrains WebStorm.
 * User: Jmarry
 * Date: 13-7-10
 * Time: 下午6:55
 * To change this template use File | Settings | File Templates.
 */
var markdown = require( "pagedown" ),
    safeConverter = markdown.getSanitizingConverter(),
    utils=require('../../lib/utils'),
    mongoose=require('mongoose'),
    Schema=mongoose.Schema,
    replys=new Schema({
        body:{type:String,default:'',trim:true,get:function(body){
            return body?safeConverter.makeHtml(body):'';
        },required:true},
        email:{type:String,default:'',trim:true,required:true,match:/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/},
        name:{type:String,default:'',trim:true},
        link:{type:String,default:'',trim:true,set:function(link){
            var match=/^(http|https)/;
            if(link){
                return match.test(link)?link:'http://'+link;
            }else{
                return '';
            }
        }},
        createAt:{type:Date,default:Date.now,get:function(date){
            return utils.DatebeforeNow(date);
        }},
        isAuth:{type:Boolean,default:false},
        isView:{type:Boolean,default:false},
        replyer:{
            rid:{type:Schema.ObjectId},
            name:{type:String,trim:true},
            email:{type:String,trim:true}
        }
    }),
    comments=new Schema({
        body:{type:String,default:'',trim:true,get:function(body){
            return body?safeConverter.makeHtml(body):'';
        },required:true},
        email:{type:String,default:'',trim:true,required:true,match:/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/},
        name:{type:String,default:'',trim:true},
        link:{type:String,default:'',trim:true,set:function(link){
            var match=/^(http|https)/;
            if(link){
                return match.test(link)?link:'http://'+link;
            }else{
                return '';
            }
        }},
        createAt:{type:Date,default:Date.now,get:function(date){
            return utils.DatebeforeNow(date);
        }},
        isAuth:{type:Boolean,default:false},
        isView:{type:Boolean,default:false},
        post:{type:Schema.ObjectId,ref:'Article'},
        replys:[replys]
    });
comments.virtual('avatar').get(function(){
    return utils.gravatar(this.email,{d:'identicon'});
});
comments.methods={
    addReply:function(comments,fn){
        this.replys.push(comments);
        this.save(fn);
    },
    delReply:function(id,fn){
        var obj=this.replys.id(id);
        obj&&obj.remove();
        this.save(fn)
    }
};
comments.statics={
    list:function(opts,fn){
        var criteria=opts.criteria||{};
        this.find(criteria)
            .populate('post','title')
            .sort({'createAt':-1})
            .limit(opts.prePage)
            .skip(opts.prePage*opts.page)
            .exec(fn);
    }
};
exports=module.exports=mongoose.model('Comment',comments);