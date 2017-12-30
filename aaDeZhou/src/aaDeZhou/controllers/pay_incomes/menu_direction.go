package pay_incomes

import (
	"github.com/astaxie/beego"
)

type PayUserController struct {
	beego.Controller
}

type PayArpuController struct {
	beego.Controller
}

type PayHabitController struct {
	beego.Controller
}

//显示页面
func (this *PayUserController) ToPayIncomesPage() {
	this.TplName = "pay_incomes/pay_user.html"
}

//显示页面
func (this *PayHabitController) Get() {
	this.TplName = "pay_incomes/pay_habit.html"
}

//显示页面
func (this *PayArpuController) Get() {
	this.TplName = "pay_incomes/pay_arpu.html"
}
