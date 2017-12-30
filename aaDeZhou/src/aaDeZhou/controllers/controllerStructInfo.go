package controllers

import (
	"aaDeZhou/models/user_manager"
)

//登录返回数据的结构体
type ErrorLogin struct {
	State      int       //登录的状态码
	Data       LoginInfo //登录的信息
	ActionList []user_manager.ActionInfo
	Message    string //登录是否成功的信息
	Token      string //登录成功以后保存的用户token
}

type LoginInfo struct {
	UserName string   //用户名
	Password string   //密码
	UserId   int      //用户的id
	RoleId   []string //角色id
}
type Result struct {
	UserName      string
	UserId        string
	RegTime       string
	IninLoginTime string
	LoginTime     int
	LogoutTime    int
	OnlineTime    int
}
