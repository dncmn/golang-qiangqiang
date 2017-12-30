package routers

import (
	"aaDeZhou/controllers/user_manager"

	"aaDeZhou/controllers"

	"github.com/astaxie/beego"
)

func init() {

	//菜单管理
	beego.Router("/toManagerMenu", &user_manager.MenuController{})

	//获取主菜单名字
	beego.Router("/toGetMainMenuName", &user_manager.MenuController{}, "*:GetMainMenuName")
	//添加子菜单
	beego.Router("/toCreateMenu", &user_manager.MenuController{}, "*:ToCreateMenu")

	//删除菜单----获取菜单信息
	beego.Router("/toGetMainAndSubMenu", &user_manager.MenuController{}, "*:ToGetMainAndSubMenu")

	//删除菜单--执行删除操作
	beego.Router("/toDelMenu", &user_manager.MenuController{}, "*:ToDelMenu")

	//移动菜单
	beego.Router("/toMoveMenu", &user_manager.MenuController{}, "*:ToMoveMenu")

	//查看权限列表
	beego.Router("/toActionList", &controllers.MainController{}, "*:ToActionList")

	//用户管理
	beego.Router("/toManagerUser", &user_manager.UserManagerController{}, "*:ToUserPage")

	//添加用户
	beego.Router("/toAdduser", &user_manager.UserManagerController{}, "*:ToAdduser")
	//获取角色名称
	beego.Router("/toGetRoleName", &user_manager.UserManagerController{}, "*:ToGetRoleName")

	//删除用户
	beego.Router("/toDelUser", &user_manager.UserManagerController{}, "*:ToDelUser")

	//更改用户信息
	beego.Router("/toModUser", &user_manager.UserManagerController{}, "*:ToModUser")
	//查看用户信息
	beego.Router("/toShowUserInfo", &user_manager.UserManagerController{}, "*:ShowAllUser")

	//角色管理
	beego.Router("/toManagerRole", &user_manager.RoleManagerController{}, "*:ToRolePage")

	//添加角色
	beego.Router("/toAddRole", &user_manager.RoleManagerController{}, "*:ToAddRole")

	//删除角色
	beego.Router("/toDelRole", &user_manager.RoleManagerController{}, "*:ToDelRole")

	//更改角色
	beego.Router("/toModRole", &user_manager.RoleManagerController{}, "*:ToModRole")

	//查看角色
	beego.Router("/toShowRoleInfo", &user_manager.RoleManagerController{}, "*:ToShowRoleInfo")

	//权限管理
	beego.Router("/toManagerPower", &user_manager.PowerManagerController{}, "*:ToPowerPage")

	//获取用户名
	beego.Router("/toShowUserName", &user_manager.PowerManagerController{}, "*:ToShowUserName")

	//获取权限列表
	beego.Router("/toPowerList", &user_manager.PowerManagerController{}, "*:ToPowerList")

	//更改用户权限
	beego.Router("/toModifyUserPower", &user_manager.PowerManagerController{}, "*:ToModifyUserPower")

}
