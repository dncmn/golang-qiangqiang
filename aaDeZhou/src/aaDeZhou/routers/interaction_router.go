package routers

import (
	"aaDeZhou/controllers/interaction"
	"github.com/astaxie/beego"
)

//this file is aimed at interaction with game server
//这个router文件就是用来与游戏服务器进行交互的。
func init() {
	beego.Router("/test", &interaction.InteractionController{}, "*:ParseData")
}
