package user_manager

import (
	"aaDeZhou/models/utils"
	"log"
	"strings"
)

//获取用户登录成功以后的action的id
func ShowUserActionIds(userName string) []string {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	type Result struct {
		Actions string
	}

	var res Result

	db.Raw("SELECT	actions FROM admin_role,admin_user "+
		" WHERE admin_role.role_id=admin_user.role_id "+
		" AND admin_user.user_name=?;", userName).Scan(&res)

	log.Println(userName, " 的actionIds========", res.Actions)
	if res.Actions == "" {
		return []string{"1", "6"}
	}

	data := strings.Split(res.Actions, ",")
	return data

}

//查看授予权限的信息
func ShowAllActions() []ActionInfo {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var main_menu []ActionInfo
	var sub_menu []ActionInfo
	//主菜单
	db.Raw("SELECT id,pid,title,href FROM admin_action WHERE pid=0;").Scan(&main_menu)
	db.Raw("SELECT id,pid,title,href FROM admin_action WHERE pid>0  ORDER BY pid;").Scan(&sub_menu)
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

	//	log.Println(total_menu)

	return total_menu
}
