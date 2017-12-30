package pay_incomes

import (
	"encoding/json"
	"fmt"

	"aaDeZhou/models/pay_incomes"
	"aaDeZhou/models/utils"
)

//获取统计的数据
func (this *PayHabitController) Post() {
	beginTimeStr := this.GetString("beginTime") //开始时间
	endTimeStr := this.GetString("endTime")     //开始时间
	radioValue := this.GetString("radioValue")  //数字 日:0周:1月:2
	fmt.Println(beginTimeStr, "======", endTimeStr, "===============", radioValue)
	data := make([]pay_incomes.PayHabit, 0)

	if radioValue == "0" { //查询日--完整数据

		dayHabit := pay_incomes.FindPayHabit(beginTimeStr, endTimeStr)
		data = append(data, dayHabit)

	}

	if radioValue == "1" { //查询周--完整数据
		weekHabit := pay_incomes.FindPayHabit(beginTimeStr, endTimeStr)
		data = append(data, weekHabit)
	}
	/*
		月份求不完整数据:(包含当月的数据)
		beginMonth 到endMonth-1   都是完整数据
		endMonth的数据就是查看到前一天的  ===============================数据来源
	*/

	if radioValue == "2" { //月是不完整的数据
		//对获取的数据进行加工,拼凑出标准的格式
		dateBegin := fmt.Sprint(beginTimeStr, "-01")
		dateArr, _ := utils.Month_between_days(beginTimeStr, endTimeStr)
		days := dateArr[endTimeStr]
		dateEnd := fmt.Sprint(endTimeStr, "-", days)

		weekHabit := pay_incomes.FindPayHabit(dateBegin, dateEnd)
		data = append(data, weekHabit)
	}

	arr, _ := json.Marshal(data)

	this.Data["data"] = string(arr)

	this.Ctx.WriteString(string(arr))
	this.TplName = "pay_incomes/pay_habit.html"
}

//需要专门写一个获取所占份额的函数
func getBiLi(num, sum int) string {
	res := float64(num)
	tmp := float64(sum)
	result := fmt.Sprintf("%.f", (res/tmp)*100)
	return result
}
