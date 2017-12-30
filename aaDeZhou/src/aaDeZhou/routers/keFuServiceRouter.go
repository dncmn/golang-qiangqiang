package routers

import (
	"aaDeZhou/controllers/keFu_operation"

	"github.com/astaxie/beego"
)

func init() {

	//玩家查询页面
	beego.Router("/toFindUserPage", &keFu_operation.WorkerOpeController{}, "*:ToFindUserPage")
	//获取玩家数据
	beego.Router("toGetUserData", &keFu_operation.WorkerOpeController{}, "*:GetUserData")

	//登录查询页面

	beego.Router("/toFindLoginPage", &keFu_operation.WorkerOpeController{}, "*:ToFindLoginPage")
	//获取玩家登录信息
	beego.Router("toGetUserLoginData", &keFu_operation.WorkerOpeController{}, "*:ToGetUserLoginData")

	//充值查询页面
	beego.Router("/toFindPayIncomePage", &keFu_operation.WorkerOpeController{}, "*:ToFindPayIncomePage")
	//获取充值记录
	beego.Router("toGetPayIncomeData", &keFu_operation.WorkerOpeController{}, "*:ToGetPayIncomeData")

	//同IP查询
	beego.Router("/toFindIpPage", &keFu_operation.WorkerOpeController{}, "*:ToFindIpPage")

	//同IP登录
	beego.Router("/allIpLogin", &keFu_operation.WorkerOpeController{}, "*:AllIpLogin")

	//IP查询
	beego.Router("/singleIpLogin", &keFu_operation.WorkerOpeController{}, "*:SingleIpLogin")

}
