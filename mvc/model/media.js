/**
 * Created with JetBrains WebStorm.
 * User: Jmarry
 * Date: 13-7-11
 * Time: 下午11:39
 * To change this template use File | Settings | File Templates.
 */
var mongoose=require('mongoose'),
    qiniu=require('../../lib/qiniu'),
    Schema=mongoose.Schema,
    media=new Schema({
        name:{type:String,default:'',trim:true},
        link:{type:String,default:'',trim:true},
        meta:{type:String,default:'',trim:true},
        createAt:{type:Date,default:Date.now}
    });
media.path('name').validate(function(name){
    return name.length>0
},'名称不能为空');
media.pre('remove',function(next){
    qiniu.del(this.link,function(resp){
        if(resp.code!=200){
            return next(new Error('cdn删除失败:'+resp.error));
        }
        next();
    });
});
media.statics={
    list:function(opts,fn){
        var criteria=opts.criteria||{};
        this.find(criteria)
            .sort({'createAt':-1})
            .limit(opts.prePage)
            .skip(opts.prePage*opts.page)
            .exec(fn);
    }
};
exports=module.exports=mongoose.model('Media',media);