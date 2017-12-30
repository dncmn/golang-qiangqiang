package keFu_operation

import (
	"encoding/json"
	"fmt"
	"time"
)

func (this *WorkerOpeController) ToFindCountInfoPage() {
	this.TplName = "kf_operation/findCountInfo.html"
}

type CountInfo struct {
	UserNickName string //玩家昵称
	UserId       string //玩家ID
	TimeChange   string //玩家金币变化的时间
	MoneyChange  int    //金额变化
	CurrMoney    int    //当前金币数量
	MoneySource  string //金币来源
}

func (this *WorkerOpeController) GetCountInfo() {
	selectName := this.GetString("selectName")
	selectTime := this.GetString("selectTime")
	data := make([]CountInfo, 0)

	sysDay := time.Now().Format("2006-01-02")
	if sysDay == selectTime { //查询的是实时数据

	} else { //查询的是历史数据

	}
	fmt.Println("selectName======", selectName, "  selectTime=======", selectTime)
	data = append(data, CountInfo{UserNickName: "tom", UserId: "201305220214",
		TimeChange: "2013-07-08 15:00", MoneyChange: 5000,
		CurrMoney: 8000, MoneySource: "MTT"})
	data = append(data, CountInfo{UserNickName: "tom", UserId: "201305220214",
		TimeChange: "2013-07-08 14:00", MoneyChange: 5000,
		CurrMoney: 8000, MoneySource: "MTT"})
	data = append(data, CountInfo{UserNickName: "tom", UserId: "201305220214",
		TimeChange: "2013-07-08 16:00", MoneyChange: 5000,
		CurrMoney: 8000, MoneySource: "MTT"})

	arr, _ := json.Marshal(data)
	fmt.Println(string(arr))
	this.Data["data"] = string(arr)
	this.Ctx.WriteString(string(arr))
	this.TplName = "kf_operation/findCountInfo.html"
}
