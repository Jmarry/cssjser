/**
 * Created with JetBrains WebStorm.
 * User: Jmarry
 * Date: 13-6-16
 * Time: 下午1:03
 * To change this template use File | Settings | File Templates.
 */
var express = require('express'),
    mongoStore = require('connect-mongo')(express);
module.exports = function (app, config) {
    app.use(express.compress({
        filter: function (req, res) {
            return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
        },
        level: 9
    }));
    // all environments
    app.set('views', config.root + '/mvc/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('cssjser is build by wyf'));
    app.use(express.session({
        secret: 'cssjser',
        cookie: { maxAge: 24 * 60 * 60 * 1000 },
        store:new mongoStore({
            url:config.db,
            collection:'sessions',
            clear_interval:3600
        })
    }));
    app.use(require('connect-flash')());
    app.use(express.csrf());
    app.use(function(req, res, next){
      res.locals.csrf_token = req.session._csrf;
      res.locals.user=req.session.user;
      next()
    });
    app.use(app.router);
    app.use(require('less-middleware')({
        src:config.root+'/public/less',
        dest:config.root+'/public/css',
        prefix: '/css',
        compress: true,
        pretty:true
    }));
    app.use(express.static(config.root + '/public'));
    app.use(function(err,req,res,next){
        if(err.message&&(~err.message.indexOf('not found')||~err.message.indexOf('Cast to ObjectId failed'))){
            next()
        }
        console.log(err);
        res.status(500).render('500',{error:err.stack,url:req.originalUrl});
    });
    app.use(function(req,res,next){
        res.status(404).render('404',{
            url:req.originalUrl,
            error:'Not found'
        })
    })
};