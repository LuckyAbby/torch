const express = require('express');
const multer = require('multer')
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('file:' , file);
    cb(null, './public/userImg')
  },
  filename: (req, file, cb) => {
    console.log('filename:' , file);
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
})


const setting = multer({ storage: storage }).single('avatar')
const router = express.Router();


router.get('/setting', (req, res ) => {
  res.render('setting', {
    path:"",
  });
});


router.post('/setting', (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return console.log('err: ', err);
    }
    // console.log(req.file);
    // console.log(req.file.path);
    res.render('setting', {
      path: req.file.filename,
    });
  });
});


router.get('/setting/information',(req, res) => {
  if(!req.session.user) {
  res.json({
      code: 1001,
      message: '未登录',
    });
  }
  const student_id=req.session.user.student_id;
  req.getConnection(function(errConn,connection) {
    if(errConn) {
      console.error('connection error:',errConn);
      return next(errConn);
    }
    const sql='select major,class from login where student_id=?';
    connection.query(sql, [student_id], (errQuery, result) => {
      if(errQuery) {
        console.error('query error:', errConn);
        return next(errQuery);
      }
      console.log('个人设置的返回结果', result);
      res.render('center',{
        information: result[0],
      });
    });
  });
});


module.exports = router;
