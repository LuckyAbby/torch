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


// router.get('/main',function(req,res,next) {
//   req.getConnection(function(errConn,connection) {
//     if(errConn) {
//       console.error('connection error:' ,errConn);
//       return next(errConn);
//     }
//     var job_sql='SELECT article_title,article_id FROM articles WHERE article_type in(?,?,?,?) ORDER BY article_time DESC LIMIT 0,5';
//     var study_sql='SELECT article_title,article_id FROM articles WHERE article_type in(?,?,?,?) ORDER BY article_time DESC LIMIT 0,5';
//     var aboard_sql='SELECT article_title,article_id FROM articles WHERE article_type in(?,?,?) ORDER BY article_time DESC LIMIT 0,5';
//     async.series([function(callback) {
//       // callback(null,coconn);
//       connection.query(job_sql, ['求职实习信息','求职技巧','求职经验','求职其他'],function(err, result) {
//         if (err) {
//           return callback(err);
//         }
//         callback(null, result);
//       });
//     },function(callback) {
//       connection.query(study_sql,['读研考研经验','读研保研经验','读研真题回忆','读研其他'],function(err,result) {
//         if(err) {
//           return callback(err);
//         }
//         callback(null,result);
//       });
//     },function(callback) {
//       connection.query(aboard_sql,['出国之路','出国课程专业','出国其他'],function(err,result) {
//         if(err) {
//           return callback(err);
//         }
//         callback(null,result);
//       });
//     }],function (err,result) {
//       if(err) {
//         console.error("query error:",err);
//         return next(err);
//       }
//       res.render('main',{
//           title:"首页",
//           article_list:result
//       });
//     });
//   });
// });



// 右边部分
router.get('/right',function(req,res,next) {
  req.getConnection(function(errConn,connection) {
    if(errConn) {
      conole.log("connection error:",errConn);
      return next(errConn);
    }
    var sql='SELECT article_title,article_id FROM articles WHERE article_type = ? ORDER BY article_time DESC LIMIT 0,5';
    var sql_hotpoint='SELECT article_title,article_id FROM articles ORDER BY  article_clicks DESC LIMIT 0,5';
    connection.query(sql,['公告'],function(errQuery,result1) {
      if(errQuery) {
        console.error("query err:",errQuery);
        return next(errQuery);
      }
      console.log("右边部分的公告的result1:",result1);
      connection.query(sql_hotpoint,function(errQuery,result2) {
        if(errQuery) {
          console.error("query error:",errQuery);
          return next(errQuery);
        }
        console.log("右边部分的热点推荐的result2:",result2);
        res.json({
          article_announcement:result1,
          article_hot:result2,
        });
      })

    })
  })
})


router.get('/list',function(req,res,next){
  var type=req.query.type;
  var page = req.query.page || 1;
  var everyPageNumber = 3;
  var start = everyPageNumber*(page-1);
  req.getConnection(function(errConn,connection) {
    if(errConn) {
      console.error('connection error: ', errConn);
      return next(errConn);
    }
    // 查询总条数
    // select count(*) from articles where article_type=?;
    // 计算有多少页
    // var sqlArticle='select article_title,article_content,article_id from articles where article_type=? order by article_id desc limit ?,?';
    var sqlArticle='select article_title,article_content,article_id,article_clicks,login.student_name,article_time from articles left join login on articles.student_id = login.student_id  where article_type=? order by article_id desc limit ?,?';

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
        // console.log('result2:',result2);
        var allArticleNumber = result2[0].count;
        var allPageNumber=parseInt(allArticleNumber/everyPageNumber, 10);
        if(allArticleNumber%everyPageNumber!==0) {
          allPageNumber += 1;
        }
        // console.log('page: ', page);
        // console.log('allPageNumber', allPageNumber);
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
  if(!req.session.user) {
    return res.redirect('/');
  }
  const article_id = req.query.article_id;
  req.getConnection(function(errConn,connection) {
    if(errConn) {
      console.error('connection error: ', errConn);
      return next(errConn);
    }
const sql='select * from ( articles LEFT JOIN comments ON articles.article_id=comments.article_id) LEFT JOIN login ON articles.student_id=login.student_id WHERE articles.article_id=?';
const sql_add='update articles set article_clicks=article_clicks+1 where article_id=?';
    connection.query(sql,[article_id],function(errQuery,result1) {
      if(errQuery) {
        console.error('query error: ', errQuery);
        return next(errQuery);
      }
      if(result1.length===0) {
        res.render('error');
      }
      connection.query(sql_add,[article_id],function(errQuery,result2) {
        if(errQuery) {
          console.error("query error:",errQuery);
          return next(errQuery);
        }
        res.render('article',{
          articles:result1,

        });
      });
      // res.render('article',{
      //   articles: result,
      //   article_clicks,
      // });
    });
  });
});


// about页面
router.get('/about',function(req,res,next) {
  res.render('about');
})
module.exports = router;
