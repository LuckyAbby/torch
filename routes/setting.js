var express = require('express');
var multer  = require('multer')
var path = require('path');
//var upload = multer({ dest: 'uploads/' })
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('file:' , file);
    cb(null, './public/userImg')
  },
  filename: function (req, file, cb) {
    console.log('filename:' , file);
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
})
//
// var upload = multer({ storage: storage }).single('avatar')
// //var upload = multer().single('avatar')
// var router = express.Router();
//
// router.get('/upload', (req, res ) => {
//   res.render('upload',{
//     path:"",
//   });
// });
//
// router.post('/upload', (req, res, next) => {
//   upload(req, res, function (err) {
//     if (err) {
//       // 发生错误
//       return console.log('err: ', err);
//     }
//
//     // 一切都好
//     console.log(req.file);
//     console.log(req.file.path);
//     res.render('upload',{
//       path: req.file.filename,
//     });
//   })
//
// });


var setting = multer({ storage: storage }).single('avatar')
//var upload = multer().single('avatar')
var router = express.Router();

router.get('/setting', (req, res ) => {
  res.render('setting',{
    path:"",
  });
});

router.post('/setting', (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      // 发生错误
      return console.log('err: ', err);
    }

    // 一切都好
    console.log(req.file);
    console.log(req.file.path);
    res.render('setting',{
      path: req.file.filename,
    });
  })

});






router.get('/setting/information',function(req,res,next) {
  if(!req.session.user) {
  res.json({
      code: 1001,
      message: '未登录',
    });
  }
  var student_id=req.session.user.student_id;
  req.getConnection(function(errConn,connection) {
    if(errConn) {
      console.error('connection error:',errConn);
      return next(errConn);
    }
    var sql='select major,class from login where student_id=?';
    connection.query(sql,[student_id],function(errQuery,result) {
      if(errQuery) {
        console.error('query error:',errConn);
        return next(errQuery);
      }
      console.log('个人设置的返回结果',result);
      res.render('center',{
        information:result[0],
      })
    })
  })
})






module.exports = router;
