/*
 * @Descripttion:
 * @version:
 * @Author: xiaowu
 * @Date: 2020-03-04 09:50:24
 * @LastEditors: xiaowu
 * @LastEditTime: 2020-03-07 02:06:53
 */
var userinfo = require("./userinfoModel.js");

var user = {
    //用户注册
    //1是普通用户 2是管理员 3是超级管理员
    register(username, userpwd,age=18, usertype = 1) {
        return userinfo.insertMany([{
            username,
            userpwd,
            age,
            usertype
        }]);

    },
    //通过用户名查询单个用户
    findOneByUserName(username) {
        return userinfo.findOne({
            username
        });
    },

    deleteOneById(id){
        return userinfo.remove({ "_id": id }, function (err) {
            if (err) return handleError(err);
        });
    },

    //查询所有用户
    findAll(page=1,pageSize=7){
        let skipNum = (page-1) * pageSize;
        return  userinfo.find({},{userpwd:0},{skip:skipNum,limit:pageSize});
    },

    //获取总长度
    getLength(fn){
        userinfo.count({},(err,count)=>{
            fn(count)
        });
    }
}

module.exports = user;