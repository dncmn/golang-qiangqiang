package main

import (
	_ "aaDeZhou/routers"

	"github.com/astaxie/beego"
	//"github.com/astaxie/beego/context"
	"os"
)

func init() {
	//初始化记录日志的文件

	os.OpenFile("log/user_login.log", os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)      //保存用户登录信息的日志
	os.OpenFile("log/user_logout.log", os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)     //保存用户注销信息的日志
	os.OpenFile("log/user_login_err.log", os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)  //保存错误信息的日志
	os.OpenFile("log/user_errInfo.log", os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)    //保存错误信息的日志
	os.OpenFile("log/user_operation.log", os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)  //保存用户操作的日志
	os.OpenFile("log/send_systemInfo.log", os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644) //保存发布系统消息时的日志
	os.OpenFile("log/power_status.log", os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)    //保存发布系统消息时的日志
	os.OpenFile("log/account_status.log", os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)  //保存发布系统消息时的日志
	os.OpenFile("log/sng.log", os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)             //保存发布系统消息时的日志

}

func main() {

	////添加了一个拦截器
	//var FilterUser = func(ctx *context.Context) {
	//
	//	_, ok := ctx.Input.Session("token").(string) //服务器保存的token
	//
	//	if !ok && ctx.Request.RequestURI != "/login" {
	//
	//		ctx.Redirect(302, "/login")
	//	}
	//
	//}
	//
	//beego.InsertFilter("/*", beego.BeforeRouter, FilterUser)
	beego.Run()

}
