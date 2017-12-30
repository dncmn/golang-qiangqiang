package pay_incomes

import (
	"aaDeZhou/models/utils"
	"fmt"
	"log"
	"time"
)

//求这个月总的付费用户和付费率
func TotalMonthPayRate(date string) PayRate {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var res PayRate
	log.Println("TotalMonthPayRate:date===============", date)
	arr, _ := utils.Month_between_days(date, "")
	monthDays := arr[date]
	log.Println("TotalMonthPayRate:arr================", arr)
	log.Println("TotalMonthPayRate:monthDays===============", monthDays)
	query := "SELECT TIME AS 'date',r.count AS pay_user ,ROUND(ROUND(r.count/a.count,2)*100) AS pay_rate FROM(" +
		" SELECT login_time,COUNT(user_id) AS 'count' FROM(SELECT login_time,user_id,COUNT(login_time)" +
		" FROM(SELECT FROM_UNIXTIME(login_time,'%Y-%m') AS 'login_time',user_id FROM user_login  login" +
		"  WHERE FROM_UNIXTIME(login_time,'%Y-%m')=? GROUP BY DATE(FROM_UNIXTIME(login_time)),user_id" +
		" HAVING SUM(online_time)>=1800) AS tmp GROUP BY user_id HAVING COUNT(login_time)=?) AS tmp2) a,(" +
		" SELECT FROM_UNIXTIME(TIME,'%Y-%m') AS TIME,COUNT(DISTINCT(user_id)) AS 'count'" +
		" FROM user_recharge WHERE FROM_UNIXTIME(TIME,'%Y-%m')=?) r WHERE a.login_time=r.time;"

	db.Raw(query, date, monthDays, date).Scan(&res)
	fmt.Println("total==============", res)
	return res
}

/*付费用户---付费用户的付费率  日和月*/
func UserPayRate(date string) []PayRate {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var res []PayRate
	log.Println("UserPayRate:date===============", date)
	query := "SELECT pay.online AS 'date',pay_count AS pay_user,CEIL(ROUND(pay_count/active_count,2)*100) AS pay_rate" +
		" FROM(SELECT  FROM_UNIXTIME(TIME,'%Y-%m-%d') AS 'online', COUNT(DISTINCT(user_id)) AS 'pay_count' FROM user_recharge" +
		" WHERE FROM_UNIXTIME(TIME,'%Y-%m')=? GROUP BY DATE(FROM_UNIXTIME(TIME))) pay,(" +
		" SELECT login_time,COUNT(user_id) AS 'active_count' FROM(SELECT " +
		" FROM_UNIXTIME(login_time,'%Y-%m-%d') AS 'login_time',user_id FROM user_login  login" +
		" WHERE FROM_UNIXTIME(login_time,'%Y-%m')=? GROUP BY DATE(FROM_UNIXTIME(login_time)),user_id" +
		" HAVING SUM(online_time)>=1800 )AS tmp GROUP BY login_time) active WHERE pay.online=active.login_time;"

	db.Raw(query, date, date).Scan(&res)
	fmt.Println("res==============", res)
	return res
}

/*
付费用户：周
date:形式如2017-08-01，这里只能是周一
*/
func UserWeekPayRate(weekBegin string) []PayRate {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var res []PayRate
	//提取月份
	t, _ := time.Parse("2006-01-02", weekBegin)
	sysMonth := t.Format("2006-01")
	log.Println("UserWeekPayRate:===========styMonth:", sysMonth)

	//找到周日
	weekEnd := t.Add(time.Hour * 24 * 6).Format("2006-01-02")

	log.Println("UserPayRate:weekBegin===============", weekBegin)
	log.Println("UserPayRate:weekEnd===============", weekEnd)
	query := "SELECT pay.online AS 'date',pay_count AS pay_user,CEIL(ROUND(pay_count/active_count,2)*100) AS pay_rate" +
		" FROM(SELECT  FROM_UNIXTIME(TIME,'%Y-%m-%d') AS 'online', COUNT(DISTINCT(user_id)) AS 'pay_count' FROM user_recharge" +
		" WHERE FROM_UNIXTIME(TIME,'%Y-%m')=? GROUP BY DATE(FROM_UNIXTIME(TIME))) pay,(" +
		" SELECT login_time,COUNT(user_id) AS 'active_count' FROM(SELECT " +
		" FROM_UNIXTIME(login_time,'%Y-%m-%d') AS 'login_time',user_id FROM user_login  login" +
		" WHERE FROM_UNIXTIME(login_time,'%Y-%m')=? GROUP BY DATE(FROM_UNIXTIME(login_time)),user_id" +
		" HAVING SUM(online_time)>=1800 )AS tmp GROUP BY login_time) active WHERE pay.online=active.login_time" +
		" AND pay.online>=? AND pay.online<=?; "

	db.Raw(query, sysMonth, sysMonth, weekBegin, weekEnd).Scan(&res)
	fmt.Println("res==============", res)
	return res
}
