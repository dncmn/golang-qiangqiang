package user_analysis

import (
	"aaDeZhou/models/utils"
	"fmt"
	"strconv"

	"log"
)

//查看次日留存用户--完整数据

func ShowDayPreserveUser(date string) UserData {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var res UserData

	var data Restult

	//查这一天新登录的用户数
	if err := db.Raw("SELECT COUNT(DISTINCT(user_id)) AS 'count' FROM user_reg"+
		" WHERE FROM_UNIXTIME(init_login_time,'%Y-%m-%d')=?;", date).Scan(&data); err != nil {
		log.Println("find_day_new_login_err=", err)

		msg := fmt.Sprint("user_preserve.go    查询", date, " 这一天新登录的用户数失败  ", err)
		utils.Write_user_Info("log/user_errInfo.log", msg)

	}
	newLogin := data.Count

	//查这一天再次登录的用户数

	if err := db.Raw("SELECT COUNT(DISTINCT(login.user_id)) AS 'count' FROM user_reg reg,user_login login"+
		" WHERE reg.user_id=login.user_id AND FROM_UNIXTIME(login_time-24*60*60,'%Y-%m-%d')=?", date).Scan(&data).Error; err != nil {

		msg := fmt.Sprint("user_preserve.go   查询", date, " 这一天再次登录的用户数失败  ", err)
		utils.Write_user_Info("log/user_errInfo.log", msg)
	}

	//开始赋值操作

	res.Date = date
	res.Count = strconv.Itoa(data.Count)
	if newLogin == 0 {
		res.Rate = "0"
		return res
	}
	res.Rate = fmt.Sprintf("%0.f", float64(data.Count)/float64(newLogin)*100)

	return res

}

//查看七日留存用户--只能查询完整数据
/*
这里需要更改：根据每一周的周一查询出这周新登录的用户数
*/
func ShowWeekPreserveUser(weekBegin, weekEnd string) UserData {

	init_week_begin := weekBegin

	db := utils.GetConnection("", "", "")
	defer db.Close()
	var data Restult
	var res UserData
	if err := db.Raw("SELECT COUNT(user_id) AS 'count' FROM user_reg WHERE"+
		" FROM_UNIXTIME(init_login_time,'%Y-%m-%d')>=? AND "+
		" FROM_UNIXTIME(init_login_time,'%Y-%m-%d')<=? ;", weekBegin, weekEnd).Scan(&data).Error; err != nil {
		msg := fmt.Sprint("user_preserve.go  查询", weekBegin, " 这一周新登录的用户数失败  ", err)
		utils.Write_user_Info("log/user_errInfo.log", msg)
	}

	weekLogin := data.Count //这一周新登录的用户数
	log.Println("weekNewLogin=============================", weekLogin)

	var total int = 0

	queryStr := "SELECT COUNT(DISTINCT(login.user_id)) AS 'count' FROM user_login login,user_reg reg" +
		" WHERE login.user_id=reg.user_id AND FROM_UNIXTIME(init_login_time,'%Y-%m-%d')=? AND" +
		" FROM_UNIXTIME(login_time,'%Y-%m-%d')>=? AND FROM_UNIXTIME(login_time,'%Y-%m-%d')<=?;"

	//查询这一周前六天的再次登录的用户数
	for i := 0; i < 6; i++ { //求出前六天的人数
		//算出下一天
		dayNext, errAddDay := utils.DateAddAndSub(weekBegin, 1)
		if errAddDay != nil {
			log.Println("更改日期错误")
			log.Println(errAddDay)
		}
		db.Raw(queryStr, weekBegin, dayNext, weekEnd).Scan(&data)
		log.Println(i, "     data.count     ", data.Count)
		total = total + data.Count
		weekBegin = dayNext
	}

	//查询周日的再次登录的用户数
	if err := db.Raw("SELECT COUNT(*) AS 'count' FROM(SELECT * FROM(SELECT login.user_id AS link FROM user_login login ,user_reg reg "+
		" WHERE login.user_id=reg.user_id AND FROM_UNIXTIME(reg.init_login_time,'%Y-%m-%d')=? "+
		" AND  FROM_UNIXTIME(login_time,'%Y-%m-%d')=? ) AS tmp GROUP BY link HAVING (COUNT(link)>=2)) AS mp2;", weekEnd, weekEnd).Scan(&data); err != nil {

		msg := fmt.Sprint("user_preserve.go  查询", weekBegin, " 这一周再次登录的用户数失败  ", err)
		utils.Write_user_Info("log/user_errInfo.log", msg)
	}
	log.Println("周日数量..............", data.Count)
	total = total + data.Count //获取总的再次登录的人数
	log.Println("总的数量...................................", total)
	res.Date = fmt.Sprint(init_week_begin, " to ", weekEnd)
	res.Count = strconv.Itoa(total)

	if weekLogin == 0 { //如果某一周新登录的用户为0,则直接返回
		res.Rate = "0"
		return res
	}
	res.Rate = fmt.Sprintf("%0.f", float64(total)/float64(weekLogin)*100)

	return res

}

//查看30日留存用户--完整数据
func ShowMonthFullPreserveUser(monthBegin string) UserData {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var data Restult
	var res UserData

	//查询某个月新登录的用户数
	if err := db.Raw("SELECT COUNT(*) AS 'count' FROM user_reg "+
		" WHERE FROM_UNIXTIME(init_login_time,'%Y-%m')=?;", monthBegin).Scan(&data); err != nil {
		utils.Write_user_Info("log/user_errInfo.log", "查询月新增用户失败.........")
	}
	monthLogin := data.Count

	//获取某个月再次登录的用户数

	monthEnd := utils.MonthOperate(monthBegin, 1)
	if err := db.Raw("SELECT COUNT(*) AS 'count' FROM(SELECT login.user_id AS user_id "+
		" FROM user_login login,user_reg reg WHERE reg.user_id=login.user_id"+
		" AND FROM_UNIXTIME(reg.init_login_time,'%Y-%m')=?"+
		" AND FROM_UNIXTIME(login.login_time,'%Y-%m')=?) AS tmp;", monthBegin, monthEnd).Scan(&data).Error; err != nil {
		utils.Write_user_Info("log/user_errInfo.log", "查询月再次用户失败.........")
	}

	monthReLogin := data.Count
	res.Date = monthBegin
	res.Count = strconv.Itoa(monthReLogin)

	if monthLogin == 0 {

		res.Rate = "0"
		return res
	}

	res.Rate = fmt.Sprintf("%0.f", float64(monthReLogin)/float64(monthLogin)*100)

	return res

}
