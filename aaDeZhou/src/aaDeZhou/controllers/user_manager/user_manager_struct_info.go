package user_manager

import (
	"aaDeZhou/models/user_manager"
)

//对返回结果的统一封装
type Result struct {
	State     int
	Message   string
	Data      []user_manager.ActionInfo
	UserData  []user_manager.UserInfo
	NewMainId int
}

//对菜单返回信息进行封装
type MenuResult struct {
	State    int    //状态码,表示这次请求是否成功0表示成功
	Message  string //返回的文字信息,给用户看的
	MainMenu []user_manager.ActionInfo
	SubMenu  []user_manager.ActionInfo
}
