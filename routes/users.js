/*
 * @Descripttion:
 * @version:
 * @Author: xiaowu
 * @Date: 2020-03-03 22:24:09
 * @LastEditors: xiaowu
 * @LastEditTime: 2020-03-08 20:16:38
 */
var express = require('express');
var router = express.Router();
const user = require('../model/user');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/* GET users listing. */
//测试
router.post('/test', function (req, res, next) {
  res.json({
    status:"1",
    msg:"测试成功"
  });
});

//登录
router.post('/login', function (req, res, next) {
  let {
    username,
    password:userpwd
  } = req.body;
  // console.log( username,userpwd)
  userpwd = crypto
    .createHmac('sha1', userpwd)
    .update('xiaowu')
    .digest('hex');

  user.findOneByUserName(username).then(result => {
    if (result) {
      if (result.userpwd === userpwd) {
        //登录成功
        var content = {
          username,
          time: Date.now()
        };
        var token = jwt.sign(content, 'xiaowu', {
          expiresIn: 60 * 60 * 1 * 24
        }); //1天过期

        res.json({
          code: 1,
          token,
          user:result.username,
          roles:result.usertype,
          msg: '登录成功'
        });
      } else {
        res.json({
          code: -1,
          msg: '用户名或密码错误'
        });
      }
    } else {
      res.json({
        code: 0,
        msg: '用户名不不存在'
      });
    }
  });
});

//注册
router.post('/register', function (req, res, next) {
  let {
    username,
    userpwd,
    age,
    usertype
  } = req.body;
  //1是普通用户 2是管理员 3是超级管理员
  if(!usertype){usertype=1;}
  if(!age){age=18;}




  userpwd = crypto
    .createHmac('sha1', userpwd)
    .update('xiaowu')
    .digest('hex');


    console.log(username,
      userpwd,
      age,
      usertype);
  user.findOneByUserName(username).then(result => {
    if (result) {
      res.json({
        code: 0,
        msg: '用户名已存在'
      });
    } else {
      var content = {
        username,
        time: Date.now()
      };
      var token = jwt.sign(content, 'xiaowu', {
        expiresIn: 60 * 60 * 1 * 24
      }); //1天过期
      user.register(username, userpwd,age, usertype).then(result => {
        if (result) {
          res.json({
            code: 1,
            msg: '注册成功，已帮您自动登录',
            token,
            user:username,
            roles:usertype,
          });
        } else {
          res.json({
            code: -1,
            msg: '服务器错误~'
          });
        }
      });
    }
  });
});

//删除
router.post('/del', function (req, res, next) {
  let {id} = req.body;

  user.deleteOneById(id).then((result)=>{
    if(result){
      res.json({
        code:"1",
        msg:"删除成功"
      });
    }else{
      res.json({
        code:"0",
        msg:"删除失败"
      });
    }
  });

});

//获取用户列表
router.get('/getusers', function (req, res, next) {
  let {page,pageSize} = req.query;

  user.getLength(
    (count)=>{
      user.findAll(page,pageSize*1).then(result=>{
        if(result){
          res.json({
            code:1,
            msg:"读取成功",
            data:result,
            count:count
          });
        }else{
          res.json({
            code:0,
            msg:"获取失败"
          });
        }
      })

    }

  );

})



module.exports = router;