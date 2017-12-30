package user_analysis

import (
	"aaDeZhou/models/utils"

	"log"
	"strconv"
)

//查询当日新注册的用户数,user_reg

func ShowDayNewLogin(date string) UserData {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var data Restult //封装查询到的每一天新注册的用户数量
	var res UserData

	db.Raw("SELECT COUNT(*) AS 'count' FROM user_reg WHERE FROM_UNIXTIME(reg_time,'%Y-%m-%d')=?;", date).Scan(&data)

	res.Date = date
	res.Count = strconv.Itoa(data.Count)
	if res.Count == "" {
		res.Date = date
		res.Count = "0"
	}
	log.Println(res)
	return res

}

//查询月新增用户---完整数据,user_reg
func ShowMonthNewLogin(date string) UserData {

	db := utils.GetConnection("", "", "")
	defer db.Close()
	var res UserData
	var data Restult

	db.Raw("SELECT COUNT(*) AS 'count' FROM user_reg WHERE FROM_UNIXTIME(reg_time,'%Y-%m')=?", date).Scan(&data)

	res.Count = strconv.Itoa(data.Count)
	res.Date = date
	if res.Count == "" {
		res.Date = date
		res.Count = "0"
	}

	return res
}
