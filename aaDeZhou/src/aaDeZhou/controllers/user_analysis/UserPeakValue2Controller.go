package user_analysis

import (
	"aaDeZhou/models/utils"
	"encoding/json"
	"fmt"
	"log"

	"aaDeZhou/models/user_analysis"
)

//日均在线时长
/*
	radioValue: 日  beginTime:2017-07-01
	radioValue: 周  beginTime:这周一
	radioValue: 月  beginTime:2017-06
	显示的是完整的数据

*/
func (this *UserPeakValueController) ToDayAvgOnlineTime() {
	beginTimeStr := this.GetString("beginTime")
	radioValue := this.GetString("radioValue")
	fmt.Println(beginTimeStr, "=================", radioValue)
	data := make([]user_analysis.UserData, 0)

	if radioValue == "0" { //日均在线
		user := user_analysis.ShowDayAvgTime(beginTimeStr)
		data = append(data, user)
	}

	if radioValue == "1" { //周,每一天的在线用户数
		//日均在线时长,连续六天
		for i := 0; i < 7; i++ {
			user := user_analysis.ShowDayAvgTime(beginTimeStr)
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

		fmt.Println("mapData[beginTimeStr]========================", mapData[beginTimeStr])

		//找到这个月的一号
		beginMonth := fmt.Sprint(beginTimeStr, "-01")
		fmt.Println("beginMonth==================================", beginMonth)
		for i := 0; i < mapData[beginTimeStr]; i++ {
			user := user_analysis.ShowDayAvgTime(beginMonth)
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

//单次使用时长分布
/*
1-10、11-30s、31-60s
1-3m、3-10m、10-30m、30+

*/

func (this *UserPeakValueController) ToSingleOnlineTime() {
	beginTimeStr := this.GetString("beginTime")
	fmt.Println("beginTimeSt================", beginTimeStr)
	data := make([]user_analysis.SingleTime, 0)

	user := user_analysis.ShowSingleLoginTime(beginTimeStr)
	data = append(data, user)

	arr, _ := json.Marshal(data)
	fmt.Println("string(arr)=========================", string(arr))
	this.Data["data"] = string(arr)

	this.Ctx.WriteString(string(arr))
	this.TplName = "user_analysis/user_PeakValue.html"

}
