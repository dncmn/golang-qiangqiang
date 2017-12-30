package user_manager

import (
	"aaDeZhou/models/utils"
	"log"
	"time"
)

//查看角色信息
func ShowAllRoleInfo() []RoleInfo {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	var arr []RoleInfo
	db.Raw("SELECT  role_id,role_name,from_unixtime(add_time,'%Y-%m-%d %H:%m:%s') AS add_time  FROM admin_role  ORDER BY add_time DESC;").Scan(&arr)
	log.Println("arr================", arr)

	return arr
}

//更改角色信息
func ModifyRoleInfo(newName, oldName string) (bool, string) {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	if err := db.Exec("UPDATE admin_role SET role_name=? WHERE role_name=?;", newName, oldName).Error; err != nil {

		log.Println("更改数据失败")
		log.Println(err)
		return false, "更改数据失败"
	}

	return true, "更改数据成功"
}

//删除角色
/*
	找出觉得对应的用户id
	将这些用户的role_id设置成0，也就是对应的权限id是1,6的
*/
func DelRoleByRoleName(roleName string) (bool, string) {

	db := utils.GetConnection("", "", "")
	defer db.Close()
	tx := db.Begin()
	//1、找出角色对应的用户id
	type Result struct {
		RoleId int
	}
	var res []Result
	db.Raw("select role_id from admin_role where role_name=?", roleName).Scan(&res)

	data := make([]int, 0)
	for i := 0; i < len(res); i++ {
		data = append(data, res[i].RoleId)
	}

	//2、更改这些用户的role_id,设置role_id为空
	if err := db.Exec("update admin_user set role_id =0 where role_id in(?)", data).Error; err != nil {
		log.Println(err)
		tx.Rollback()
		return false, "更改用户的角色id失败"
	}
	//3、删除admin_role中的数据

	if err := db.Exec("DELETE FROM admin_role WHERE role_name=? or role_id=?;", roleName, roleName).Error; err != nil {

		log.Println("删除数据失败")
		log.Println(err)
		tx.Rollback()
		return false, "删除数据失败"
	}
	tx.Commit()
	return true, "添加数据成功"
}

//查看角色信息
//func ShowAllRoleInfo(roleName string) []int {
//	db := utils.GetConnection("", "", "")

//	defer db.Close()
//	type Result struct {
//		RoleId int
//	}
//	var res []Result
//	db.Raw("select role_id from admin_role where role_name=?", roleName).Scan(&res)

//	data := make([]int, 0)
//	for i := 0; i < len(res); i++ {
//		data = append(data, res[i].RoleId)
//	}

//	return data
//}

//添加角色
func AddRole(roleName string) bool {

	db := utils.GetConnection("", "", "")
	defer db.Close()

	addTime := time.Now().Format("2006-01-02")
	if err := db.Exec("INSERT INTO admin_role(role_name,add_time) VALUES(?,?);", roleName, addTime).Error; err != nil {

		log.Println("插入数据失败。。。。。。。。。。。")
		log.Println(err)
		return false
	}

	return true
}

//查看角色是否存在
func IsExist(roleName string) bool {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var res RoleInfo

	db.Raw("SELECT role_name FROM admin_role WHERE role_name=?;", roleName).Scan(&res)

	if len(res.RoleName) == 0 { //角色不存在
		log.Println("len(res.RoleName)======================", len(res.RoleName))
		return true
	}
	log.Println("len(res.RoleName)======================", len(res.RoleName))

	return false
}
