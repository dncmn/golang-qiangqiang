package user_analysis

import (
	"encoding/json"
	"fmt"
	"log"

	"aaDeZhou/models/user_analysis"
	"aaDeZhou/models/utils"
)

//查询次日留存

func (this *UserPreserveController) ToDayPreserveUser() {
	//1、获取界面的日期
	beginTimeStr := this.GetString("beginTime")
	endTimeStr := this.GetString("endTime")

	log.Println("beginTimeStr========", beginTimeStr, "======endTimeStr========", endTimeStr)

	data := make([]user_analysis.UserData, 0)

	var count = utils.GetDateCount(beginTimeStr, endTimeStr)

	var i int64
	for i = 0; i <= count; i++ {
		user := user_analysis.ShowDayPreserveUser(beginTimeStr)
		data = append(data, user)

		beginTimeStr, _ = utils.DateAddAndSub(beginTimeStr, 1)
	}

	if len(data) == 0 {
		data = append(data, user_analysis.UserData{Date: "0   -  to", Count: "0", Rate: "0"})
	}
	arr, _ := json.Marshal(data)
	fmt.Println("string(arr)=========================", string(arr))
	this.Data["data"] = string(arr)
	this.Data["beginTime"] = beginTimeStr
	this.Data["endTime"] = endTimeStr

	this.Ctx.WriteString(string(arr))
	this.TplName = "user_analysis/user_preserve.html"
}

//查询七日留存,查询的是完整的数据
func (this *UserPreserveController) ToWeekPreserveUser() {
	//1、获取界面的日期
	beginTimeStr := this.GetString("beginTime")
	endTimeStr := this.GetString("endTime")

	_, count := utils.GetWeekCount(beginTimeStr, endTimeStr)

	//这里是模拟数据----到时候可以直接替换掉
	data := make([]user_analysis.UserData, 0)

	for i := 0; i <= count; i++ {
		fmt.Println("i=============", i)
		user := user_analysis.ShowWeekPreserveUser(beginTimeStr, endTimeStr)
		data = append(data, user)
		beginTimeStr, _ = utils.DateAddAndSub(beginTimeStr, 7)
	}

	if len(data) == 0 {
		data = append(data, user_analysis.UserData{Date: "0   -  to", Count: "0", Rate: "0"})
	}

	arr, _ := json.Marshal(data)
	fmt.Println(string(arr))
	this.Data["data"] = string(arr)
	this.Data["beginTime"] = beginTimeStr
	this.Data["endTime"] = endTimeStr

	this.Ctx.WriteString(string(arr))
	this.TplName = "user_analysis/user_preserve.html"
}

//查看月留存
/*
	完整数据:结束月份小于当前月份
	不完整数据:结束月份等于当前月份:截止到查询的前一天，所以这时候就去查登录详情表
	不完整数据截止到查询的当天的前一天,
			查看登录日志local_server:查看登录详情表,查看哪儿些人是在
*/
func (this *UserPreserveController) ToMonthPreserveUser() {
	//1、获取界面的日期
	beginMonth := this.GetString("beginTime")
	endMonth := this.GetString("endTime")

	mapData, _ := utils.Month_between_days(beginMonth, endMonth)
	data := make([]user_analysis.UserData, 0)

	fmt.Println(beginMonth, "    ", endMonth)
	fmt.Println("mapData===================", mapData)
	fmt.Println("len(mapData)===============", len(mapData))

	for i := 0; i < len(mapData); i++ {
		user := user_analysis.ShowMonthFullPreserveUser(beginMonth)
		data = append(data, user)
		beginMonth = utils.MonthOperate(beginMonth, 1)
	}

	if len(data) == 0 {
		data = append(data, user_analysis.UserData{Date: "", Count: "0", Rate: "0"})
	}

	arr, _ := json.Marshal(data)
	this.Data["data"] = string(arr)
	this.Data["beginTime"] = beginMonth
	this.Data["endTime"] = endMonth

	this.Ctx.WriteString(string(arr))
	this.TplName = "user_analysis/user_preserve.html"
}
