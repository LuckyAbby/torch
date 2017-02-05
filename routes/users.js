var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/write', function(req, res, next) {
  if(req.session.user) {
    var message=req.query.message;
    res.render('write', {
      message: decodeURI(message)
    });
  }
  else {
    res.redirect('/');
  }
});

router.post('/write', function(req, res, next) {
  if(req.session.user) {
  var article_title=req.body.art_title;
  var article_type=req.body.type;
  var article_content=req.body.textarea;
  var student_id = req.session.user.student_id;
  var article_time = new Date();
  req.getConnection(function(errConn,connection) {
    if(errConn) {
      console.error('connection error: ', errConn);
      return next(errConn);
    }
    var sql='insert into articles (article_title,article_type,article_content,student_id,article_time) VALUES(?,?,?,?,?)';
    connection.query(sql,[article_title,article_type,article_content,student_id,article_time],function(errQuery, result) {
      if(errQuery) {
        console.error('query error: ', errConn);
        return next(errQuery);
      }
      console.log('result: ', result);
      var message=encodeURI('保存成功');
      return res.redirect(`/users/write?message=${message}`);
  });
});
}
  else {
    res.redirect('/');
  }
});

router.post('/comment',function(req,res) {
  if(!req.session.user) {
  res.json({
      code: 1001,
      message: '未登录',
    });
  }
  var comment_content=req.body.comment_content;
  var article_id=req.body.article_id;
  var student_id=req.session.user.student_id;
  var data = {
    comment_content,
    article_id,
    student_id,
    comment_time:new Date(),
  };
  req.getConnection(function(errConn,connection) {
    if(errConn) {
      console.error('connection error: ', errConn);
      return next(errConn);
    }
  var sql='insert into comments set ?';
  connection.query(sql,[data],function(errQuery,result) {
    if(errQuery) {
      console.error('query error: ', errConn);
      return next(errQuery);
    }
    return res.json({
      code: 0,
      message: '评论成功',
    });
  });
});
});


router.post('/support',function(req,res,next) {
  if(!req.session.user) {
    console.log('11111');
  res.json({
      code: 1001,
      message: '未登录',
    });
  }
  var article_id=req.body.article_id;
  var supportFlag=req.body.support;
  var student_id=req.session.user.student_id;
  var data = {
    article_id,
    student_id,
    support_flag:supportFlag,
    support_time:new Date(),
  };
  console.log("data is:",data);
  req.getConnection(function(errConn,connection) {
    if(errConn) {
      console.error('connection error: ', errConn);
      return next(errConn);
    }
    var supportSql='insert  into support set ?';
    var cancelSupportSql='insert into support set ?';
    if(supportFlag===true) {
      console.log('2222222');
      connection.query(supportSql,[data],function(errQuery,result) {
        if(errQuery) {
          console.error('query error: ', errQuery);
          return next(errQuery);
        }
        return res.json({
          code: 0,
          message:'点赞成功',
        })
      })
    }
    else {
      console.log('3333333333');
      connection.query(cancelSupportSql,[data],function(eerrQuery,result) {
        if(errQuery) {
          console.error('errQuery',errQuery);
          return next(errQuery);
        }
        return rej.json({
          code:1,
          message:'取消点赞成功',
        })
      })
    }
  })
})

module.exports = router;
