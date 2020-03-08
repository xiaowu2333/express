/*
 * @Descripttion:
 * @version:
 * @Author: xiaowu
 * @Date: 2020-03-03 22:24:09
 * @LastEditors: xiaowu
 * @LastEditTime: 2020-03-08 22:58:36
 */
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const formidable = require('formidable');
const fs = require("fs");

//拦截所有请求
router.use(function (req, res, next) {

  if (req.url !== "/users/login" && req.url !== "/users/register") {
    //验证
    console.log(req.headers.token)
    jwt.verify(req.headers.token, "xiaowu", (err, code) => {
      // console.log(err);
      if (!err) {
        //token验证通过后可以正常访问接口
        next();
      } else {
        res.json({
          tokenStatus: -1,
          message: 'error verify fail!'
        })
        // next()
      }
    })
  } else { //登录和注册可以正常访问接口
    next();
  }
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

//上传文件
router.post("/upload",(req,res)=>{
  console.log("上传文件");
	const form = formidable({ multiples: false });
	form.uploadDir="./public/upload/"  //设置上传路径
	form.parse(req, (err, fields, files) => {

		 if(!files.file) return;  //没有上传文件，不进行任何处理
     //上传文件重命名
     var endExtend = files.file.name.split(".");
     var end = endExtend[endExtend.length-1];
     var startName = new Date().getTime();
     var name = startName+"."+end;
     console.log(files.file.path,form.uploadDir+name);
		 fs.renameSync(files.file.path,form.uploadDir+name);
		 res.json({
			 status:0,
			 path:"/upload/"+name
		 })
	  });
})

module.exports = router;