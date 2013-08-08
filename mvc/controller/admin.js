exports.postList=function(req,res){
    res.render('admin/postlist',{title:'文章管理列表',current:2});
};
exports.admin=function(req,res){
    res.render('admin/index',{title:'管理后台',current:1});
};