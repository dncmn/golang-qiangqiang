package routers

import (
	"aaDeZhou/controllers/game_analysis"

	"github.com/astaxie/beego"
)

func init() {

	//SNG页面
	beego.Router("/toSNG", &game_analysis.SNGController{})

	//AAF页面
	beego.Router("/toAAF", &game_analysis.AAFController{})

}
