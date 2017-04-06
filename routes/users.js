const express = require('express');
const xss = require('xss');


const router = express.Router();


/* GET users listing. */
router.get('/write', (req, res) => {
  if (req.session.user) {
    const message = req.query.message;
    return res.render('write', {
      message: decodeURI(message),
    });
  }
  return res.redirect('/');
});

router.post('/write', (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/');
  }
  const article_title = xss(req.body.art_title);
  const article_type = req.body.type;
  const article_content = xss(req.body.textarea);
  const student_id = req.session.user.student_id;
  const article_time = new Date();
  req.getConnection((errConn, connection) => {
    if (errConn) {
      console.error('connection error: ', errConn);
      return next(errConn);
    }
    const sql = 'insert into articles (article_title,article_type,article_content,student_id,article_time) VALUES(?,?,?,?,?)';
    const data = [article_title, article_type, article_content, student_id, article_time];
    connection.query(sql, data, (errQuery, result) => {
      if (errQuery) {
        console.error('query error: ', errConn);
        return next(errQuery);
      }
      console.log('result: ', result);
      const message = encodeURI('保存成功');
      return res.redirect(`/users/write?message=${message}`);
    });
  });
});

router.post('/comment', (req, res) => {
  if (!req.session.user) {
    // 如果没有登录，直接返回json，并且终止程序执行
    return res.json({
      code: 1001,
      message: '未登录',
    });
  }
  const comment_content = req.body.comment_content;
  const article_id = req.body.article_id;
  const student_id = req.session.user.student_id;
  const data = {
    comment_content,
    article_id,
    student_id,
    comment_time: new Date(),
  };
  req.getConnection((errConn, connection) => {
    if (errConn) {
      console.error('connection error: ', errConn);
      // return next(errConn);
      return res.json({
        code: 1,
        message: '连接数据库失败',
        error: errConn,
      });
    }
    const sql = 'insert into comments set ?';
    connection.query(sql, [data], (errQuery, result) => {
      if (errQuery) {
        console.error('query error: ', errQuery);
        // return next(errQuery);
        return res.json({
          code: 2,
          message: '评论失败',
          error: errConn,
        });
      }
      console.log('result: ', result);
      return res.json({
        code: 0,
        message: '评论成功',
      });
    });
  });
});


// 获取页面的点赞数目的路由
router.get('/supportCount', (req, res) => {
  if (!req.session.user) {
    return res.json({
      code: 1001,
      message: '用户未登录',
    });
  }
  const article_id = req.query.article_id;
  const student_id = req.session.user.student_id;
  req.getConnection((errConn, connection) => {
    if (errConn) {
      console.log('errConn:', errConn);
      // return next(errConn);
      return res.json({
        code: 1002,
        message: '连接数据库失败',
      });
    }
    const supportSqlCount = 'select count(*) as count from support where support_flag=? and article_id=?';
    // 还需查询这个任之前时候已经点过赞 点过的话就直接要显示已经赞过的图片而不是未点赞的图片
    const supportFlag = 'select support_flag from support where article_id = ? and student_id = ? order by support_id desc';

    connection.query(supportSqlCount, ['1', article_id], (errQuery, result1) => {
      if (errQuery) {
        console.log('errQuery:', errQuery);
        return res.json({
          code: 1003,
          message: 'db error',
        });
        // return next(errQuery);
      }
      connection.query(supportSqlCount, ['0', article_id], (errQuery2, result2) => {
        if (errQuery2) {
          console.log('errQuery2:', errQuery2);
          // return next(errQuery2);
          return res.json({
            code: 1003,
            message: 'db error',
          });
        }
        const result = result1[0].count - result2[0].count;
        let status = 0;
        connection.query(supportFlag, [article_id, student_id], (errQuery3, result3) => {
          if (errQuery3) {
            console.error('errQuery3:', errQuery3);
            // return next(errQuery3);
            return res.json({
              code: 1003,
              message: 'db error',
            });
          }
          console.log('查询点赞状态结果:', result3[0]);
          if (result3[0] === undefined || result3[0].support_flag === 0) {
            status = 0;
          } else {
            status = 1;
          }
          return res.json({
            code: 0,
            message: '查询成功',
            supportCount: result,
            status,
          });
        });
      });
    });
  });
});


// 点赞的路由
router.post('/support', (req, res) => {
  if (!req.session.user) {
    return res.json({
      code: 1001,
      message: '该用户未登录',
    });
  }
  const article_id = req.body.article_id;
  const student_id = req.session.user.student_id;
  const support_flag = req.body.support;
  const data = {
    student_id,
    article_id,
    support_flag,
    support_time: new Date(),
  };
  req.getConnection((errConn, connection) => {
    if (errConn) {
      console.error('errConn:', errConn);
      // return next(errConn);
      return res.json({
        code: 1003,
        message: 'db error',
      });
    }
    const sql = 'insert into support set ?';
    connection.query(sql, [data], (errQuery, result) => {
      if (errQuery) {
        console.error('errQuery :', errQuery);
        // return next(errQuery);
        return res.json({
          code: 1003,
          message: 'db error',
        });
      }
      console.log('result: ', result);
      return res.json({
        code: 0,
        message: '点赞成功',
      });
    });
  });
});

module.exports = router;
