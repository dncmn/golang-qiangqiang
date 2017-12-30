package pay_incomes

import (
	"aaDeZhou/models/utils"
	"fmt"
	"log"
)

//找出日付费用户金额
func FindDayArpu(beginDate string) PayArpu {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	var res PayArpu
	queryStr := "SELECT FROM_UNIXTIME(TIME,'%Y-%m-%d')AS 'date', ROUND(SUM(money)/COUNT(DISTINCT(user_id))) AS 'arpu'" +
		" FROM user_recharge WHERE DATE(FROM_UNIXTIME(TIME))=? " +
		" GROUP BY DATE(FROM_UNIXTIME(TIME));"
	db.Raw(queryStr, beginDate).Scan(&res)
	res.Date = beginDate
	log.Println("FindDayArpu=======================", res)
	return res

}

//找出某一周总的arpu值
//dateBegin:为要查询的周一,格式如:2017-08-01
func FindTotalWeekArpu(dateBegin string) PayArpu {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	dateEnd, _ := utils.DateAddAndSub(dateBegin, 6)

	var res PayArpu
	queryStr := "SELECT IFNULL((ROUND(SUM(money)/(COUNT(*)))),0) AS 'arpu' FROM user_recharge" +
		" WHERE DATE(FROM_UNIXTIME(TIME))>=? AND DATE(FROM_UNIXTIME(TIME))<=?;"

	db.Raw(queryStr, dateBegin, dateEnd).Scan(&res)
	res.Date = fmt.Sprint(dateBegin, " to ", dateEnd)
	log.Println("FindTotalWeekArpu=======================", res)
	return res
}

/*
查询某个月的arpu值
dateBegin:表示这个月的日期：形式如2017-01
*/
func FindTotalMonthArpu(monthDate string) PayArpu {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	//对字符串进行加工
	dateBegin := fmt.Sprint(monthDate, "-01")
	arr, _ := utils.Month_between_days(monthDate, "")
	dateEnd := fmt.Sprint(monthDate, "-", arr[monthDate])

	var res PayArpu
	queryStr := "SELECT IFNULL((ROUND(SUM(money)/(COUNT(*)))),0) AS 'arpu' FROM user_recharge" +
		" WHERE DATE(FROM_UNIXTIME(TIME))>=? AND DATE(FROM_UNIXTIME(TIME))<=?;"

	db.Raw(queryStr, dateBegin, dateEnd).Scan(&res)
	res.Date = monthDate
	log.Println("FindTotalMonthArpu=======================", res)
	return res
}
