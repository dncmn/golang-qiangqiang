package routers

import (
	"aaDeZhou/controllers/keFu_operation"

	"github.com/astaxie/beego"
)

func init() {

	//账户查询
	beego.Router("/toFindCountInfoPage", &keFu_operation.WorkerOpeController{}, "*:ToFindCountInfoPage")

	//获取账户数据
	beego.Router("/getCountInfo", &keFu_operation.WorkerOpeController{}, "*:GetCountInfo")

	//系统消息页面--toSystemInfoPage
	beego.Router("/toSystemInfoPage", &keFu_operation.WorkerOpeController{}, "*:ToSystemInfoPage")

	//授予权限  toGrantPower
	beego.Router("/toGrantPower", &keFu_operation.WorkerOpeController{}, "*:ToGrantPower")

	//授予权限--获取权限列表
	beego.Router("/toFindPowerList", &keFu_operation.WorkerOpeController{}, "*:ToFindPowerList")
	//授予权限--根据玩家昵称或玩家id查询权限信息
	beego.Router("/toFindPowerByName", &keFu_operation.WorkerOpeController{}, "*:ToFindPowerByName")

	//***********************处理页面发送过来的的那个处理权限状态的请求***********************
	beego.Router("/handlePowerLog", &keFu_operation.WorkerOpeController{}, "*:HandPowerLog")
	beego.Router("/canclePowerLog", &keFu_operation.WorkerOpeController{}, "*:CanclePowerLog")

	//查封ID
	beego.Router("/toForbidIdPage", &keFu_operation.WorkerOpeController{}, "*:ToForbidIdPage")
	//***********************处理页面发送过来的的那个处理权限状态的请求***********************
	beego.Router("/HandAccountLog", &keFu_operation.WorkerOpeController{}, "*:HandAccountLog")
	beego.Router("/CancleForbidAccountLog", &keFu_operation.WorkerOpeController{}, "*:CancleForbidAccountLog")

	//查封ID--获取查封列表
	beego.Router("/toForbidList", &keFu_operation.WorkerOpeController{}, "*:ToAccountInfoList")

	//查封ID--查看玩家信息
	beego.Router("/toForbidByName", &keFu_operation.WorkerOpeController{}, "*:FindAccountInfoByName")

	//客服操作
	beego.Router("/toOperatePage", &keFu_operation.WorkerOpeController{}, "*:ToOperatePage")

	//获取客服操作数据
	beego.Router("/getOperateData", &keFu_operation.WorkerOpeController{}, "*:GetOperateData")
}
