package user_analysis

import (
	"aaDeZhou/models/utils"
	"encoding/json"
	"fmt"

	"log"

	"aaDeZhou/models/user_analysis"
)

/* 显示某一个省份的流失信息 */

func (this *UserLossController) ToShowSingleInfo() {
	//1、获取界面的日期
	beginTimeStr := this.GetString("beginTime")
	endTimeStr := this.GetString("endTime")
	radioValue := this.GetString("radioValue")
	selectOption := this.GetString("selectOption") //获取选择的城市
	log.Println(beginTimeStr, "   ", endTimeStr, "   ", radioValue, "    ", selectOption)
	data := make([]user_analysis.LossAccountInfo, 0)

	if radioValue == "1" {
		monthMap, _ := utils.Month_between_days(beginTimeStr, endTimeStr)

		fmt.Println("weekCount==================", monthMap)

		for i := 0; i < len(monthMap); i++ {
			fmt.Println("beginTimeStr===============", beginTimeStr)
			monthLoss := user_analysis.FindMonthLossUserInfo(beginTimeStr, selectOption)

			for i := 0; i < len(monthLoss); i++ {

				data = append(data, monthLoss[i])
			}

			beginTimeStr = utils.MonthOperate(beginTimeStr, 1)
		}

		fmt.Println("data=", data)

	} else {

		/*
			表示查询的是周流失
			如果查询当月的话，那么就是不完整的，如果是这个月过完的话，那么就是可以看到完整的数据
			显示周流失的账户信息
		*/
		//1、获取要求的周数

		weekCount := (utils.GetDateCount(beginTimeStr, endTimeStr) + 1) / 7

		fmt.Println("weekCount==================", weekCount)
		var i int64
		for i = 0; i < weekCount; i++ {

			weekLoss := user_analysis.FindWeekLossUserInfo(beginTimeStr, selectOption)

			for i := 0; i < len(weekLoss); i++ {

				data = append(data, weekLoss[i])

			}

			beginTimeStr, _ = utils.DateAddAndSub(beginTimeStr, 7)
		}

		fmt.Println("data=", data)

	}
	arr, _ := json.Marshal(data)
	this.Data["data"] = string(arr)
	this.Data["endTime"] = endTimeStr
	this.Ctx.WriteString(string(arr))
	this.TplName = "user_analysis/user_loss.html"

}

//显示：流失省份的地域分布信息
func (this *UserLossController) ToLossMemberInfo() {
	//1、获取界面的日期
	beginTimeStr := this.GetString("beginTime") //结束时间
	endTimeStr := this.GetString("endTime")     //开始时间
	radioValue := this.GetString("radioValue")  //选择周还是月

	data := make([]user_analysis.LossProc, 0)
	demo := make(map[string]int, 0) //用来将每次查到的周流失数据转化到map中,方便累加

	//2、根据单选按钮调用不同的显示方法

	if radioValue == "1" { //月流失信息

		monthMap, _ := utils.Month_between_days(beginTimeStr, endTimeStr)

		fmt.Println("weekCount==================", monthMap)

		for i := 0; i < len(monthMap); i++ {
			fmt.Println("beginTimeStr===============", beginTimeStr)
			monthLoss := user_analysis.FindMonthLossProvs(beginTimeStr)

			for i := 0; i < len(monthLoss); i++ {
				t := monthLoss[i]
				v, ok := demo[t.Proc]
				if !ok {
					demo[t.Proc] = t.Count
				} else {
					demo[t.Proc] = t.Count + v
				}

			}

			beginTimeStr = utils.MonthOperate(beginTimeStr, 1)
		}

		for k, v := range demo {
			data = append(data, user_analysis.LossProc{Proc: k, Count: v})
		}
		fmt.Println("data=", data)

		/*
						表示查询的是月流失
						如果查询当月的话，那么就是不完整的，如果是这个月过完的话，那么就是可以看到完整的数据
						显示月流失的的账户信息
						type LossAccountInfo struct {
				Date        string
				Account     string
				Uid         string
				PhoneNumber string
			}
		*/
		//封装数组,把数组添加到结构体

	} else {

		//1、获取要求的周数

		weekCount := (utils.GetDateCount(beginTimeStr, endTimeStr) + 1) / 7

		fmt.Println("weekCount==================", weekCount)
		var i int64
		for i = 0; i < weekCount; i++ {
			fmt.Println("beginTimeStr===============", beginTimeStr)
			weekLoss := user_analysis.FindWeekLossProvs(beginTimeStr)

			for i := 0; i < len(weekLoss); i++ {
				t := weekLoss[i]
				v, ok := demo[t.Proc]
				if !ok {
					demo[t.Proc] = t.Count
				} else {
					demo[t.Proc] = t.Count + v
				}

			}

			beginTimeStr, _ = utils.DateAddAndSub(beginTimeStr, 7)
		}

		for k, v := range demo {
			data = append(data, user_analysis.LossProc{Proc: k, Count: v})
		}
		fmt.Println("data=", data)
		/*
			表示查询的是周流失
			如果查询当月的话，那么就是不完整的，如果是这个月过完的话，那么就是可以看到完整的数据
			显示周流失的账户信息
		*/

	}
	arr, _ := json.Marshal(data)

	this.Data["data"] = string(arr)

	this.Data["endTime"] = endTimeStr

	this.Ctx.WriteString(string(arr))
	this.TplName = "user_analysis/user_loss.html"
}

//显示：流失率
func (this *UserLossController) ToLossRate() {
	//1、获取界面的日期
	beginTimeStr := this.GetString("beginTime")
	endTimeStr := this.GetString("endTime")
	radioValue := this.GetString("radioValue")
	fmt.Println(beginTimeStr, "=================", endTimeStr, "===============", radioValue)
	data := make([]user_analysis.UserData, 0)

	//2、根据单选按钮调用不同的显示方法

	if radioValue == "0" { //表示的是周流失
		//计算要求的周数
		weekCount := (utils.GetDateCount(beginTimeStr, endTimeStr) + 1) / 7

		fmt.Println("weekCount==================", weekCount)
		var i int64
		for i = 0; i < weekCount; i++ {
			fmt.Println("beginTimeStr===============", beginTimeStr)
			weekLoss := user_analysis.FindWeekLoss(beginTimeStr)
			data = append(data, weekLoss)
			beginTimeStr, _ = utils.DateAddAndSub(beginTimeStr, 7)
		}
	} else { //查询的是月流失
		/*
			判断月流失数据是否完整，就是看endTimeStr是否是查询所在月的上一个月
		*/
		//获取月份的差值
		monthCount, _ := utils.Month_between_days(beginTimeStr, endTimeStr)

		for i := 0; i < len(monthCount); i++ {
			lossUser := user_analysis.ShowMonthLoss(beginTimeStr)
			data = append(data, lossUser)
			beginTimeStr = utils.MonthOperate(beginTimeStr, 1)
		}

	}
	arr, _ := json.Marshal(data)
	this.Data["data"] = string(arr)
	this.Data["endTime"] = endTimeStr
	this.Ctx.WriteString(string(arr))
	this.TplName = "user_analysis/user_loss.html"
}
