package user_manager

import (
	"encoding/json"
	"log"

	"aaDeZhou/models/user_manager"

	"github.com/astaxie/beego"
)

type MenuController struct {
	beego.Controller
}

//菜单管理页面
func (this *MenuController) Get() {
	this.TplName = "user_manager/menu_manager.html"
}

//移动菜单---仅仅是更改了pid
func (this *MenuController) ToMoveMenu() {

	//获取要移动的自菜单的id
	mainId, _ := this.GetInt("mainId")
	subId, _ := this.GetInt("subId")

	//更改fuid
	if ok, msg := user_manager.MoveMenuByPid(mainId, subId); !ok {
		responseInfo := Result{State: 1, Message: msg}
		data, _ := json.Marshal(responseInfo)
		this.Ctx.WriteString(string(data))
		return
	}

	responseInfo := Result{State: 0, Message: "移动菜单成功"}
	data, _ := json.Marshal(responseInfo)
	this.Ctx.WriteString(string(data))
	return
}

//删除菜单
func (this *MenuController) ToDelMenu() {
	mainId, _ := this.GetInt("mainMenuId")
	flag := this.GetString("flag")
	if flag == "true" { //表示删除父菜单和子菜单

		if ok, msg := user_manager.DelMainAndSub(mainId); !ok {
			responseInfo := Result{State: 1, Message: msg}
			data, _ := json.Marshal(responseInfo)
			this.Ctx.WriteString(string(data))
			return
		}
	} else {
		//只删除子菜单
		subMenuId, _ := this.GetInt("subMenuId")
		if ok, msg := user_manager.DelSubMenu(subMenuId); !ok {
			responseInfo := Result{State: 2, Message: msg}
			data, _ := json.Marshal(responseInfo)
			this.Ctx.WriteString(string(data))
			return
		}
	}
	responseInfo := Result{State: 0, Message: "删除成功"}
	data, _ := json.Marshal(responseInfo)
	this.Ctx.WriteString(string(data))
	return

}

//获取主菜单和对应子菜单的信息
func (this *MenuController) ToGetMainAndSubMenu() {
	isGet, main_menu, sub_menu := user_manager.ShowMainAndSubMenu()
	if !isGet {
		responseInfo := Result{State: 2, Message: "获取菜单信息失败"}
		data, _ := json.Marshal(responseInfo)
		this.Ctx.WriteString(string(data))
		return
	}
	responseInfo := MenuResult{MainMenu: main_menu, SubMenu: sub_menu, State: 0, Message: "获取主菜单成功"}
	data, _ := json.Marshal(responseInfo)
	this.Ctx.WriteString(string(data))
	return
}

//添加子菜单
func (this *MenuController) ToCreateMenu() {
	subTitle := this.GetString("menuName")
	subHref := this.GetString("menuHref")
	isNew := this.GetString("flag")

	log.Println("isNew====================", isNew)

	if isNew == "true" { //表示新创建一个菜单,
		mainTitle := this.GetString("mainMenu")

		//判断新创建的菜单是否存在
		if isExist, msg := user_manager.CheckSubMenu(mainTitle, 0); !isExist {
			responseInfo := Result{State: 1, Message: msg}
			data, _ := json.Marshal(responseInfo)
			this.Ctx.WriteString(string(data))
			return
		}

		//插入新创建的菜单和子菜单
		ok, msg, MainId := user_manager.InsertNewMenu(subTitle, subHref, mainTitle)
		if !ok {

			responseInfo := Result{State: 2, Message: msg}
			data, _ := json.Marshal(responseInfo)
			this.Ctx.WriteString(string(data))
			return
		}

		responseInfo := Result{State: 0, Message: "添加成功", NewMainId: MainId}
		data, _ := json.Marshal(responseInfo)
		this.Ctx.WriteString(string(data))
		return

	} else { //在旧的菜单下面重新添加一个子菜单
		mainMenuId, _ := this.GetInt("mainMenu")
		//查看子菜单是否存在
		if isExist, msg := user_manager.CheckSubMenu(subTitle, mainMenuId); !isExist {
			responseInfo := Result{State: 1, Message: msg}
			data, _ := json.Marshal(responseInfo)
			this.Ctx.WriteString(string(data))
			return
		}

		if ok, msg := user_manager.InsertSubMenu(subTitle, subHref, mainMenuId); !ok {

			responseInfo := Result{State: 2, Message: msg}
			data, _ := json.Marshal(responseInfo)
			this.Ctx.WriteString(string(data))
			return
		}

		responseInfo := Result{State: 0, Message: "添加成功"}
		data, _ := json.Marshal(responseInfo)
		this.Ctx.WriteString(string(data))
		return
	}

}

//获取主菜单的名字
func (this *MenuController) GetMainMenuName() {
	isOk, data := user_manager.ShowParentMenu()
	if !isOk {
		log.Println("isExist=========================", isOk)
		responseInfo := Result{State: 1, Message: "获取主菜单失败"}
		data, _ := json.Marshal(responseInfo)
		this.Ctx.WriteString(string(data))
		return
	}
	arr, _ := json.Marshal(data)

	this.Ctx.WriteString(string(arr))
	return
}
