package user_analysis

import (
	"aaDeZhou/models/utils"
	"fmt"
	"log"
)

//查找周流失用户信息
func FindWeekLossUserInfo(weekBegin, selectOption string) []LossAccountInfo {
	var arr []LossAccountInfo //保存流失省份信息的结构体

	db := utils.GetConnection("", "", "")
	defer db.Close()
	//这周日
	weekEnd, _ := utils.DateAddAndSub(weekBegin, 6)

	//下周一
	nextBegin, _ := utils.DateAddAndSub(weekBegin, 7)

	//下周日
	nextEnd, _ := utils.DateAddAndSub(weekBegin, 13)

	lossIds := findWeekLossIds(weekBegin, weekEnd, nextBegin, nextEnd)

	//根据流失用户的id找到流失用户的账户信息
	db.Raw("SELECT MAX(FROM_UNIXTIME(login_time,'%Y-%m-%d')) AS 'date',reg_name AS account,reg.user_id AS uid,reg.province"+
		" FROM user_login  login,user_reg reg WHERE login.user_id=reg.user_id AND FROM_UNIXTIME(login_time,'%Y-%m-%d')>=?"+
		" AND FROM_UNIXTIME(login_time,'%Y-%m-%d')<=? AND login.user_id IN(?)"+
		" AND reg.province =? GROUP BY uid;", weekBegin, weekEnd, lossIds, selectOption).Scan(&arr)
	log.Println("arr=========================================", arr)

	return arr

}

//查找月流失的用户信息
func FindMonthLossUserInfo(monthBegin, selectOption string) []LossAccountInfo {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var arr []LossAccountInfo //保存流失省份信息的结构体

	//找出流失用户的id
	lossIds := findMonthLossIds(monthBegin)

	//获取流失用户的个人账户信息
	db.Raw("SELECT MAX(FROM_UNIXTIME(login_time,'%Y-%m-%d')) AS 'date',reg_name AS account,login.user_id AS uid,reg.province"+
		" FROM user_login login,user_reg reg WHERE reg.user_id=login.user_id AND FROM_UNIXTIME(login_time,'%Y-%m')=? "+
		" AND login.user_id IN(?) AND reg.province=? GROUP BY uid;", monthBegin, lossIds, selectOption).Scan(&arr)
	log.Println("arr=========================================", arr)
	return arr

}

//查找月流失的省份信息
func FindMonthLossProvs(monthBegin string) []LossProc {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var arr []LossProc //保存流失省份信息的结构体
	lossIds := findMonthLossIds(monthBegin)

	//获取流失用户的地域分布
	db.Raw("SELECT province AS proc ,COUNT(user_id) AS 'count' FROM user_reg "+
		" WHERE user_id IN(?) GROUP BY proc ORDER BY proc ;", lossIds).Scan(&arr)
	log.Println("arr=========================================", arr)
	return arr

}

/*
找出周流失的省份分布信息
weekBegin:表示这一周开始的时间
weekEnd:表示这一周结束的时间
*/
func FindWeekLossProvs(weekBegin string) []LossProc {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	//这周日
	weekEnd, _ := utils.DateAddAndSub(weekBegin, 6)

	//下周一
	nextBegin, _ := utils.DateAddAndSub(weekBegin, 7)

	//下周日
	nextEnd, _ := utils.DateAddAndSub(weekBegin, 13)
	var arr []LossProc //保存流失省份信息的结构体
	lossIds := findWeekLossIds(weekBegin, weekEnd, nextBegin, nextEnd)

	//根据流失用户的id找到分配的地域信息
	db.Raw("SELECT province AS proc ,COUNT(user_id) AS 'count' FROM user_reg "+
		" WHERE user_id IN(?) GROUP BY proc ORDER BY proc ;", lossIds).Scan(&arr)
	log.Println("arr=========================================", arr)

	return arr

}

//找出月流失的用户id
func findMonthLossIds(monthBegin string) []int {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	var data []Restult //保存每一次的查询结果

	var newLogin []int //保存新登录的用户id
	var reLogin []int  //保存再次登录的用户id

	//获取当月新登录的用户数
	db.Raw("SELECT user_id AS 'count' FROM user_reg WHERE"+
		" FROM_UNIXTIME(init_login_time,'%Y-%m')=?;", monthBegin).Scan(&data)

	for i := 0; i < len(data); i++ {
		newLogin = append(newLogin, data[i].Count)
	}

	//活跃这个月再次登录的用户数
	monthEnd := utils.MonthOperate(monthBegin, 1)
	db.Raw("SELECT distinct(user_id) AS 'count' FROM(SELECT login.user_id AS user_id "+
		" FROM user_login login,user_reg reg WHERE reg.user_id=login.user_id"+
		" AND FROM_UNIXTIME(reg.init_login_time,'%Y-%m')=?"+
		" AND FROM_UNIXTIME(login.login_time,'%Y-%m')=?) AS tmp;", monthBegin, monthEnd).Scan(&data)

	for i := 0; i < len(data); i++ {
		reLogin = append(reLogin, data[i].Count)
	}

	//找出流失用户的id
	lossIds := utils.Find_loss_Ids(newLogin, reLogin)
	log.Println("lossIds=", lossIds)
	return lossIds
}

//找出周流失的id
func findWeekLossIds(weekBegin, weekEnd, nextBegin, nextEnd string) []int {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var data []Restult //保存每一次的查询结果

	var newLogin []int //保存新登录的用户id
	var reLogin []int  //保存再次登录的用户id

	log.Println("weekBegin=", weekBegin, " weekEnd=", weekEnd, " nextBegin=", nextBegin, " nextEnd=", nextEnd)

	//找出这一周新登录的用户id
	db.Raw("SELECT user_id AS 'count' FROM user_reg WHERE"+
		" FROM_UNIXTIME(init_login_time,'%Y-%m-%d')>=? AND "+
		" FROM_UNIXTIME(init_login_time,'%Y-%m-%d')<=?;", weekBegin, weekEnd).Scan(&data)

	fmt.Println("data========================================", data)
	for i := 0; i < len(data); i++ {
		newLogin = append(newLogin, data[i].Count)
	}
	fmt.Println("newLogin==========================================", newLogin)

	//找出这一周再次登录的用户id
	db.Raw("SELECT DISTINCT(user_id) as 'count'  FROM(SELECT DISTINCT(login.user_id)FROM user_login AS login,user_reg reg"+
		" WHERE reg.user_id=login.user_id AND FROM_UNIXTIME(login_time,'%Y-%m-%d')>=? AND "+
		" FROM_UNIXTIME(login_time,'%Y-%m-%d')<=? AND FROM_UNIXTIME(init_login_time,'%Y-%m-%d')>=? AND "+
		" FROM_UNIXTIME(init_login_time,'%Y-%m-%d')<=? ) AS tmp;", nextBegin, nextEnd, weekBegin, weekEnd).Scan(&data)

	for i := 0; i < len(data); i++ {
		reLogin = append(reLogin, data[i].Count)
	}

	fmt.Println("dst=========================================", reLogin)

	lossIds := utils.Find_loss_Ids(newLogin, reLogin)
	fmt.Println("lossIds=====================================", lossIds)
	return lossIds
}
