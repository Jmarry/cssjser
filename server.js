
/**
 * server settings
 */

var express = require('express')
  , mongoose=require('mongoose')
  , env=process.env.NODE_ENV||'development'
  , config=require('./config/config')[env]
  , http=require('http')
  , port=process.env.PORT || 3000
  , app = express();
//connect db
mongoose.connect(config.db);
//setting express
require('./config/express')(app,config);
//setting router
require('./config/router')(app);
require('./lib/qiniu').Init(config);
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//listen port
http.createServer(app).listen(port, function(){
  console.log('I`m working for '+app.get('env'));
});
