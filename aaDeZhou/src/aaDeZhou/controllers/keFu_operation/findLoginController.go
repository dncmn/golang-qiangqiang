package keFu_operation

import (
	"aaDeZhou/models/keFu_operation"
	"encoding/json"

	"log"
)

type UserLoginInfo struct {
	UserNickName string //玩家昵称
	UserId       string //玩家id
	LoginTime    string //进入游戏时间
	LogoutTime   string //离开游戏时间
}

func (this *WorkerOpeController) ToFindLoginPage() {
	this.TplName = "kf_operation/findLogin.html"
}

func (this *WorkerOpeController) ToGetUserLoginData() {
	selectName := this.GetString("selectName")
	selectTime := this.GetString("selectTime")
	data := make([]keFu_operation.UserInfo, 0)

	//调用sql查询用户
	//模拟数据
	data = keFu_operation.ShowUserLogin(selectName, selectTime)

	arr, _ := json.Marshal(data)
	log.Println(string(arr))
	this.Data["data"] = string(arr)
	this.Ctx.WriteString(string(arr))
	this.TplName = "kf_operation/findLogin.html"

}
