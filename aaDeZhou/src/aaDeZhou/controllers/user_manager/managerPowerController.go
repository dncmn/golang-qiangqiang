package user_manager

import (
	"aaDeZhou/models/user_manager"
	"encoding/json"
	"log"

	"github.com/astaxie/beego"
)

type PowerManagerController struct {
	beego.Controller
}

//管理用户的界面
func (this *PowerManagerController) ToPowerPage() {
	this.TplName = "user_manager/power_manager.html"
}

//进行更改用户权限操作
func (this *PowerManagerController) ToModifyUserPower() {
	userName := this.GetString("userName")
	actionIds := this.GetString("actionIds")
	log.Println("actionIds==============================", actionIds, "userName========", userName)

	actionIds = user_manager.ShowNewMenuIds(actionIds)

	if isModify, msg := user_manager.ModifyPowerByUserName(userName, actionIds); !isModify {

		//更改权限失败
		loginInfo := Result{State: 1, Message: msg}
		arr, _ := json.Marshal(loginInfo)
		log.Println(msg)
		log.Println(string(arr))
		this.Ctx.WriteString(string(arr))
		return

	}
	loginInfo := Result{State: 0, Message: "更改用户权限成功"}
	arr, _ := json.Marshal(loginInfo)
	log.Println("更改用户权限成功了=============================成功了")
	log.Println(string(arr))
	this.Ctx.WriteString(string(arr))
	return
}

//获取权限列表
func (this *PowerManagerController) ToPowerList() {

	actions := user_manager.ShowAllUserPower()
	loginInfo := Result{State: 0, Message: "获取信息成功", Data: actions}
	arr, _ := json.Marshal(loginInfo)
	log.Println("获取权限列表了.....................获取权限列表了")
	log.Println(string(arr))
	this.Ctx.WriteString(string(arr))
	return
}

//获取所有的用户名
func (this *PowerManagerController) ToShowUserName() {
	data := user_manager.ShowAllUser()         //UserInfo
	actions := user_manager.ShowAllUserPower() //actionInfo
	loginInfo := Result{State: 0, Message: "获取信息成功", UserData: data, Data: actions}
	arr, _ := json.Marshal(loginInfo)
	log.Println("获取所有的用户名==========================获取所有的用户权限")
	log.Println(string(arr))
	this.Ctx.WriteString(string(arr))
	return
}
