package game_analysis

import (
	"github.com/astaxie/beego"
)

type SNGController struct {
	beego.Controller
}

type AAFController struct {
	beego.Controller
}

func (this *SNGController) Get() {
	this.TplName = "game_analysis/sng.html"
}

func (this *AAFController) Get() {
	this.TplName = "game_analysis/aaf.html"
}
