package pay_incomes

import (
	"aaDeZhou/models/pay_incomes"
	"aaDeZhou/models/utils"
	"encoding/json"
	"fmt"
)

/*

	要获取对应的当日总收入
	充值用户的数量
*/

//获取数据
func (this *PayArpuController) Post() {
	beginTimeStr := this.GetString("beginTime") //开始时间
	endTimeStr := this.GetString("endTime")     //开始时间
	radioValue := this.GetString("radioValue")  //数字 日:0周:1月:2
	fmt.Println(beginTimeStr, "======", endTimeStr, "===============", radioValue)
	data := make([]pay_incomes.PayArpu, 0)

	if radioValue == "0" || radioValue == "1" { //日ARPU值
		//		pay_incomes.FindTotalWeekArpu(beginTimeStr)
		dayCount := utils.GetDateCount(beginTimeStr, endTimeStr)
		var i int64
		for i = 0; i <= dayCount; i++ {
			arpu := pay_incomes.FindDayArpu(beginTimeStr)
			data = append(data, arpu)
			beginTimeStr, _ = utils.DateAddAndSub(beginTimeStr, 1)
		}
	}

	//获取这个月有多少天
	if radioValue == "2" { //月ARPU值--当月收入/当月的付费用户数--完整数据
		pay_incomes.FindTotalMonthArpu(beginTimeStr)
		monthCount, _ := utils.Month_between_days(beginTimeStr, endTimeStr)

		for i := 0; i < len(monthCount); i++ { //外循环获取月份
			fmt.Println("len(monthCount)=================", len(monthCount))
			beginTime := fmt.Sprint(beginTimeStr, "-01")
			for j := 0; j < monthCount[beginTimeStr]; j++ { //找到这个月每一天的arpu
				fmt.Println("beginTime======================================", beginTime)
				arpu := pay_incomes.FindDayArpu(beginTime)
				data = append(data, arpu)
				beginTime, _ = utils.DateAddAndSub(beginTime, 1)
			}
			beginTimeStr = utils.MonthOperate(beginTimeStr, 1)

		}
	}

	arr, _ := json.Marshal(data)

	this.Data["data"] = string(arr)

	this.Ctx.WriteString(string(arr))
	this.TplName = "pay_incomes/pay_arpu.html"
}
