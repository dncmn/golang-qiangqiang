package user_manager

import (
	"aaDeZhou/models/user_manager"

	"encoding/json"
	"log"

	"github.com/astaxie/beego"
)

type RoleManagerController struct {
	beego.Controller
}

//管理用户的界面
func (this *RoleManagerController) ToRolePage() {
	this.TplName = "user_manager/role_manager.html"
}

//显示所有的角色信息
func (this *RoleManagerController) ToShowRoleInfo() {
	data := user_manager.ShowAllRoleInfo()
	arr, _ := json.Marshal(data)
	this.Ctx.WriteString(string(arr))
	return
}

//修改角色
func (this *RoleManagerController) ToModRole() {
	oldName := this.GetString("oldName")
	newName := this.GetString("newName")
	log.Println("oldName================", oldName)
	log.Println("newName================", newName)
	log.Println("user_manager.IsExist(oldName)", user_manager.IsExist(oldName))
	//判断角色是否存在
	if ok := user_manager.IsExist(oldName); ok {
		res := Result{State: 1, Message: "角色不存在"}
		arr, _ := json.Marshal(res)
		log.Println(string(arr))
		this.Ctx.WriteString(string(arr))
		return
	}

	//更改角色信息

	if isModify, _ := user_manager.ModifyRoleInfo(newName, oldName); !isModify {
		res := Result{State: 2, Message: "角色修改失败"}
		arr, _ := json.Marshal(res)
		log.Println(string(arr))
		this.Ctx.WriteString(string(arr))
		return
	}

	res := Result{State: 0, Message: "角色修改成功"}
	arr, _ := json.Marshal(res)
	log.Println(string(arr))
	this.Ctx.WriteString(string(arr))
	return

}

//删除角色
func (this *RoleManagerController) ToDelRole() {
	roleName := this.GetString("roleName")
	log.Println("user_manager.IsExist(roleName)", user_manager.IsExist(roleName))
	//判断角色是否存在
	if ok := user_manager.IsExist(roleName); ok {
		res := Result{State: 1, Message: "角色不存在"}
		arr, _ := json.Marshal(res)
		log.Println(string(arr))
		this.Ctx.WriteString(string(arr))
		return
	}

	/*
		删除角色的操作
			1、找出角色对应的user_id
			2、将user_id的role_id设置成null

	*/

	//删除数据
	if isDelete, _ := user_manager.DelRoleByRoleName(roleName); !isDelete {
		res := Result{State: 2, Message: "删除角色失败"}
		arr, _ := json.Marshal(res)
		log.Println(string(arr))
		this.Ctx.WriteString(string(arr))
		return
	}

	res := Result{State: 0, Message: "删除成功"}
	arr, _ := json.Marshal(res)
	log.Println(string(arr))
	this.Ctx.WriteString(string(arr))
	return

}

//添加角色
func (this *RoleManagerController) ToAddRole() {

	roleName := this.GetString("roleName")
	log.Println("user_manager.IsExist(roleName)", user_manager.IsExist(roleName))
	//判断角色是否存在
	if ok := user_manager.IsExist(roleName); !ok {
		res := Result{State: 1, Message: "角色已经存在"}
		arr, _ := json.Marshal(res)
		log.Println(string(arr))
		this.Ctx.WriteString(string(arr))
		return
	}
	//添加角色
	if isAdd := user_manager.AddRole(roleName); !isAdd {
		res := Result{State: 2, Message: "角色添加失败"}
		arr, _ := json.Marshal(res)
		log.Println(string(arr))
		this.Ctx.WriteString(string(arr))
		return
	}

	res := Result{State: 0, Message: "角色添加成功"}
	arr, _ := json.Marshal(res)
	log.Println(string(arr))
	this.Ctx.WriteString(string(arr))
	return
}
