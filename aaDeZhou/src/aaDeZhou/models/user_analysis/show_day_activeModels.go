package user_analysis

import (
	"aaDeZhou/models/utils"
	"fmt"
	"log"
	"strconv"
)

//显示日活跃用户

func ShowDayActiveUser(date string) UserData {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var res UserData
	var data Restult

	db.Raw("SELECT  COUNT(*) AS 'count' FROM(  "+
		"SELECT  COUNT(*) AS 'count' FROM user_login WHERE FROM_UNIXTIME(login_time,'%Y-%m-%d')=?"+
		" GROUP BY user_id HAVING SUM(online_time)>=1800) AS tmp;", date).Scan(&data)

	res.Date = date
	res.Count = strconv.Itoa(data.Count)
	fmt.Println(date, "                        ", data.Count)
	if data.Count == 0 {
		res.Date = date
		res.Count = "0"
		return res
	}
	fmt.Println(res)
	return res
}

//显示月活跃用户
func ShowMonthActiveUser(date string, monthDays int) UserData {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var res UserData
	var data Restult

	db.Raw("SELECT COUNT(*) AS 'count' FROM (SELECT user_id,COUNT(user_id) FROM("+
		"SELECT user_id,FROM_UNIXTIME(login_time,'%Y-%m-%d') AS login_time,SUM(online_time) AS total_time"+
		" FROM user_login WHERE FROM_UNIXTIME(login_time,'%Y-%m')=? GROUP BY user_id, DATE(FROM_UNIXTIME(login_time))"+
		" HAVING SUM(online_time)>=1800) AS tmp GROUP BY user_id HAVING COUNT(user_id)=?) AS tmp_table2;", date, monthDays).Scan(&data)

	res.Count = strconv.Itoa(data.Count)
	res.Date = date
	if data.Count == 0 {
		res.Date = date
		res.Count = "0"

	}
	log.Println(res)
	return res
}
