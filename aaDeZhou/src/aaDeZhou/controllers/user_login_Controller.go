package controllers

import (
	"aaDeZhou/models/user_manager"
	"encoding/json"

	"log"

	"strings"
	"time"

	"aaDeZhou/models/utils"

	"github.com/astaxie/beego"

	"fmt"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

type LoginController struct {
	beego.Controller
}

func (this *LoginController) Get() {

	this.TplName = "login.html"
}

//账户信息验证
func (this *LoginController) Post() {

	userName := this.GetString("userName")
	password := this.GetString("password")

	md5 := utils.Md5String(password)

	roleIdArr := []string{"1", "6"}
	if userName == "" || len(userName) == 0 || len(strings.TrimSpace(userName)) == 0 {
		loginInfo := ErrorLogin{State: 1, Data: LoginInfo{UserName: userName, Password: md5, RoleId: roleIdArr}, Message: "用户名不能为空"}
		//file_name,time,reason,method_name
		time := time.Now().Format("2006-01-02 15:04")
		msg := fmt.Sprint("user_login_controller.go", "    ", time, "    ", "用户名不能为空")
		utils.Write_user_Info("log/user_login_err.log", msg)
		arr, _ := json.Marshal(loginInfo)

		this.Ctx.WriteString(string(arr))

		return
	}
	if password == "" || len(password) == 0 || len(strings.TrimSpace(password)) == 0 {
		loginInfo := ErrorLogin{State: 2, Data: LoginInfo{UserName: userName, Password: md5, RoleId: roleIdArr}, Message: "密码不能为空"}
		//file_name,time,reason,method_name
		time := time.Now().Format("2006-01-02 15:04")
		msg := fmt.Sprint("user_login_controller.go", "    ", time, "    ", "密码不能为空")
		utils.Write_user_Info("log/user_login_err.log", msg)
		arr, _ := json.Marshal(loginInfo)

		this.Ctx.WriteString(string(arr))

		return
	}

	isLogin, _ := user_manager.CheckLoginInfo(userName, password)

	if !isLogin {
		loginInfo := ErrorLogin{State: 3, Data: LoginInfo{UserName: userName, Password: md5, RoleId: roleIdArr}, Message: "用户名或者密码错误"}

		//file_name,time,reason,method_name
		time := time.Now().Format("2006-01-02 15:04")
		msg := fmt.Sprint("user_login_controller.go", "    ", time, "    ", "用户名或密码错误")
		utils.Write_user_Info("log/user_login_err.log", msg)
		arr, _ := json.Marshal(loginInfo)

		this.Ctx.WriteString(string(arr))

		return
	}

	//登录成功

	path := utils.GetLogPath("user_login.log")
	//用户登录成功,记录登录的用户信息
	utils.Write_user_Info(path, userName)

	this.SessionRegenerateID()
	sess := this.StartSession()
	token := sess.SessionID()
	//
	///*
	//	这里是用户名和密码对了以后,将登录成功以后产生的sessionId更新到admin_user表中
	//	否则按照登录失败处理。
	//
	//*/

	sess.Set("token", token)
	sess.Set("uname", userName)

	//登录成功,获取用户的action的id
	ids := user_manager.ShowUserActionIds(userName)
	userId := user_manager.ShowUserId(userName)
	loginInfo := ErrorLogin{State: 0, Data: LoginInfo{UserName: userName, Password: md5,
		UserId: userId, RoleId: ids}, Message: "登录成功", Token: token}
	arr, _ := json.Marshal(loginInfo)

	log.Println(userName, "登录成功", "登录时间是", time.Now().Format("2006-01-02 15:04"))
	this.Ctx.WriteString(string(arr))

}

//用户注销
func (this *LoginController) Logout() {
	userName := this.GetSession("uname")
	utils.Write_user_Info("log/user_logout.log", userName.(string))
	log.Println(userName, " 注销登录了")
	this.DestroySession()

	this.Redirect("/login", 302)
}
