package keFu_operation

import "github.com/astaxie/beego"

//保存客服操作中所有的结构体信息

//保存玩家的充值结构体信息
type UserPayIncoInfo struct {
	UserNickName string //玩家昵称
	UserId       string //玩家id
	PayTime      string //玩家充值时间
	PayCount     int    //玩家充值金额
	PayMethod    string //玩家充值渠道
}

//玩家查询的页面
type WorkerOpeController struct {
	beego.Controller
}

//指向玩家查询的结构体
func (this *WorkerOpeController) ToFindUserPage() {
	this.TplName = "kf_operation/findUser.html"
}

//指向系统消息子菜单的页面
func (this *WorkerOpeController) ToSystemInfoPage() {
	this.TplName = "kf_operation/systemInfo.html"
}

//指向客服操作子菜单的页面
func (this *WorkerOpeController) ToOperatePage() {
	this.TplName = "kf_operation/worker.html"
}

//指向授予权限子菜单
func (this *WorkerOpeController) ToGrantPower() {

	this.TplName = "kf_operation/grantPower.html"
}

//指向查封id的才菜单
func (this *WorkerOpeController) ToForbidIdPage() {
	this.TplName = "kf_operation/forbidId.html"
}
