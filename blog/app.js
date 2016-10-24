var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var settings = require('./setting');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

// 生成一个express实例 app。
var app = express();

// view engine setup
// 设置 views 文件夹为存放视图文件的目录, 即存放模板文件的地方,__dirname 为全局变量,存储当前正在执行的脚本所在的目录。
app.set('views', path.join(__dirname, 'views'));
// 设置视图模板引擎为 ejs。
app.set('view engine', 'ejs');

app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    db: settings.db,
    host: settings.host,
    port: settings.port
  })
}));

//flash 是一个在 session 中用于存储信息的特定区域。
//信息写入 flash ，下一次显示完毕后即被清除。典型的应用是结合重定向的功能，确保信息是提供给下一个被渲染的页面。
app.use(flash());


// uncomment after placing your favicon in /public
// 设置/public/favicon.ico为favicon图标。
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// 加载日志中间件。
app.use(logger('dev'));
// 加载解析json的中间件。
app.use(bodyParser.json());
// 加载解析urlencoded请求体的中间件。
app.use(bodyParser.urlencoded({ extended: false }));
// 加载解析cookie的中间件。
app.use(cookieParser());
// 设置public文件夹为存放静态文件的目录。
app.use(express.static(path.join(__dirname, 'public')));




// 路由控制器。
// app.use('/', routes);
// app.use('/users', users);
routes(app)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

