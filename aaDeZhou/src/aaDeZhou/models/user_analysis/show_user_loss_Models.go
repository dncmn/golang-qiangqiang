package user_analysis

import (
	"aaDeZhou/models/utils"
	"fmt"
	"log"
	"strconv"
)

//查询周流失信息
func FindWeekLoss(weekBegin string) UserData { //查询的某一周的周一
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var res UserData
	var data Restult

	//这周日
	weekEnd, _ := utils.DateAddAndSub(weekBegin, 6)
	//下周一
	nextBegin, _ := utils.DateAddAndSub(weekBegin, 7)

	//下周日
	nextEnd, _ := utils.DateAddAndSub(weekBegin, 13)

	log.Println("weekBegin=", weekBegin, " weekEnd=", weekEnd, " nextBegin=", nextBegin, " nextEnd=", nextEnd)

	db.Raw("SELECT COUNT(user_id) AS 'count' FROM user_reg WHERE"+
		" FROM_UNIXTIME(init_login_time,'%Y-%m-%d')>=? AND "+
		" FROM_UNIXTIME(init_login_time,'%Y-%m-%d')<=?;", weekBegin, weekEnd).Scan(&data)

	weekNewLogin := data.Count //保存周新登录用户
	log.Println("weekNewLogin======================================", weekNewLogin)

	//查找再次登录的用户数
	db.Raw("SELECT COUNT(*) AS 'count' FROM(SELECT DISTINCT(login.user_id)FROM user_login AS login,user_reg reg"+
		" WHERE reg.user_id=login.user_id AND FROM_UNIXTIME(login_time,'%Y-%m-%d')>=? AND "+
		" FROM_UNIXTIME(login_time,'%Y-%m-%d')<=? AND FROM_UNIXTIME(init_login_time,'%Y-%m-%d')>=? AND "+
		" FROM_UNIXTIME(init_login_time,'%Y-%m-%d')<=? ) AS tmp;", nextBegin, nextEnd, weekBegin, weekEnd).Scan(&data)

	weekReLogin := data.Count //周再次登录的用户数

	log.Println("weekReLogin==========================", weekReLogin)

	res.Date = fmt.Sprint(weekBegin, "-", weekEnd)
	if weekNewLogin == 0 {
		res.Rate = "0"
		res.Count = "0"
		return res
	}
	res.Count = strconv.Itoa(weekReLogin)

	if weekNewLogin == 0 {
		res.Rate = "0"
		return res
	}

	res.Rate = fmt.Sprintf("%.f", (float64(weekReLogin)/float64(weekNewLogin))*100)

	log.Println("res====================================", res.Date)

	return res
}

//查询月流失信息
func ShowMonthLoss(monthDate string) UserData { //查询的那个月
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var res UserData
	var data Restult

	//月份加一
	nextMonth := utils.MonthOperate(monthDate, 1)
	log.Println("monthDate===================", monthDate, "    nextMonth=============", nextMonth)

	//查询当月新登录的用户数
	db.Raw("SELECT COUNT(*) AS 'count' FROM(SELECT user_id FROM user_reg"+
		" WHERE FROM_UNIXTIME(init_login_time,'%Y-%m')=?) AS tmp;", monthDate).Scan(&data)

	monthLogin := data.Count
	log.Println("monthNewLogin============================================", monthLogin)

	//查询当月再次登录的用户数
	db.Raw("SELECT COUNT(*) AS 'count' FROM("+
		" SELECT DISTINCT(login.user_id)FROM user_login AS login,user_reg reg"+
		" WHERE reg.user_id=login.user_id AND FROM_UNIXTIME(login_time,'%Y-%m')=? "+
		" AND FROM_UNIXTIME(init_login_time,'%Y-%m')=?) AS tmp2;", nextMonth, monthDate).Scan(&data)

	monthReLogin := data.Count
	log.Println("monthReLogin==============================", monthReLogin)

	res.Date = monthDate
	if data.Count == 0 {
		res.Count = "0"
		res.Rate = "0"
		return res
	}
	res.Count = strconv.Itoa(monthReLogin)

	res.Rate = fmt.Sprintf("%.f", (float64(monthReLogin)/float64(monthLogin))*100)
	return res
}
