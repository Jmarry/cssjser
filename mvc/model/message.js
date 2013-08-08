/**
 * Created with JetBrains WebStorm.
 * User: Jmarry
 * Date: 13-7-22
 * Time: 上午9:52
 * To change this template use File | Settings | File Templates.
 */
var mongoose=require('mongoose'),
    Schema=mongoose.Schema,
    utils=require('../../lib/utils'),
    messageModel=new Schema({
        message:{type:String,default:'',required:true},
        createAt:{type:Date,default:Date.now,get:function(time){
            return utils.formatTime(time);
        }}
    });
messageModel.statics={
    list:function(opts,fn){
        var criteria=opts.criteria||{};
        this.find(criteria)
            .sort({'createAt':-1})
            .limit(opts.prePage)
            .skip(opts.prePage*opts.page)
            .exec(fn);
    }
};
exports=module.exports=mongoose.model('Messages',messageModel);