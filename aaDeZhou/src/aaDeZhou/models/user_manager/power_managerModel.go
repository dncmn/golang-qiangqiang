package user_manager

import (
	"aaDeZhou/models/utils"
	"fmt"
	"log"
	"strconv"
	"strings"
)

//执行更改用户权限的操作
func ModifyPowerByUserName(userName, actionIds string) (bool, string) {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	err := db.Exec("UPDATE admin_role SET actions=?"+
		" WHERE role_id =(SELECT role_id FROM admin_user WHERE user_name=?);", actionIds, userName).Error

	if err != nil {
		log.Println("更改用户权限失败")
		log.Println(err)
		return false, fmt.Sprint("更改", userName, "权限失败")
	}

	return true, fmt.Sprint("更改", userName, "权限成功")
}

//获取用户权限信息..................
func ShowAllUserPower() []ActionInfo {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	var main_menu []ActionInfo
	var sub_menu []ActionInfo
	//主菜单
	db.Raw("SELECT id,pid,title,href,FROM_UNIXTIME(add_time,'%Y-%m-%d %H:%m:%s') AS add_time FROM admin_action WHERE pid=0;").Scan(&main_menu)
	db.Raw("SELECT id,pid,title,href,FROM_UNIXTIME(add_time,'%Y-%m-%d %H:%m:%s') AS add_time FROM admin_action WHERE pid>0  ORDER BY pid;").Scan(&sub_menu)
	total_menu := make([]ActionInfo, 0)

	for _, val := range main_menu {
		total_menu = append(total_menu, val)
		for _, v := range sub_menu {
			if val.Id != v.Pid {
				continue
			}
			total_menu = append(total_menu, v)

		}
	}

	return total_menu

}

//获取某一个用户的权限id
func ShowActionIdByUserName(userName string) []string {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	type Result struct {
		Actions string
	}

	var res Result

	db.Raw("SELECT actions FROM admin_role,admin_user"+
		" WHERE admin_role.role_id=admin_user.role_id AND admin_user.user_name=?;", userName).Scan(&res)

	log.Println(res.Actions)
	if len(res.Actions) == 0 {
		log.Println("该用户没有任何权限")
		return []string{"1", "6"} //获取设置默认的
	}
	data := strings.Split(res.Actions, ",")

	return data

}

//找出pid为0的父菜单的编号
func ShowNewMenuIds(actionIds string) string {

	db := utils.GetConnection("", "", "")
	defer db.Close()

	type Result struct {
		Id int
	}
	var res []Result
	url := fmt.Sprint("select distinct(pid) as id from admin_action where id in (", actionIds, ")")
	db.Raw(url).Scan(&res)

	arr := make([]int, 0)
	strArr := strings.Split(actionIds, ",")
	//将子菜单添加到数组
	for i := 0; i < len(strArr); i++ {
		index, _ := strconv.Atoi(strArr[i])
		arr = append(arr, index)
	}

	//将主菜单添加到数组
	for i := 0; i < len(res); i++ {
		arr = append(arr, res[i].Id)
	}

	//对数组进行排序
	for i := 0; i < len(arr); i++ {
		for j := 0; j < len(arr)-i-1; j++ {
			if arr[j+1] < arr[j] {
				arr[j], arr[j+1] = arr[j+1], arr[j]
			}
		}
	}

	log.Println("arr=", arr)
	//将数组拼接成字符串
	var s string
	for i := 0; i < len(arr); i++ {
		if i < len(arr)-1 {
			s = fmt.Sprint(s, arr[i], ",")
			continue
		}
		s = fmt.Sprint(s, arr[i])
	}

	return s

}
