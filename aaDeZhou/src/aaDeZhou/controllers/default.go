package controllers

import (
	"aaDeZhou/models/user_manager"
	"encoding/json"

	"github.com/astaxie/beego"
)

type MainController struct {
	beego.Controller
}

//后台管理的首页
func (this *MainController) Get() {

	this.TplName = "newFace.html"
}

//后台管理的首页--右半部分
func (this *MainController) ToContent() {
	this.TplName = "info.html"
}

func (this *MainController) ToActionList() {
	//登录成功以后获取所有的action列表
	actions := user_manager.ShowAllActions()
	loginInfo := ErrorLogin{State: 0, Message: "登录成功", ActionList: actions}
	arr, _ := json.Marshal(loginInfo)
	this.Ctx.WriteString(string(arr))
}
