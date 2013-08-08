/**
 * Created with JetBrains WebStorm.
 * User: Jmarry
 * Date: 13-6-19
 * Time: 上午10:54
 * To change this template use File | Settings | File Templates.
 */
var markdown = require( "pagedown" ),
    safeConverter = markdown.getSanitizingConverter(),
    utils=require('../../lib/utils'),
    mongoose=require('mongoose'),
    Schema=mongoose.Schema,
    articles=new Schema({
        title:{type:String,default:'',trim:true},
        body:{type:String,default:''},
        user:{type:Schema.ObjectId,ref:'User'},
        tags:{type:[],get:function (tags) {
          return tags.join(',')
        },set:function (tags) {
          return tags.split(',')
        }},
        createdAt:{type:Date,default:Date.now},
        renderNum:{type:Number,default:0},
        commentNum:{type:Number,default:0},
        category:{type:Schema.ObjectId,ref:'Category'},
        type:{type:Number,default:0}//0 is post 1 is page
    });
articles.virtual('content').get(function(){
    return this.body?safeConverter.makeHtml(this.body):'';
});
articles.virtual('info').get(function(){
    var content=safeConverter.makeHtml(this.body),
        regex=/<(.*)>.*<\/\1>|<(.*) \/>/g,
        rtns,val='',count=0;
    while((rtns=regex.exec(content))!=null){
        if(count<5){
            count++;
            val+=rtns[0];
        }else{
            break;
        }
    }
    return val||'该文章无法显示概要信息，请移步详情页~~~！';
});
articles.virtual('byTime').get(function(){
    return utils.formatTime(this.createdAt);
});
articles.virtual('getTime').get(function(){
    return utils.FormatDateTime(this.createdAt);
});
articles.path('title').validate(function(title){
    return title.length>0
},'标题不能为空');
articles.path('title').validate(function(title,fn){
    var post=mongoose.model('Article');
    if(this.isNew||this.isModified('title')){
        post.find({title:title}).exec(function(err,posts){
            fn(err|posts.length===0)
        });
    }else{
        fn(true);
    }
},'这个标题已经被使用了');
articles.path('body').validate(function(body){
    return body.length>0
},'内容不能为空');
articles.methods={
    addRenders:function(fn){
        this.renderNum+=1;
        this.save(fn);
    },
    addComment:function(fn){
        this.commentNum+=1;
        this.save(fn);
    },
    delComment:function(fn){
        this.commentNum-=1;
        this.save(fn);
    }
};
articles.statics={
    load:function(title,fn){
        this.findOne({title:title})
            .populate('user','name email')
            .populate('category','name link')
            .exec(fn);
    },
    listByTime:function(opts,fn){
        var criteria=opts.criteria||{};
        this.find(criteria,{'createdAt': {$gte: opts.startTime, $lte: opts.endTime}})
            .populate('user','name')
            .populate('category','name link')
            .sort({'createdAt':-1})
            .limit(opts.prePage)
            .skip(opts.prePage*opts.page)
            .exec(fn);
    },
    list:function(opts,fn){
        var criteria=opts.criteria||{};
        this.find(criteria)
            .populate('user','name email')
            .populate('category','name link')
            .sort({'createdAt':-1})
            .limit(opts.prePage)
            .skip(opts.prePage*opts.page)
            .exec(fn);
    }
};
exports=module.exports=mongoose.model('Article',articles);