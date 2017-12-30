package routers

import (
	"aaDeZhou/controllers/webservice_test"
	"github.com/astaxie/beego"
)

func init() {
	beego.Router("/testSng", &webservice_test.Webservice{})

}
