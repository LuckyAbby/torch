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

var upload = multer({ storage: storage }).single('avatar')
//var upload = multer().single('avatar')
var router = express.Router();

router.get('/upload', (req, res ) => {
  res.render('upload',{
    path:"",
  });
});

router.post('/upload', (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      // 发生错误
      return console.log('err: ', err);
    }

    // 一切都好
  console.log(req.file)
    // res.json({
    //   // code: 0,
    //   // file: req.file
    //   path:req.file.path,
    // });
    console.log(req.file.path);
    res.render('upload',{
      path: req.file.filename,
    });
  })

});



module.exports = router;
