package routers

import (
	"qiangqiang/controllers/local_server"
	"github.com/astaxie/beego"
)

func init() {
	beego.Router("/systemInfo", &local_server.Server{}, "*:HandSystemInfo")

}
