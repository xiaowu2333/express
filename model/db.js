var mongoose = require("mongoose");
var DB_URL = "mongodb://localhost:27017/blog";

mongoose.connect(DB_URL, {
    useNewUrlParser: true
});
//状态的监听
mongoose.connection.on("connected", function () {
    console.log("连接成功");
});
mongoose.connection.on("error", function (err) {
    console.log(err);
});
mongoose.connection.on("disconnected", function () {
    console.log("连接断开");
});
//导出方便其他地方使用
module.exports = mongoose;