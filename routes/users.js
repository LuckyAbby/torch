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


module.exports = router;
