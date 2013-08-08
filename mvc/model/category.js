/**
 * Created with JetBrains WebStorm.
 * User: Jmarry
 * Date: 13-6-26
 * Time: 下午4:21
 * To change this template use File | Settings | File Templates.
 */
var mongoose=require('mongoose'),
    Schema=mongoose.Schema,
    categoryModel=new Schema({
        name:{type:String,default:'',trim:true},
        link:{type:String,default:'',trim:true},
        index:{type:Number,default:0,trim:true},
        type:{type:Number,default:0}
    });
categoryModel.path('name').validate(function(name){
    return name.length>0
},'名称不能为空');
categoryModel.statics={
    findList:function(opts,fn){
        this.find(opts)
            .sort({index:1})
            .exec(fn);
    }
};
exports=module.exports=mongoose.model('Category',categoryModel);