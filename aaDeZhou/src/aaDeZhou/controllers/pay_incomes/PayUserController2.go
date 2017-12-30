package pay_incomes

import (
	"encoding/json"
	"fmt"

	"aaDeZhou/models/pay_incomes"
	"aaDeZhou/models/utils"

	"time"
)

/*
	如何判断查询的是否是非完整的数据
		日:判断月份是不是查询时的月份,是就表示数据不完整
		周:判断beginWeekIndex是否和查询时刻的周数相同
		月：判断月份是不是查询时的月份,是就表示数据不完整
	页面传递过来了beginTime和radioValue
	radioValue:
		0:日
		1:周 当选择周时,还会传递过来周的索引
		2:月
*/
//付费率
func (this *PayUserController) ToPayRate() {
	beginTimeStr := this.GetString("beginTime") //获取查询时间
	radioValue := this.GetString("radioValue")  //获取查询的按钮值
	fmt.Println(beginTimeStr, "================", radioValue)
	data := make([]pay_incomes.PayRate, 0)

	if radioValue == "0" || radioValue == "2" { //查询的是这个月每一天的数据,不完整数据是截止到查询的前一个小时
		//查询数据,在程序后面判断获取的数据是否是完整数据，如果没有后面的判断，获取的数据都是完整数据
		data = pay_incomes.UserPayRate(beginTimeStr)

	}

	if radioValue == "1" { //查询的是周数据
		data = pay_incomes.UserWeekPayRate(beginTimeStr)

	}

	arr, _ := json.Marshal(data)

	this.Data["data"] = string(arr)

	this.Ctx.WriteString(string(arr))
	this.TplName = "pay_incomes/pay_user.html"
}

/*
	查询日/月数据:
		完整数据:如果查询时间也就是beginTimeStr和系统当前的月份相同
	查询周数据:
		完整数据:周索引和当前日期的周索引是否相同


*/
//新增付费用户
func (this *PayUserController) ToNewPayUser() {
	beginTimeStr := this.GetString("beginTime") //获取查询时间
	radioValue := this.GetString("radioValue")  //获取查询的按钮值--判断查询日周月的数据
	fmt.Println(beginTimeStr, "================", radioValue)
	data := make([]pay_incomes.NewPayUser, 0)

	if radioValue == "0" { //查询日数据

		dateBegin := fmt.Sprint(beginTimeStr, "-01") //形式如2017-09-01
		tmp, _ := utils.Month_between_days(beginTimeStr, "")
		monthDays := tmp[beginTimeStr]
		for i := 0; i < monthDays; i++ {
			singleData := pay_incomes.FindPayUserCount(dateBegin)
			data = append(data, singleData)
			dateBegin, _ = utils.DateAddAndSub(dateBegin, 1)
		}

	}

	if radioValue == "1" {
		sysDay := time.Now().Format("2006-01-02") //获取系统当前时间
		daysLater, _ := utils.DateAddAndSub(beginTimeStr, 6)
		var dateEnd string
		if sysDay > daysLater {
			dateEnd = daysLater //这一周不是当周的数据
		} else {
			dateEnd = sysDay //这一周是当周的数据
		}

		//获取循环的天数
		count := utils.GetDateCount(beginTimeStr, dateEnd)
		var i int64
		for i = 0; i < count; i++ {
			singleData := pay_incomes.FindPayUserCount(beginTimeStr)
			data = append(data, singleData)
			beginTimeStr, _ = utils.DateAddAndSub(beginTimeStr, 1)
		}
	}

	if radioValue == "2" {

		data = append(data, pay_incomes.NewPayUser{Date: beginTimeStr})

		//获取这个月每一天的数据
		dateBegin := fmt.Sprint(beginTimeStr, "-01") //形式如2017-09-01
		tmp, _ := utils.Month_between_days(beginTimeStr, "")
		monthDays := tmp[beginTimeStr]

		//记录总的付费用户数量
		var totalNewPay int = 0
		//记录总的新增用户数量
		var totalNewLogin int = 0
		for i := 0; i < monthDays; i++ {
			singleData := pay_incomes.FindPayUserCount(dateBegin)
			data = append(data, singleData)

			totalNewLogin = totalNewLogin + singleData.NewLogin
			totalNewPay = totalNewPay + singleData.PayUser
			dateBegin, _ = utils.DateAddAndSub(dateBegin, 1)
		}
		data[0].NewLogin = totalNewLogin
		data[0].PayUser = totalNewPay

	}

	arr, _ := json.Marshal(data)
	fmt.Println("string(arr)=========================", string(arr))
	this.Data["data"] = string(arr)

	this.Ctx.WriteString(string(arr))
	this.TplName = "pay_incomes/pay_user.html"
}
