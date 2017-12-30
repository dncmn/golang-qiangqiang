package routers

import (
	"aaDeZhou/controllers"

	"github.com/astaxie/beego"
)

func init() {

	//用户登录以及信息验证
	beego.Router("/login", &controllers.LoginController{})

	//用户注销
	beego.Router("/logout", &controllers.LoginController{}, "get:Logout")

	//后台管理的主页面
	beego.Router("/toIndex", &controllers.MainController{})
	//后台管理的主页面的右半部分
	beego.Router("/toContent", &controllers.MainController{}, "get:ToContent")

}
