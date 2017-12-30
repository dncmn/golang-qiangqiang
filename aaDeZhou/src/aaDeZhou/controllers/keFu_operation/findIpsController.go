package keFu_operation

import (
	"aaDeZhou/models/keFu_operation"
	"encoding/json"
	"fmt"
	//	"math/rand"
	//	"time"
)

func (this *WorkerOpeController) ToFindIpPage() {
	this.TplName = "kf_operation/findIp.html"
}

type AllIp struct {
	Ip        string //ip地址
	GameCount int    //对应的玩游戏的数量
}

type SingleIp struct {
	UserNickName string //玩家昵称
	UserId       string //玩家id
	GameCount    int    //玩家比赛盘数
	MoneyCount   int    //金币数量
}

//同IP登录
func (this *WorkerOpeController) AllIpLogin() {
	selectTime := this.GetString("selectTime")
	data := make([]keFu_operation.UserIp, 0)
	fmt.Println("selectTime========", selectTime)

	data = keFu_operation.ShowSameIps(selectTime)

	//	sysDay := time.Now().Format("2006-01-02") //获取系统当前时间
	//	if selectTime == sysDay {                 //向服务器发送请求

	//	} else { //查询本地的数据库

	//	}

	arr, _ := json.Marshal(data)
	fmt.Println(string(arr))
	this.Data["data"] = string(arr)
	this.Ctx.WriteString(string(arr))
	this.TplName = "kf_operation/findIp.html"

}

//查询IP信息

func (this *WorkerOpeController) SingleIpLogin() {
	selectTime := this.GetString("selectTime")
	selectIp := this.GetString("selectName")
	data := make([]keFu_operation.UserIp, 0)
	fmt.Println("selectTime========", selectTime, "===============", selectIp)

	data = keFu_operation.ShowUserByIp(selectTime, selectIp)
	//	sysDay := time.Now().Format("2006-01-02") //获取系统当前时间
	//	if selectTime == sysDay {                 //向服务器发送请求

	//	} else {

	//	}

	arr, _ := json.Marshal(data)
	fmt.Println(string(arr))
	this.Data["data"] = string(arr)
	this.Ctx.WriteString(string(arr))
	this.TplName = "kf_operation/findIp.html"

}
