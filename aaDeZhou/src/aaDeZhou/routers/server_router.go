package routers

import (
	"aaDeZhou/controllers/local_server"
	"github.com/astaxie/beego"
)

func init() {
	beego.Router("/systemInfo", &local_server.Server{}, "*:HandSystemInfo")

}
