package user_manager

import (
	"aaDeZhou/models/utils"
	"fmt"
	"log"
	"time"
)

//只删除子菜单--仅仅删除子菜单
func DelSubMenu(subId int) (bool, string) {
	db := utils.GetConnection("", "", "")

	defer db.Close()
	if err := db.Exec("delete from admin_action where id=?", subId).Error; err != nil {
		log.Println("删除失败", subId)
		log.Println(err)
		return false, "删除失败"
	}
	log.Println("删除菜单成功")
	return true, "删除成功"
}

//删除主菜单和子菜单
func DelMainAndSub(mainId int) (bool, string) {
	db := utils.GetConnection("", "", "")

	defer db.Close()
	if err := db.Exec("delete from admin_action where id=? or pid=?", mainId, mainId).Error; err != nil {
		log.Println("删除失败", mainId)
		log.Println(err)
		return false, "删除失败"
	}
	log.Println("删除菜单成功")
	return true, "删除成功"
}

//删除菜单时,找出父菜单及其对应的子菜单的信息
// 返回 一个flag表示是否成功,还有就是主菜单数据和子菜单数组
func ShowMainAndSubMenu() (bool, []ActionInfo, []ActionInfo) {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var main_menu []ActionInfo
	var sub_menu []ActionInfo
	//主菜单
	if err := db.Raw("SELECT id,pid,title,href FROM admin_action WHERE pid=0 order by id;").Scan(&main_menu).Error; err != nil {
		log.Println("获取主菜单失败")
		log.Println(err)

		return false, []ActionInfo{}, []ActionInfo{}
	}
	log.Println("main_menu=================", main_menu)
	if err := db.Raw("SELECT id,pid,title,href FROM admin_action WHERE pid>0  ORDER BY pid;").Scan(&sub_menu).Error; err != nil {
		log.Println("获取子菜单失败")
		log.Println(err)

		return false, []ActionInfo{}, []ActionInfo{}
	}

	return true, main_menu, sub_menu
}

//找出父菜单信息--增加菜单的时候
func ShowParentMenu() (bool, []ActionInfo) {
	db := utils.GetConnection("", "", "")

	defer db.Close()

	var res []ActionInfo
	if err := db.Raw("select id,pid,title from admin_action where pid=0;").Scan(&res).Error; err != nil {
		log.Println("获取父菜单失败")
		log.Println(err)
		return false, []ActionInfo{}
	}

	return true, res
}

//添加子菜单
func InsertSubMenu(subTitle, subHref string, mainManuId int) (bool, string) {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	addTime := time.Now().Unix()
	if err := db.Exec("insert into admin_action (pid,title,href,add_time) "+
		"values (?,?,?,?)", mainManuId, subTitle, subHref, addTime).Error; err != nil {

		log.Println("添加子菜单失败")
		log.Println(err)
		return false, "添加子菜单失败"
	}

	return true, "添加成功"
}

//添加新创建的父菜单和子菜单
func InsertNewMenu(subTitle, subHref, mainTitle string) (bool, string, int) {

	db := utils.GetConnection("", "", "")
	defer db.Close()
	tx := db.Begin()
	log.Println("subTitle=", subTitle, " subHref=", subHref, "  mainTitle=", mainTitle)

	addTime := time.Now().Unix()
	log.Println("开始插入父元素..................................")
	//插入父元素
	if err := db.Exec("insert into admin_action(pid,title,href,add_time) values(?,?,?,?);", 0, mainTitle, "#", addTime).Error; err != nil {
		log.Println("创建父菜单失败")
		log.Println(err)
		tx.Rollback()
		return false, "创建父菜单失败", 0
	}
	log.Println("开始获取父元素的id.....................................")
	log.Println("mainTitle..........................................", mainTitle)
	//查找父元素的id
	type Result struct {
		Id int
	}
	var res Result

	if err := db.Raw("select id from admin_action where title=?", mainTitle).Scan(&res).Error; err != nil {
		log.Println(err)
		tx.Rollback()
		return false, "获取父菜单的id失败", 0

	}
	log.Println("开始插入子菜单")
	log.Println("res.Id=============================", res.Id)
	//插入子菜单
	if err := db.Exec("insert into admin_action(pid,title,href,add_time) values(?,?,?,?)", res.Id, subTitle, subHref, addTime).Error; err != nil {
		log.Println("创建子失败")
		log.Println(err)
		tx.Rollback()
		return false, "创建子失败", 0
	}

	log.Println("创建成功")
	tx.Commit()
	log.Println("end=================================end")
	return true, "", res.Id
}

//查看子菜单是否已经存在
func CheckSubMenu(subTitle string, pid int) (bool, string) {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	var res ActionInfo

	if err := db.Raw("select * from admin_action where title=? and pid=?", subTitle, pid).Scan(&res).Error; err != nil {
		if err.Error() == "record not found" {
			return true, ""
		}
		errInfo := fmt.Sprint("查询", subTitle, "失败")
		return false, errInfo
	}

	if len(res.Href) != 0 {
		return false, "已经存在"
	}

	return true, ""

}

//移动菜单,更改菜单的pid
func MoveMenuByPid(mainId, subId int) (bool, string) {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	if err := db.Exec("UPDATE admin_action SET pid=? WHERE id=?;", mainId, subId).Error; err != nil {
		log.Println("移动菜单失败")
		log.Println(err)
		return false, "移动菜单失败"
	}

	return true, ""
}
