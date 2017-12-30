package pay_incomes

import (
	"encoding/json"
	"fmt"

	"aaDeZhou/models/pay_incomes"
)

//付费用户
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
//type PayUser struct {
//	Date            string //日期
//	LoginUserCount  int    //登录用户数量
//	NewUserCount    int    //新增用户数量
//	PayUserCount    int    //付费用户数量
//	PayRate         string //付费率
//	NewPayUserCount int    //新增付费用户数量
//}

//付费用户
func (this *PayUserController) ToPayUser() {
	beginTimeStr := this.GetString("beginTime") //获取查询时间
	radioValue := this.GetString("radioValue")  //获取查询的按钮值
	fmt.Println(beginTimeStr, "================", radioValue)
	data := make([]pay_incomes.PayRate, 0)

	if radioValue == "0" { //查询日数据

		data = pay_incomes.UserPayRate(beginTimeStr)

	}
	if radioValue == "1" { //查询的是周数据,这里的数据一定是周一
		data = pay_incomes.UserWeekPayRate(beginTimeStr)

	}

	if radioValue == "2" { //查询月数据

		//第一部分是这个月的总和数据
		total := pay_incomes.TotalMonthPayRate(beginTimeStr)
		total.Date = beginTimeStr
		data = append(data, total)
		//第二部分是这个月的每一天的有记录的日期
		part := pay_incomes.UserPayRate(beginTimeStr)
		data = append(data, part[:]...)

	}

	arr, _ := json.Marshal(data)
	fmt.Println("string(arr)=========================", string(arr))
	this.Data["data"] = string(arr)

	this.Ctx.WriteString(string(arr))
	this.TplName = "pay_incomes/pay_user.html"
}

//付费收入
/*
	判断数据是否完整和付费用户是一样的
*/
func (this *PayUserController) ToPayIocome() {
	beginTimeStr := this.GetString("beginTime") //获取查询时间
	radioValue := this.GetString("radioValue")  //获取查询的按钮值
	fmt.Println(beginTimeStr, "================", radioValue)
	data := make([]pay_incomes.PayIncome, 0)
	//查询日数据
	/*
		我查询是从hour_status表中查询的，所以，查询每一天的也是可以查到，也就不用考虑数据是否完整了
	*/
	if radioValue == "0" {

		iocomes := pay_incomes.FindPayIncome(beginTimeStr)
		data = iocomes

	}
	if radioValue == "1" { //查询的是周数据,这里的数据一定是周一
		data = pay_incomes.FindWeekPayIncome(beginTimeStr)
	}
	if radioValue == "2" {
		part := pay_incomes.FindMonthTotalIncome(beginTimeStr)
		data = append(data, part[:]...)
		iocomes := pay_incomes.FindPayIncome(beginTimeStr)
		data = append(data, iocomes[:]...)
	}

	arr, _ := json.Marshal(data)

	this.Data["data"] = string(arr)

	this.Ctx.WriteString(string(arr))
	this.TplName = "pay_incomes/pay_user.html"
}
