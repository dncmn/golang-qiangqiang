package user_manager

import (
	"log"

	"aaDeZhou/models/utils"
)

func CheckLoginInfo(userName, password string) (bool, string) {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var res LoginInfo

	db.Raw("SELECT user_name,PASSWORD AS 'password' FROM admin_user WHERE user_name=?;", userName).Scan(&res)
	if len(res.UserName) == 0 || res.UserName != userName {
		log.Println("用户不存在")
		return false, "用户不存在"

	}
	md5Pwd := utils.Md5String(password)

	if res.Password != md5Pwd {
		log.Println("密码错误")
		return false, "密码错误"
	}

	return true, "登录成功"
}

//根据用户名获取用户的id
func ShowUserId(userName string) int {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	type Result struct {
		UserId int
	}

	var res Result

	db.Raw("SELECT user_id FROM admin_user WHERE user_name=?;", userName).Scan(&res)
	log.Println("userId=======================", res.UserId)
	return res.UserId

}
