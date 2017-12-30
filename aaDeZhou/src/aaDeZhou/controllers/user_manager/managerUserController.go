package user_manager

import (
	"encoding/json"

	"log"

	"aaDeZhou/models/user_manager"

	"github.com/astaxie/beego"
)

type UserManagerController struct {
	beego.Controller
}

//管理用户的界面
func (this *UserManagerController) ToUserPage() {
	this.TplName = "user_manager/user_manager.html"
}

//获取角色名称
func (this *UserManagerController) ToGetRoleName() {
	data := user_manager.GetRoleName()
	arr, _ := json.Marshal(data)
	log.Println("获取角色名称====================", string(arr))
	this.Ctx.WriteString(string(arr))
	return
}

//查看用户信息
func (this *UserManagerController) ShowAllUser() {

	data := user_manager.ShowAllUser()

	arr, _ := json.Marshal(data)
	log.Println(string(arr))
	this.Ctx.WriteString(string(arr))
	return
}

//更改用户信息
func (this *UserManagerController) ToModUser() {
	userName := this.GetString("userName")
	password := this.GetString("password")
	userType, _ := this.GetInt("userType")

	//检查该用户是否已经存在
	if isExist := user_manager.CheckIsExist(userName); isExist {
		log.Println("isExist=========================", isExist)
		responseInfo := Result{State: 1, Message: "用户不存在"}
		data, _ := json.Marshal(responseInfo)
		this.Ctx.WriteString(string(data))
		return
	}

	isModify := user_manager.ModifyUserInfoByUserName(userName, password, userType)
	if !isModify {
		log.Println("isModify=========================", isModify)
		responseInfo := Result{State: 2, Message: "更改数据失败"}
		data, _ := json.Marshal(responseInfo)
		this.Ctx.WriteString(string(data))
		return
	}
	responseInfo := Result{State: 0, Message: "更改数据成功"}
	data, _ := json.Marshal(responseInfo)
	this.Ctx.WriteString(string(data))
	return
}

//删除用户
func (this *UserManagerController) ToDelUser() {
	userName := this.GetString("userName")
	log.Println("useName=====================", userName)

	//检查该用户是否已经存在
	if isExist := user_manager.CheckIsExist(userName); isExist {
		log.Println("isExist=========================", isExist)
		responseInfo := Result{State: 1, Message: "用户不存在"}
		data, _ := json.Marshal(responseInfo)
		this.Ctx.WriteString(string(data))
		return
	}

	isDelete := user_manager.DelUserByUserName(userName)
	log.Println("isDelete===================", isDelete)

	log.Println("hello=============hello", user_manager.DelUserByUserName(userName))
	responseInfo := Result{State: 0, Message: "删除数据成功"}
	data, _ := json.Marshal(responseInfo)
	log.Println(string(data))
	this.Ctx.WriteString(string(data))
	return
}

//添加用户
func (this *UserManagerController) ToAdduser() {
	userName := this.GetString("userName")
	password := this.GetString("password")
	userTypeName := this.GetString("userTypeName")

	//检查该用户是否已经存在
	if isExist := user_manager.CheckIsExist(userName); !isExist {
		log.Println("isExist=========================", isExist)
		responseInfo := Result{State: 1, Message: "用户已经存在"}
		data, _ := json.Marshal(responseInfo)
		this.Ctx.WriteString(string(data))
		return
	}

	isTrue, _ := user_manager.AddUser(userName, password, userTypeName)
	if !isTrue {
		log.Println("插入数据失败")

		responseInfo := Result{State: 2, Message: "插入数据失败"}
		data, _ := json.Marshal(responseInfo)
		this.Ctx.WriteString(string(data))
		return
	}
	responseInfo := Result{State: 0, Message: "插入数据成功"}
	data, _ := json.Marshal(responseInfo)
	this.Ctx.WriteString(string(data))
	return

}
