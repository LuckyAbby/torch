var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', message: '' });
});


router.get('/index', function(req, res, next) {
  const message = req.query.message;
  res.render('index', {
    title: 'Express',
    message: decodeURI(message)
   });
});


router.get('/login',function(req,res,next) {
  res.render('index', { title: 'Express' });
});


router.post('/login',function(req,res,next) {
  var student_id=req.body.student_id;
  var password=req.body.password;
  req.getConnection(function(errConn,connection) {
    if(errConn) {
      console.error('connection error: ', errConn);
      return next(errConn);
    }

  var sql='select * from login where student_id=?';
  connection.query(sql,[student_id],function(errQuery, result) {
    if(errQuery) {
      console.error('query error: ', errConn);
      return next(errQuery);
    }
    console.log('result: ', result);
    // 如果用户不存在
    //    提示用户不存在 跳转到登录页面 终止
    // 如果用户存在 继续
    //    如果密码正确 提示登录成功 终止
    //    如果密码错误 提示密码错误 终止
    let message = encodeURI('系统错误');
    if (result.length === 0) {
      // 用户不存在
      message = encodeURI('用户不存在');
      //return res.redirect(`/index?message=${message}`);
      return res.render('index', {
        title: '登录',
        message: '用户不存在',
      });
    }
    console.log(result[0].password);
    if(password===result[0].password) {
      return res.render('main', {
          title: 'LOGIN SUCCESS',
          insertId: result.insertId,
        });
      }
      message = encodeURI('密码错误');
      return res.redirect(`/index?message=${message}`);
    // else if()
    })
  })
});


router.get('/reset',function(req,res,next) {
  res.render('index', { title: 'Express' });
});

router.post('/reset',function(req,res,next){
  var student_name=req.body.student_name;
  var student_id=req.body.student_id;
  var id_card=req.body.id_card;
  req.getConnection(function(errConn,connection) {
    if(errConn) {
      console.error('connection error: ', errConn);
      return next(errConn);
    }
  var sql='select * from login where student_id=?';
  connection.query(sql,[student_id],function(errQuery, result) {
    if(errQuery) {
      console.error('query error: ', errConn);
      return next(errQuery);
    }
    console.log('result: ', result);
    if (result.length !=0 ) {
      if(result[0].student_id==student_id&&result[0].student_name==student_name&&result[0].id_card==id_card) {
        var newPassword=result[0].id_card.substring(result[0].id_card.length-6,result[0].id_card.length)
        var update_sql="update login set password='"+newPassword+"'"+"where student_id=?";
        connection.query(update_sql,[student_id],function(errQuery,result) {
          // 这里的逻辑是：
          // 如果query发生错误，则调用next，并终止代码执行
          // 否则返回json
          if(errQuery) {
            console.error('query error: ', errConn);
            // 这里使用 return 来终止代码执行
            //return next(errQuery);

            // 上面的代码相当于
            next(errQuery);
            return ; // return true; / return false; 都可以
          }
          // 由于第105行有return  所以这里不需要 else 了
          // 因为只要98行的if条件成立了，就永远不会执行到这里
          // 因为if里面第105行终止了程序执行
          res.json({
            code:0
          });
          // 而这后面没有其他代码需要执行了，所以resjson 前面可以有return也可以没有
          // 有return 就类似于：
          //       res.json(...); return ;
          //       return res.json(...);
          //       res.json(...); return true;
          //       res.json(...); return false;
          //  这几个都是等效的
        });
      }
      else {
        res.json({
          code:1
        });
      }
    }
    else {
      res.json({
        code:1
      });
    }
});
});
});
module.exports = router;
