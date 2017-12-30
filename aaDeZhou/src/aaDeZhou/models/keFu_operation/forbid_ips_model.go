package keFu_operation

import (
	"log"

	"aaDeZhou/models/utils"
)

//根据查询日期找出某一个玩家的权限日志
func ShowAccountInfo(data string) []ForbidIdUser {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	var res []ForbidIdUser

	queryStr := "SELECT user_id AS 'id',user_name AS 'name',NAME AS 'op_name'," +
		"  FROM_UNIXTIME(TIME,'%Y-%m-%d %h:%m:%s')  AS 'time',STATUS AS 'status'" +
		" FROM account_status WHERE user_id= ? OR user_name=?  ORDER BY time desc;"
	if err := db.Raw(queryStr, data, data).Scan(&res).Error; err != nil {
		utils.Write_user_Info("user_errInfo.log", "ShowPowerInfo:查询玩家的权限信息失败")
		return res
	}
	log.Println(res)
	return res
}

//记录页面发送过来的日志信息--缺少错误信息
func LogAccountInfoLog(id, name, op_name string, time int64, status string) bool {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	saveStr := "INSERT INTO account_status " +
		" (user_id,user_name,NAME,TIME,STATUS)" +
		" VALUES(?,?,?,?,?); "

	if err := db.Exec(saveStr, id, name, op_name, time, status).Error; err != nil {
		utils.Write_user_Info("user_errInfo.log", "添加权限日志失败")
		log.Println("添加权限日志失败", err)
		return false
	}

	return true
}

//查看查封玩家的id列表
func ShowIdsList(date string) []ForbidIdUser {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	var res []ForbidIdUser

	queryStr := " SELECT * FROM(SELECT * FROM(SELECT user_name AS 'name',user_id AS id,NAME AS 'op_name'," +
		"FROM_UNIXTIME(TIME,'%Y-%m-%d %H:%m:%s') AS 'time'," +
		" STATUS AS 'status' FROM account_status WHERE FROM_UNIXTIME(TIME,'%Y-%m-%d')=?" +
		" ORDER BY TIME DESC) AS tmp GROUP BY id) AS tmp2 WHERE STATUS=2 ORDER BY TIME DESC;"

	db.Raw(queryStr, date).Scan(&res)
	log.Println(res)
	return res

}
