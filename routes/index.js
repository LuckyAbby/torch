var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', message: '' });
});


router.get('/index', function(req, res, next) {
  const message = req.query.message;
  res.render('index', {
    title: '登陆',
    message: decodeURI(message)
   });
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
      req.session.user=result[0];
      // const str = 'aaa' + 'bbb' + res;
      // const str = `aaabbb${res}`
      return res.redirect('/main');
      }
      message = encodeURI('密码错误');
      return res.redirect(`/index?message=${message}`);
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

          if(errQuery) {
            console.error('query error: ', errConn);
            next(errQuery);
            return ;
          }
          res.json({
            code:0
          });
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


router.get('/main',function(req,res,next) {
  req.getConnection(function(errConn,connection) {
    if(errConn) {
      console.error('connection error: ', errConn);
      return next(errConn);
    }
    var job_sql='SELECT article_title,article_id FROM articles WHERE article_type in(?,?,?,?) ORDER BY article_time DESC LIMIT 0,5';
    connection.query(job_sql,['求职实习信息','求职技巧','求职经验','求职其他'],function(errQuery,result1) {
      if(errQuery) {
        console.error('query error: ', errConn);
        return next(errQuery);
      }

        var study_sql='SELECT article_title,article_id FROM articles WHERE article_type in(?,?,?,?) ORDER BY article_time DESC LIMIT 0,5';
      connection.query(study_sql,['读研考研经验','读研保研经验','读研真题回忆','读研其他'],function(errQuery,result2) {
        if(errQuery) {
        console.error('query error: ', errConn);
        return next(errQuery);
          }
        var aboard_sql='SELECT article_title,article_id FROM articles WHERE article_type in(?,?,?) ORDER BY article_time DESC LIMIT 0,5';
        connection.query(aboard_sql,['出国之路','出国课程专业','出国其他'],function(errQuery,result3) {
          if(errQuery) {
                console.error('query error: ', errConn);
                return next(errQuery);
              }
              var result=[result1,result2,result3];
              console.log(result);
            res.render('main',{
                title:"首页",
                article_list:result
          });
        });
      });
    });
  });
});


router.get('/list',function(req,res,next){
  var type=req.query.type;
  var page = req.query.page || 1;
  var everyPageNumber = 4;
  var start = everyPageNumber*(page-1);
  req.getConnection(function(errConn,connection) {
    if(errConn) {
      console.error('connection error: ', errConn);
      return next(errConn);
    }
    // 查询总条数
    // select count(*) from articles where article_type=?;
    // 计算有多少页
    var sqlArticle='select article_title,article_content,article_id from articles where article_type=? order by article_id desc limit ?,?';
    connection.query(sqlArticle,[type, start, everyPageNumber],function(errQuery,result1) {
      if(errQuery) {
        console.error('query error: ', errQuery);
        return next(errQuery);
      }
      console.log('result1',result1);
      var sqlPageNumber='select count(*) as count from articles where article_type=?';
      connection.query(sqlPageNumber,[type],function(errQuery,result2){
        if(errQuery) {
          console.error('error',errQuery)
          return next(errQuery);
        }
        console.log('result2:',result2);
        var allArticleNumber = result2[0].count;
        var allPageNumber=parseInt(allArticleNumber/everyPageNumber, 10);
        if(allArticleNumber%everyPageNumber!==0) {
          allPageNumber += 1;
        }
        console.log('page: ', page);
        console.log('allPageNumber', allPageNumber);
        var hasPrev = page > 1 ? true : false;
        var hasNext = page < allPageNumber ? true : false;
        res.render('list',{
          list:result1,
          page:page,
          hasPrev,
          hasNext,
          type:type,
        });
      });
    });
  });
});


// localhost:3004/article?article_id=40
router.get('/article', function(req, res,next) {
  const article_id = req.query.article_id;

  req.getConnection(function(errConn,connection) {
    if(errConn) {
      console.error('connection error: ', errConn);
      return next(errConn);
    }
    // const sql = 'select * from articles where article_id=?';
    const sql = 'select * from articles ' +
'LEFT JOIN comments ' +
'on articles.article_id=comments.article_id ' +
'where articles.article_id=?';
    connection.query(sql,[article_id],function(errQuery,result) {
      if(errQuery) {
        console.error('query error: ', errQuery);
        return next(errQuery);
      }
      console.log("result:"+result);
      console.log("result[0]"+result[0]);
      if(result.length===0) {
        res.render('error');
      }
      res.render('article',{
        articles: result,
      });
    });
  });
});


module.exports = router;
