package routers

import (
	//	"aaDeZhou/controllers"

	"aaDeZhou/controllers/pay_incomes"

	"github.com/astaxie/beego"
)

/*  付费收入  */
func init() {

	//付费用户页面
	beego.Router("/toPayIncomesPage", &pay_incomes.PayUserController{}, "*:ToPayIncomesPage")

	//付费用户
	beego.Router("/toPayUser", &pay_incomes.PayUserController{}, "*:ToPayUser")

	//付费收入
	beego.Router("/toPayIocome", &pay_incomes.PayUserController{}, "*:ToPayIocome")
	//付费率
	beego.Router("/toPayRate", &pay_incomes.PayUserController{}, "*:ToPayRate")

	//新增付费用户
	beego.Router("/toNewPayUser", &pay_incomes.PayUserController{}, "*:ToNewPayUser")

	//付费习惯--默认是Get请求
	beego.Router("/toPayHabit", &pay_incomes.PayHabitController{})

	//付费ARPU--默认是Get请求
	beego.Router("/toPayArpu", &pay_incomes.PayArpuController{})

}
