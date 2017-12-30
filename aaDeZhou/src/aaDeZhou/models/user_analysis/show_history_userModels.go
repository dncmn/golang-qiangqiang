package user_analysis

import (
	"aaDeZhou/models/utils"
	"fmt"
	"strconv"
)

//单选按钮“日”,历史用户
/*
##这里的左边的日期就是系统开服时间
##查询历史每日用户数量：就是查看user_reg表中的init_login_time字段，统计每一天首次登录游戏的用户数

这里还要更正一下，就是需要添加游戏的开服时间，就是DATE>='2017-08-01'
*/
func ShowHistoryUser(date string) UserData {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var res UserData
	var data Restult

	db.Raw("SELECT  SUM(COUNT) AS 'count'  FROM(SELECT DATE(FROM_UNIXTIME(init_login_time)) AS 'date',"+
		"COUNT(user_id) AS 'count' FROM user_reg reg GROUP BY DATE(FROM_UNIXTIME(init_login_time))"+
		")AS tmp WHERE  DATE>='2017-08-01' AND DATE<=?;", date).Scan(&data)

	res.Date = date
	res.Count = strconv.Itoa(data.Count)
	if data.Count == 0 {
		res.Date = date
		res.Count = "0"
	}
	fmt.Println(res)
	return res
}

//单选按钮“月”,历史用户,完整数据,月的历史用户的话

func ShowMonthHistoryUser(date string) UserData {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var res UserData
	var data Restult

	db.Raw("SELECT  SUM(COUNT) AS 'count'  FROM(SELECT FROM_UNIXTIME(init_login_time,'%Y-%m') AS 'date',COUNT(user_id) AS 'count'"+
		"FROM user_reg reg GROUP BY FROM_UNIXTIME(init_login_time,'%Y-%m'))AS tmp WHERE  DATE>='2017-08' AND DATE<=?;", date).Scan(&data)

	res.Date = date
	res.Count = strconv.Itoa(data.Count)
	if data.Count == 0 {
		res.Date = date
		res.Count = "0"
	}
	fmt.Println(res)
	return res
}
