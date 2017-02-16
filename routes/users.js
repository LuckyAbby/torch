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
  connection.query(sql,[data],function(errQuery,result,next) {
    if(errQuery) {
      console.error('query error: ', errQuery);
      return next(errQuery);
    }
    return res.json({
      code: 0,
      message: '评论成功',
    });
  });
});
});


//获取页面的点赞数目的路由
router.get('/supportCount',function(req,res,next) {
  if(!req.session.user) {
    res.json({
      code:1001,
      message:用户未登录,
    });
  }
  var article_id=req.query.article_id;
  var student_id=req.session.user.student_id;
  req.getConnection(function(errConn,connection) {
    if(errConn) {
      console.log("errConn:",errConn);
      return next(errConn);
    }
    var supportSqlCount='select count(*) as count from support where support_flag=? and article_id=?';


// 还需查询这个任之前时候已经点过赞 点过的话就直接要显示已经赞过的图片而不是未点赞的图片
  var supportFlag='select support_flag from support where article_id = ? and student_id = ? order by support_id desc';

    connection.query(supportSqlCount,['1',article_id],function (errQuery,result1) {
      if(errQuery) {
        console.log("errQuery:",errQuery);
        return next(errQuery);
      }
      connection.query(supportSqlCount,['0',article_id],function (errQuery,result2) {
        if(errQuery) {
          console.log("errQuery:",errQuery);
          return next(errQuery);
        }
        var result=result1[0].count-result2[0].count;
        connection.query(supportFlag,[article_id,student_id],function(errQuery,result3) {
          if(errQuery) {
            console.error("errQuery:",errQuery);
            return next(errQuery);
          }
          console.log("查询点赞状态结果:",result3[0]);
          if(result3[0]===undefined||result3[0].support_flag==0) {
            status=0;
          }
          else {
            status=1;
          }
          return res.json({
            code: 0,
            message:'查询成功',
            supportCount:result,
            status : status,
            });
        });
      });
    });
  });
});


//点赞的路由
router.post('/support',function(req,res,next) {
  if(!req.session.user) {
    res.json({
      code:1001,
      message:'该用户未登录',
    })
  }
  var article_id=req.body.article_id;
  var student_id=req.session.user.student_id;
  var support_flag=req.body.support;
  var data={
    student_id,
    article_id,
    support_flag,
    support_time:new Date(),
  }
  req.getConnection(function(errConn,connection) {
    if(errConn) {
      console.error("errConn:",errConn);
      return next(errConn);
    }
    var sql="insert into support set ?";
    connection.query(sql,[data],function(errQuery,result){
      if(errQuery) {
        console.error("errQuery :",errQuery);
        return next(errQuery);
      }
      res.json({
        code:0,
        message:'点赞成功',
      })
    })
  })
})


//获取页面点赞、评论以及点击量数目
// router.get('/message')






module.exports = router;
