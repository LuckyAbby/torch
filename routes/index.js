const express = require('express');
const crypto = require('crypto');
const async = require('async');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express', message: '' });
});


router.get('/index', (req, res) => {
  const message = req.query.message;
  res.render('index', {
    title: '登陆',
    message: decodeURI(message),
  });
});


router.post('/login', (req, res, next) => {
  const student_id = req.body.student_id;
  const password = req.body.password;
  req.getConnection((errConn, connection) => {
    if (errConn) {
      console.error('connection error: ', errConn);
      return next(errConn);
    }
    const sql = 'select * from login where student_id=?';
    connection.query(sql, [student_id], (errQuery, result) => {
      if (errQuery) {
        console.error('query error: ', errConn);
        return next(errQuery);
      }
      console.log('result: ', result);
      let message = encodeURI('系统错误');
      if (result.length === 0) {
        message = encodeURI('用户不存在');
        return res.render('index', {
          title: '登录',
          message: '用户不存在',
        });
      }

      // md5加盐加密
      const md5_2 = (str, key) => {
        const password_test = crypto
        .createHash('md5')
        .update(`${str}${key}`)
        .digest('hex');
        return password_test;
      };

      const password_salt = md5_2(password, result[0].salt);
      if (password_salt === result[0].password) {
        req.session.user = result[0];
        return res.redirect('/main');
      }
      message = encodeURI('密码错误');
      return res.redirect(`/index?message=${message}`);
    });
  });
});


router.get('/reset', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.post('/reset', (req, res, next) => {
  const student_name = req.body.student_name;
  const student_id = req.body.student_id;
  const id_card = req.body.id_card;
  req.getConnection((errConn, connection) => {
    if (errConn) {
      console.error('connection error: ', errConn);
      return next(errConn);
    }
    const sql = 'select * from login where student_id=?';
    connection.query(sql, [student_id], (errQuery, result) => {
      if (errQuery) {
        console.error('query error: ', errConn);
        return next(errQuery);
      }
      // 判断是否查询到用户
      if (result.length === 0) {
        // 没有该用户，直接返回用户不存在
        return res.json({
          code: 1,
          message: '用户不存在',
        });
      }
      // 判断用户名密码是否正确
      if (!(result[0].student_id === student_id
        && result[0].student_name === student_name
        && result[0].id_card === id_card)) {
        return res.json({
          code: 2,
          message: '用户名或密码错误',
        });
      }
      // 重置密码
      const newPassword = result[0].id_card
        .substring(result[0].id_card.length - 6, result[0].id_card.length);
      const update_sql = 'update login set passwor = ? where student_id = ?';
      connection.query(update_sql, [newPassword, student_id], (errQuery1) => {
        if (errQuery1) {
          console.error('query error1: ', errQuery1);
          return next(errQuery);
        }
        return res.json({
          code: 0,
          message: '更新密码成功',
        });
      });
    });
  });
});


router.get('/main', (req, res, next) => {
  req.getConnection((errConn, connection) => {
    if (errConn) {
      console.error('connection error:', errConn);
      return next(errConn);
    }
    const job_sql = 'SELECT article_title,article_id FROM articles WHERE article_type in(?,?,?,?) ORDER BY article_time DESC LIMIT 0,5';
    const study_sql = 'SELECT article_title,article_id FROM articles WHERE article_type in(?,?,?,?) ORDER BY article_time DESC LIMIT 0,5';
    const aboard_sql = 'SELECT article_title,article_id FROM articles WHERE article_type in(?,?,?) ORDER BY article_time DESC LIMIT 0,5';
    async.series([(callback) => {
      // callback(null,coconn);
      connection.query(job_sql, ['求职实习信息', '求职技巧', '求职经验', '求职其他'], (err, result) => {
        if (err) {
          return callback(err);
        }
        callback(null, result);
      });
    }, (callback) => {
      connection.query(study_sql, ['读研考研经验', '读研保研经验', '读研真题回忆', '读研其他'], (err, result) => {
        if (err) {
          return callback(err);
        }
        callback(null, result);
      });
    }, (callback) => {
      connection.query(aboard_sql, ['出国之路', '出国课程专业', '出国其他'], (err, result) => {
        if (err) {
          return callback(err);
        }
        callback(null, result);
      });
    }], (err, result) => {
      if (err) {
        console.error('query error:', err);
        return next(err);
      }
      res.render('main', {
        title: '首页',
        article_list: result,
      });
    });
  });
});

// 右边部分
router.get('/right', (req, res, next) => {
  req.getConnection((errConn, connection) => {
    if (errConn) {
      console.log('connection error:', errConn);
      return next(errConn);
    }
    const sql = 'SELECT article_title,article_id FROM articles WHERE article_type = ? ORDER BY article_time DESC LIMIT 0,5';
    const sql_hotpoint = 'SELECT article_title,article_id FROM articles ORDER BY  article_clicks DESC LIMIT 0,5';
    connection.query(sql, ['公告'], (errQuery, result1) => {
      if (errQuery) {
        console.error('query err:', errQuery);
        return next(errQuery);
      }
      connection.query(sql_hotpoint, (errQuery2, result2) => {
        if (errQuery2) {
          console.error('query error:', errQuery2);
          return next(errQuery2);
        }
        res.json({
          article_announcement: result1,
          article_hot: result2,
        });
      });
    });
  });
});


router.get('/list', (req, res, next) => {
  const type = req.query.type;
  const page = req.query.page || 1;
  const everyPageNumber = 3;
  const start = everyPageNumber * (page - 1);
  req.getConnection((errConn, connection) => {
    if (errConn) {
      console.error('connection error: ', errConn);
      return next(errConn);
    }
    const sqlArticle = 'select article_title,article_content,article_id,article_clicks,login.student_name,article_time from articles left join login on articles.student_id = login.student_id  where article_type=? order by article_id desc limit ?,?';
    connection.query(sqlArticle, [type, start, everyPageNumber], (errQuery1, result1) => {
      if (errQuery1) {
        console.error('query error: ', errQuery1);
        return next(errQuery1);
      }

      const sqlPageNumber = 'select count(*) as count from articles where article_type=?';
      connection.query(sqlPageNumber, [type], (errQuery2, result2) => {
        if (errQuery2) {
          console.error('error', errQuery2);
          return next(errQuery2);
        }
        const allArticleNumber = result2[0].count;
        let allPageNumber = parseInt(allArticleNumber / everyPageNumber, 10);
        if (allArticleNumber % everyPageNumber !== 0) {
          allPageNumber += 1;
        }
        const hasPrev = Boolean(page > 1);
        const hasNext = Boolean(page < allPageNumber);
        res.render('list', {
          list: result1,
          page,
          hasPrev,
          hasNext,
          type,
        });
      });
    });
  });
});


// localhost:3004/article?article_id=40
router.get('/article', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  const article_id = req.query.article_id;
  req.getConnection((errConn, connection) => {
    if (errConn) {
      console.error('connection error: ', errConn);
      return next(errConn);
    }
    const sql = 'select * from ( articles LEFT JOIN comments ON articles.article_id=comments.article_id) LEFT JOIN login ON articles.student_id=login.student_id WHERE articles.article_id=?';
    const sql_add = 'update articles set article_clicks=article_clicks+1 where article_id=?';
    connection.query(sql, [article_id], (errQuery, result1) => {
      if (errQuery) {
        console.error('query error: ', errQuery);
        return next(errQuery);
      }
      if (result1.length === 0) {
        return res.render('error');
      }
      connection.query(sql_add, [article_id], (errQuery2) => {
        if (errQuery2) {
          console.error('query error:', errQuery2);
          return next(errQuery2);
        }
        res.render('article', {
          articles: result1,
        });
      });
    });
  });
});


// about页面
router.get('/about', (req, res) => {
  res.render('about');
});

router.get('/test', (req, res) => {
  // eslint-disable-next-line
  const { query, connect } = require('./promiseDB');
  // connect db
  connect(req)
    .then((connection) => {
      const sql = 'select * from user where id = ?';
      const params = [1];
      return query(connection, sql, params);
    })
    .then((queryRes) => {
      console.log('queryRes: ', queryRes);
      res.json({
        code: 0,
        data: queryRes,
      });
    })
    .catch((e) => {
      console.log('e: ', e);
      res.json({
        code: 1,
        error: e,
      });
    });
});

module.exports = router;
