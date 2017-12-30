package user_manager

import (
	"aaDeZhou/models/utils"
	"fmt"
	"log"
	"strings"
	"time"
)

/*
	检查用户的登录信息
	userName:表示用户名
	password:表示登录密码
*/

//向表中添加数据
/*
	首先向admin_role表插入数据,然后获取对应的role_id
	接着更新admin_user的role_id
	接着授权
*/

func AddUser(userName, password string, roleTypeName string) (bool, string) {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	tx := db.Begin()
	md5 := utils.Md5String(password)

	addTime := time.Now().Unix()

	if roleErr := db.Exec("INSERT INTO admin_role(role_name,add_time)VALUES(?,?);", roleTypeName, addTime).Error; roleErr != nil {
		log.Println("插入到角色表失败")
		tx.Rollback()
		log.Println(roleErr)
	}

	type Result struct {
		RoleId int
	}
	var res Result

	db.Raw("select role_id from admin_role where add_time=?", addTime).Scan(&res)

	if err := db.Exec("INSERT INTO admin_user (user_name,PASSWORD,role_id,create_time) VALUES (?,?,?,?);", userName, md5, res.RoleId, addTime).Error; err != nil {

		log.Println("插入数据失败。。。。。。。。。。。")
		log.Println(err)
		tx.Rollback()
		return false, "插入数据失败"
	}
	tx.Commit()
	return true, "插入数据成功"
}

//添加用户时,检查用户是否存在
func CheckIsExist(userName string) bool {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var res LoginInfo

	db.Raw("SELECT user_name FROM admin_user WHERE user_name=?;", userName).Scan(&res)

	if len(res.UserName) == 0 { //用户不存在

		return true
	}
	log.Println("len(res.UserName)======================", len(res.UserName))

	return false
}

//删除用户
func DelUserByUserName(userName string) bool {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	if err := db.Exec("delete admin_role,admin_user FROM admin_role LEFT JOIN admin_user"+
		" on admin_role.role_id=admin_user.role_id WHERE"+
		" admin_user.user_name=? OR admin_user.user_id=?;", userName, userName).Error; err != nil {

		log.Println("删除数据失败。。。。。。。。。。。")
		log.Println(err)
		db.Rollback()
		return false
	}
	db.Commit()
	return true
}

//修改用户信息
func ModifyUserInfoByUserName(userName, password string, userType int) bool {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	md5 := utils.Md5String(password)

	if err := db.Exec("UPDATE admin_user SET password=? ,role_id=? WHERE user_name=?;", md5, userType, userName).Error; err != nil {

		log.Println("更改用户信息失败")
		log.Println(err)
		return false
	}

	log.Println("更改用户信息成功")

	return true
}

func GetRoleName() []UserInfo {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	var arr []UserInfo
	db.Raw("SELECT DISTINCT(role_name) FROM admin_role" +
		" ORDER BY add_time DESC").Scan(&arr)
	log.Println("arr================", arr)

	return arr
}

//查看用户信息
func ShowAllUser() []UserInfo {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	var arr []UserInfo
	db.Raw("select user_name,role_name,actions  from admin_user" +
		",admin_role where admin_user.role_id=admin_role.role_id " +
		" ORDER BY create_time DESC").Scan(&arr)

	for i := 0; i < len(arr); i++ {
		if len(arr[i].Actions) == 0 {
			arr[i].Actions = "1,6"
		}
	}
	//这个在赋予权限的时候用到了
	for i := 0; i < len(arr); i++ {
		arr[i].ActionIds = strings.Split(arr[i].Actions, ",")
	}

	type Result struct {
		Actions string
		Title   string
	}

	//这里拼接权限名称的字符串
	var res []Result
	queryStr := fmt.Sprint("SELECT title FROM admin_action WHERE id IN (?);")

	for i := 0; i < len(arr); i++ {
		db.Raw(queryStr, arr[i].ActionIds).Scan(&res)
		var s string
		for j := 0; j < len(res); j++ {
			if j < len(res)-1 {
				s = fmt.Sprint(s, res[j].Title, ",")
				continue
			}
			s = fmt.Sprint(s, res[j].Title)
		}

		arr[i].ActionNames = s

	}

	return arr
}
