package keFu_operation

import (
	"aaDeZhou/models/utils"
	"fmt"
)

//玩家信息查询
//msg:代表玩家昵称或者玩家id
func FindUserInfo(msg string) UserInfo {

	db := utils.GetConnection("", "", "")
	defer db.Close()

	var res UserInfo

	db.Raw(" SELECT login.reg_name AS user_name,login.user_id AS user_id,"+
		" reg.coin as user_coin,FROM_UNIXTIME(reg.reg_time,'%Y-%m-%d') as reg_time,"+
		"  FROM_UNIXTIME(MAX(login.login_time),'%Y-%m-%d') AS login_time"+
		" FROM  user_login login,user_reg reg WHERE reg.user_id=login.user_id"+
		"  AND reg.user_name=? OR reg.user_id=?;", msg, msg).Scan(&res)

	fmt.Println(res)

	return res
}

//查看玩家的登录信息
//msg代表玩家昵称或者玩家id
func ShowUserLogin(msg, date string) []UserInfo {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	var res []UserInfo

	db.Raw("SELECT reg_name AS user_name,user_id,"+
		"FROM_UNIXTIME(login_time,'%Y-%m-%d %H:%m:%s') AS login_time,"+
		"FROM_UNIXTIME(logout_time,'%Y-%m-%d %H:%m:%s') AS logout_time"+
		" FROM user_login WHERE(user_id=? OR reg_name=? "+
		" AND FROM_UNIXTIME(login_time,'%Y-%m-%d')=?)", msg, msg, date).Scan(&res)

	fmt.Println(res)

	return res
}

//显示玩家某一天的充值信息
//msg:代表玩家昵称或者玩家id
//date:"2017-07-01",表示充值时间

func ShowUserRechargeInfo(msg, date string) []UserRechare {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	var res []UserRechare

	db.Raw("SELECT  user_name,user_id,FROM_UNIXTIME(time,'%Y-%m-%d %H:%m') AS recharge_time,"+
		"money as recharge_money,trench as recharge_trench FROM user_recharge"+
		" WHERE (user_id=? OR user_name=?)"+
		" AND FROM_UNIXTIME(time,'%Y-%m-%d')=? ORDER BY time DESC;", msg, msg, date).Scan(&res)

	fmt.Println(res)

	return res
}

//同IP查询----完整数据
func ShowSameIps(date string) []UserIp {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	var res []UserIp

	db.Raw("SELECT ip,SUM(game_count) AS game_count FROM find_same_ips WHERE date=? GROUP BY ip ;", date).Scan(&res)

	fmt.Println(res)

	return res
}

//SELECT * FROM find_same_ips WHERE DATE='2017-08-17' AND ip='192.168.2.245';
func ShowUserByIp(date, ip string) []UserIp {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	var res []UserIp

	db.Raw("SELECT user_name,user_id,game_count,coin AS user_coin"+
		" FROM find_same_ips WHERE date=? AND ip=?;", date, ip).Scan(&res)

	fmt.Println(res)

	return res
}
