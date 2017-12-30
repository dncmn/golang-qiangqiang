package keFu_operation

import (
	"log"

	"aaDeZhou/models/utils"
)

//根据查询日期找出某一个玩家的权限日志
func ShowPowerInfo(data string) []UserPower {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	var res []UserPower

	queryStr := "SELECT user_id AS 'id',user_name AS 'name',NAME AS 'op_name'," +
		"  FROM_UNIXTIME(TIME,'%Y-%m-%d %h:%m:%s')  AS 'time',STATUS AS 'status'" +
		" FROM power_status WHERE user_id= ? OR user_name=?  ORDER BY time desc;"
	if err := db.Raw(queryStr, data, data).Scan(&res).Error; err != nil {
		utils.Write_user_Info("user_errInfo.log", "ShowPowerInfo:查询玩家的权限信息失败")
		return res
	}
	log.Println(res)
	return res
}

//根据玩家昵称或者玩家id,判断这个玩家是否存在
func IsExistUser(data string) (bool, string) {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	var res UserInfo
	queryStr := "select user_id,user_name from user_reg where user_id=? or user_name=?;"
	db.Raw(queryStr, data, data).Scan(&res)
	log.Println(len(res.UserName))
	if len(res.UserName) == 0 {
		return false, "该用户不存在"
	}
	return true, ""
}

//记录页面发送过来的日志信息--缺少错误信息
func LogPowerLog(id, name, op_name string, time int64, status string) bool {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	saveStr := "INSERT INTO power_status " +
		" (user_id,user_name,NAME,TIME,STATUS)" +
		" VALUES(?,?,?,?,?); "

	if err := db.Exec(saveStr, id, name, op_name, time, status).Error; err != nil {
		utils.Write_user_Info("user_errInfo.log", "添加权限日志失败")
		log.Println("添加权限日志失败", err)
		return false
	}

	return true
}

//查看权限列表
func ShowPowerList(date string) []UserPower {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	var res []UserPower

	queryStr := " SELECT * FROM(SELECT * FROM(SELECT user_name AS 'name',user_id AS id,NAME AS 'op_name'," +
		"FROM_UNIXTIME(TIME,'%Y-%m-%d %H:%m:%s') AS 'time'," +
		" STATUS AS 'status' FROM power_status WHERE FROM_UNIXTIME(TIME,'%Y-%m-%d')=?" +
		" ORDER BY TIME DESC) AS tmp GROUP BY id) AS tmp2 WHERE STATUS=2 ORDER BY TIME DESC;"

	db.Raw(queryStr, date).Scan(&res)
	log.Println(res)
	return res

}
