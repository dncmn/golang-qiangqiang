package pay_incomes

//付费收入
import (
	"aaDeZhou/models/utils"

	//	"github.com/astaxie/beego"
	"fmt"
	"log"
	//	"time"
)

//月:获取月总的付费用户金额
func FindMonthTotalIncome(beginDate string) []PayIncome {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var res []Recharge
	dateBegin := fmt.Sprint(beginDate, "-01")
	daysArr, _ := utils.Month_between_days(beginDate, "")
	monthDays := daysArr[beginDate]
	dateEnd := fmt.Sprint(beginDate, "-", monthDays)
	log.Println("dateBegin=", dateBegin, "     dateEnd=", dateEnd, "   monthDays=", monthDays)
	queryStr := "SELECT FROM_UNIXTIME(TIME,'%Y-%m') AS 'date',trench,SUM(money) AS 'money' FROM user_recharge WHERE DATE(FROM_UNIXTIME(TIME))>=?" +
		" AND DATE(FROM_UNIXTIME(TIME))<=? GROUP BY trench ORDER BY trench;"

	db.Raw(queryStr, dateBegin, dateEnd).Scan(&res)
	if len(res) == 0 {
		return []PayIncome{}
	}

	return translatePayIncome(res)

}

//获取周付费用户:
func FindWeekPayIncome(beginDate string) []PayIncome {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	endDate, _ := utils.DateAddAndSub(beginDate, 6)

	var res []Recharge
	queryStr := "SELECT FROM_UNIXTIME(TIME,'%Y-%m-%d') AS 'date',trench,SUM(money) AS 'money' " +
		" FROM user_recharge WHERE FROM_UNIXTIME(TIME,'%Y-%m-%d')>=? " +
		" AND FROM_UNIXTIME(TIME,'%Y-%m-%d')<=?" +
		" GROUP BY FROM_UNIXTIME(TIME,'%Y-%m-%d'),trench ORDER BY FROM_UNIXTIME(TIME,'%Y-%m-%d');"
	db.Raw(queryStr, beginDate, endDate).Scan(&res)

	return translatePayIncome(res)
}

//查询日付费收入:monthDate形如2017-01
func FindPayIncome(monthDate string) []PayIncome {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	var res []Recharge
	queryStr := "SELECT FROM_UNIXTIME(TIME,'%Y-%m-%d') AS 'date',trench,SUM(money) AS 'money' " +
		" FROM user_recharge WHERE FROM_UNIXTIME(TIME,'%Y-%m')=? " +
		" GROUP BY FROM_UNIXTIME(TIME,'%Y-%m-%d'),trench ORDER BY FROM_UNIXTIME(TIME,'%Y-%m-%d');"
	db.Raw(queryStr, monthDate).Scan(&res)

	return translatePayIncome(res)
}

func translatePayIncome(arr []Recharge) []PayIncome {
	//读取配置文件的信息
	//	tag0 := beego.AppConfig.String("0")
	//	tag1 := beego.AppConfig.String("1")
	//	log.Println("tag0====================", tag0, "   tag1===============", tag1)
	data := make(map[string]PayIncome, 0)

	for i := 0; i < len(arr); i++ {
		t := arr[i]

		v, ok := data[t.Date]

		if !ok { //表示没有添加这条记录

			//还要判断这条记录的trench是0还是1

			if t.Trench == 0 {
				data[t.Date] = PayIncome{
					Date: t.Date,
					Anz:  t.Money,
				}

			} else {
				data[t.Date] = PayIncome{
					Date: t.Date,
					Ios:  t.Money,
				}

			}

		} else {
			//这条记录已经存在
			if t.Trench == 0 {
				v.Anz = t.Money

			} else {
				v.Ios = t.Money

			}
			data[t.Date] = v

		}

	}
	res := make([]PayIncome, 0) //声明一个数组,将map值添加到数组中
	for _, value := range data {

		res = append(res, value)
	}

	//就数组进行排序
	for i := 0; i < len(res); i++ {
		for j := 0; j < len(res)-i-1; j++ {
			if res[j].Date > res[j+1].Date {
				res[j], res[j+1] = res[j+1], res[j]
			}

		}

	}
	log.Println("translatePayIncome:", res)
	return res
}
