var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;

module.exports = function (app) {
  app.get('/', function(req, res) {
    res.render('index', { title: '主页' });
  });
  app.get('/reg', function(req, res) {
    res.render('reg', { title: '注册' });
  });
  app.post('/reg', function(req, res) {
    
  });
  app.get('/login', function(req, res) {
    res.render('login', { title: '登录' });
  });
  app.post('/login', function(req, res) {
    
  });
  app.get('/post', function(req, res) {
    res.render('post', { title: '提交' });
  });
  app.post('/post', function(req, res) {
    
  });
  app.get('/loginOut', function(req, res) {
    res.render('loginOut', { title: '退出' });
  });
  app.post('/loginOut', function(req, res) {
    
  });
}
