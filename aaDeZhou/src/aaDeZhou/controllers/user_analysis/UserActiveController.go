package user_analysis

import (
	"encoding/json"
	"log"

	"aaDeZhou/models/user_analysis"
	"aaDeZhou/models/utils"

	"fmt"
)

//新增用户
/*
	获取的是数量：某一天，某个月新增的数量，如果是时间段，就这这个时间段内的，每一天或者每个月的数量
	如何判断数据是否完整：
		日:判断结束日期是否为系统当年前日期
		月:判断结束日期是否为系统当前所在的月份
*/
func (this *UserActiveController) ToNewAddUser() {
	//1、获取界面的日期
	beginTimeStr := this.GetString("beginTime")
	endTimeStr := this.GetString("endTime")
	dataTag := this.GetString("tagValue")
	log.Println(beginTimeStr, "=================", endTimeStr, "===============", dataTag)
	data := make([]user_analysis.UserData, 0)

	//2、根据单选按钮调用不同的显示方法

	if dataTag == "1" { //单选按钮选的的是“月”

		mapData, _ := utils.Month_between_days(beginTimeStr, endTimeStr)
		for i := 0; i < len(mapData); i++ {
			user := user_analysis.ShowMonthNewLogin(beginTimeStr)
			data = append(data, user)
			beginTimeStr = utils.MonthOperate(beginTimeStr, 1)
		}

	} else { //单选按钮选的的是“日”
		//这里是模拟数据----到时候可以直接替换掉
		data = make([]user_analysis.UserData, 0)

		//1、获取两天日期的差值
		dayCount := utils.GetDateCount(beginTimeStr, endTimeStr)
		fmt.Println("dayCount=======================", dayCount)
		var i int64
		for i = 0; i <= dayCount; i++ {
			user := user_analysis.ShowDayNewLogin(beginTimeStr)
			data = append(data, user)
			beginTimeStr, _ = utils.DateAddAndSub(beginTimeStr, 1)
		}

	}

	if len(data) == 0 {
		data = append(data, user_analysis.UserData{Date: "0", Count: "0"})
	}
	arr, _ := json.Marshal(data)
	fmt.Println("string(arr)=========================", string(arr))
	this.Data["data"] = string(arr)

	this.Data["endTime"] = endTimeStr

	this.Ctx.WriteString(string(arr))
	this.TplName = "user_analysis/user_newRegister.html"

}

//活跃用户--都是完整数据
/**/
func (this *UserActiveController) ToActiveUser() {
	//1、获取界面的日期
	beginTimeStr := this.GetString("beginTime")
	endTimeStr := this.GetString("endTime")
	dataTag := this.GetString("tagValue")
	fmt.Println(beginTimeStr, "=================", endTimeStr, "===============", dataTag)
	data := make([]user_analysis.UserData, 0)

	//2、根据单选按钮调用不同的显示方法

	if dataTag == "1" { //单选选择月
		//1、获取连个月的差值
		monthCount, _ := utils.Month_between_days(beginTimeStr, endTimeStr)
		fmt.Println("dayCount================", monthCount)

		for i := 0; i < len(monthCount); i++ {
			user := user_analysis.ShowMonthActiveUser(beginTimeStr, monthCount[beginTimeStr])
			data = append(data, user)
			beginTimeStr = utils.MonthOperate(beginTimeStr, 1)
		}
	} else { //单选按钮选择“日”

		//1、获取两天日期的差值
		dayCount := utils.GetDateCount(beginTimeStr, endTimeStr)
		fmt.Println("dayCount================", dayCount)
		var i int64
		for i = 0; i <= dayCount; i++ {
			user := user_analysis.ShowDayActiveUser(beginTimeStr)
			data = append(data, user)
			beginTimeStr, _ = utils.DateAddAndSub(beginTimeStr, 1)
		}

	}
	arr, _ := json.Marshal(data)
	this.Data["data"] = string(arr)
	this.Data["endTime"] = endTimeStr
	this.Ctx.WriteString(string(arr))
	this.TplName = "user_analysis/user_newRegister.html"
}

//历史用户
func (this *UserActiveController) ToHistoryUser() {
	//1、获取界面的日期
	beginTimeStr := this.GetString("beginTime")
	endTimeStr := this.GetString("endTime")
	dataTag := this.GetString("tagValue")
	fmt.Println(beginTimeStr, "=================", endTimeStr, "===============", dataTag)
	data := make([]user_analysis.UserData, 0)

	//2、根据单选按钮调用不同的显示方法

	if dataTag == "0" { //单选选择日

		dayCount := utils.GetDateCount(beginTimeStr, endTimeStr)
		fmt.Println("dayCount================", dayCount)
		var i int64
		for i = 0; i <= dayCount; i++ {
			user := user_analysis.ShowHistoryUser(beginTimeStr)
			data = append(data, user)
			beginTimeStr, _ = utils.DateAddAndSub(beginTimeStr, 1)
		}

	} else { //查询月

		monthDays, _ := utils.Month_between_days(beginTimeStr, endTimeStr)
		fmt.Println("monthDays===========================", monthDays)
		for i := 0; i < len(monthDays); i++ {
			//获取这个月的最后一天
			user := user_analysis.ShowMonthHistoryUser(beginTimeStr)
			data = append(data, user)
			beginTimeStr = utils.MonthOperate(beginTimeStr, 1)
		}

	}
	arr, _ := json.Marshal(data)
	fmt.Println("string(arr)=========================", string(arr))
	this.Data["data"] = string(arr)

	this.Data["endTime"] = endTimeStr

	this.Ctx.WriteString(string(arr))
	this.TplName = "user_analysis/user_newRegister.html"
}
