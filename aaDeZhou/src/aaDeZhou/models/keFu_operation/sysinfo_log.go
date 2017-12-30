package keFu_operation

import (
	"log"

	"aaDeZhou/models/utils"
	"strings"
	"time"
)

/* 客服操作.....查询所有的操作信息
date:查询的日期,2017-10-17
*/
func FindOperationLog(date string) []WorkerOperation {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	queryStr := "SELECT FROM_UNIXTIME(TIME,'%Y-%m-%d') AS 'time'," +
		"NAME AS 'name',rec_name,rec_id,content FROM sysinfo_log" +
		" WHERE FROM_UNIXTIME(TIME,'%Y-%m-%d')=?;"

	var res []WorkerOperation

	db.Raw(queryStr, date).Scan(&res)
	log.Println(res)
	return res
}

/*
保存日志信息
//info_type_name,op_name,rec_name,rev_id,.....
*/
func SaveSysInfo(msg string) bool {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	logTime := time.Now().Unix()
	arr := strings.Split(msg, "   ")
	op_name := arr[0]
	rec_name := arr[1]
	rev_id := arr[2]
	content := strings.Join(arr[3:], "   ")
	query := "INSERT INTO sysinfo_log(NAME,TIME,rec_name,rec_id,content) VALUES(?,?,?,?,?);"
	if err := db.Exec(query, op_name, logTime, rec_name, rev_id, content).Error; err != nil {
		return false
	}

	return true

}

//在分不清楚用户昵称或id的时候,找出用户昵称或者id
//返回值(用户昵称,用户id)
func ShowUserInfo(msg string) (string, string) {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	query := "SELECT user_name ,user_id  FROM user_reg " +
		" WHERE user_name= ? OR  user_id=?;"
	var res UserInfo
	db.Raw(query, msg, msg).Scan(&res)
	log.Println(res.UserName, "      id=", res.UserId)
	return res.UserName, res.UserId
}
