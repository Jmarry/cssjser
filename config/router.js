/**
 * Created with JetBrains WebStorm.
 * User: Jmarry
 * Date: 13-6-17
 * Time: 下午2:19
 * To change this template use File | Settings | File Templates.
 */
var user=require('../mvc/controller/user'),
    articles=require('../mvc/controller/articles'),
    tags=require('../mvc/controller/tags'),
    admin=require('../mvc/controller/admin'),
    comment=require('../mvc/controller/comments'),
    category=require('../mvc/controller/category'),
    media=require('../mvc/controller/media'),
    message=require('../mvc/controller/message');

exports=module.exports=function(app){

    //user
//    app.get('/reg',user.checkLogout,user.reg);
    app.get('/login',user.checkLogout,user.login);
    app.post('/login',user.checkLogout,user.logIn);
    app.get('/logout',user.checkLogin,user.logout);
    app.get('/user',user.checkLogin,user.show);
    app.post('/user',user.checkLogin,user.editNandE);
    app.get('/user/editPwd',user.checkLogin,user.edit);
    app.post('/user/editPwd',user.checkLogin,user.editPwd);

    //articles
    app.get('/post',user.checkLogin,category.list,articles.post);
    app.post('/post',user.checkLogin,articles.create);
    app.get('/',category.list,message.messages,articles.RecentPosts,comment.RecentComments,articles.list,articles.index);
    app.get('/category/:category',message.messages,category.list,category.getOneByName,articles.RecentPosts,comment.RecentComments,articles.list,articles.listByCategory);
    app.get('/post/:title',message.messages,category.list,articles.RecentPosts,comment.RecentComments,articles.show,comment.list,articles.detail);
    app.get('/post/:title/edit',category.list,articles.edit);
    app.post('/post/:title/edit',user.checkLogin,articles.update);
    app.post('/post/:title/del',user.checkLogin,articles.del);

    //tags
    app.get('/tags/:tag',category.list,message.messages,articles.RecentPosts,comment.RecentComments,tags.list);

    //comment
    app.post('/post/:title/comment',articles.show,comment.addcomment,articles.addComment);
    app.get('/admin/comments',user.checkLogin,comment.list,comment.adminlist);
    app.post('/admin/comments/:commentId/del',user.checkLogin,comment.del);

    //admin
    app.get('/admin',user.checkLogin,admin.admin);
    app.get('/admin/postlist',user.checkLogin,articles.list,admin.postList);
    app.get('/admin/settings',user.checkLogin,message.addUrl);
    app.post('/admin/settings',user.checkLogin,message.add);

    //category
    app.get('/admin/category/create',user.checkLogin,category.index);
    app.post('/admin/category/create',user.checkLogin,category.create);
    app.get('/admin/category/list',user.checkLogin,category.list,category.showList);
    app.get('/admin/category/:id',user.checkLogin,category.edit);
    app.post('/admin/category/:id',user.checkLogin,category.update);
    app.post('/admin/category/:id/delete',user.checkLogin,category.del);

    //media
    app.get('/admin/medias/create',user.checkLogin,media.create);
    app.post('/admin/medias/create',user.checkLogin,media.add);
    app.get('/admin/medias',user.checkLogin,media.list,media.index);
    app.post('/admin/medias/:mid/del',user.checkLogin,media.del);
};