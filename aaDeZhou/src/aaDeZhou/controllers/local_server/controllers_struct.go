package local_server

import (
	"github.com/astaxie/beego"
)

//保存controllers目录下的结构体信息
type Server struct {
	beego.Controller
}

//封装返回值的结构体信息
type Result struct {
	State   int    `返回的状态码	0表示成功，1表示失败`
	Message string `返回的字符串信息`
}
