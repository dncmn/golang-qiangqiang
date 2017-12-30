package user_analysis

import (
	"aaDeZhou/models/utils"
	"encoding/json"
	"fmt"
	"log"

	"aaDeZhou/models/user_analysis"
)

//日均在线用用户数
/*
	radioValue: 日  beginTime:2017-07-01
	radioValue: 周  beginTime:周索引
	radioValue: 月  beginTime:2017-06
	显示的是完整的数据

*/
func (this *UserPeakValueController) ToDayAvgUserCount() {
	beginTimeStr := this.GetString("beginTime")
	radioValue := this.GetString("radioValue")
	log.Println(beginTimeStr, "=================", radioValue)
	data := make([]user_analysis.UserData, 0)

	//首先对选择的日期进行判断

	if radioValue == "0" { //日均在线时长
		user := user_analysis.ShowDayAvgUser(beginTimeStr)
		data = append(data, user)
	}

	if radioValue == "1" { //周,每一天的日均在线用户数
		//日均在线时长,连续六天
		for i := 0; i < 7; i++ {
			user := user_analysis.ShowDayAvgUser(beginTimeStr)
			data = append(data, user)
			beginTimeStr, _ = utils.DateAddAndSub(beginTimeStr, 1)
		}
	}

	if radioValue == "2" { //月,这个月每一天的日均在线用户数
		//获取这个月有多少天
		mapData, err := utils.Month_between_days(beginTimeStr, "")
		if err != nil {
			log.Println("日均在线用户数:获取当月天数失败")
			log.Println(err)
			this.TplName = "user_analysis/user_PeakValue.html"
		}

		//找到这个月的一号
		beginMonth := fmt.Sprint(beginTimeStr, "-01")
		fmt.Println("beginMonth==================================", beginMonth)
		for i := 0; i < mapData[beginTimeStr]; i++ {
			user := user_analysis.ShowDayAvgUser(beginMonth)
			data = append(data, user)
			beginMonth, _ = utils.DateAddAndSub(beginMonth, 1)
		}

	}

	arr, _ := json.Marshal(data)
	fmt.Println("string(arr)=========================", string(arr))
	this.Data["data"] = string(arr)

	this.Ctx.WriteString(string(arr))
	this.TplName = "user_analysis/user_PeakValue.html"

}

//在线峰值
func (this *UserPeakValueController) ToPeakValue() {
	beginTimeStr := this.GetString("beginTime")
	radioValue := this.GetString("radioValue")
	fmt.Println(beginTimeStr, "=================", radioValue)
	data := make([]user_analysis.UserData, 0)
	//2、根据单选按钮调用不同的显示方法
	/*
		如何判断数据是否完整:就是看查询的当天日期是当天数据
		完整数据:就是这一天,24个小时每个小时都要有的数据
		非完整数据:就是截止到查询时刻的前一个小时
	*/
	if radioValue == "0" { //查询某一天的峰值记录

		user := user_analysis.ShowDayFullPeakValue(beginTimeStr) //返回的是一个数组
		data = user

	} else { //查询某个月的峰值记录，就是这个月每一天的峰值

		user := user_analysis.ShowMonthFullPeakValue(beginTimeStr) //返回的是一个数组
		data = user

		//查看月
		/*
			如何判断数据是否完整:就是看查询的当天所在的月份,是否是系统所在的月份
			完整数据:就是完整的一个自然月的数据,比如六月份的31天,就是每一天统计的数据
			不完整是数据:就是截止到前一天,比如今天是2017-07-26,那么查询的数据就是查询2017-07-01到2017-07-25到的数据
		*/

	}

	arr, _ := json.Marshal(data)
	this.Data["data"] = string(arr)
	this.Ctx.WriteString(string(arr))
	this.TplName = "user_analysis/user_PeakValue.html"
}
