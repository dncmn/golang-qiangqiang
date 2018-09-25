package user_analysis

import (
	"github.com/astaxie/beego"
)

//留存
type UserPreserveController struct {
	beego.Controller
}

//活跃
type UserActiveController struct {
	beego.Controller
}

//流失
type UserLossController struct {
	beego.Controller
}

//峰值
type UserPeakValueController struct {
	beego.Controller
}

/*  如果改了下面一个结构体的名字，可能需要改如下几个地方
一：router.go里面
二：原先的controller文件里面的
*/

//指向留存菜单的页面
func (this *UserPreserveController) DayUserPreserve() {
	this.TplName = "user_analysis/user_preserve.html"
}

/*  指向活跃菜单的页面 */
func (this *UserActiveController) ToFindDayUserActivePage() {
	this.TplName = "user_analysis/user_newRegister.html"
}

//指向峰值菜单的页面

func (this *UserPeakValueController) ToCalPeakValPage() {
	this.TplName = "user_analysis/user_PeakValue.html"
}

//指向流失菜单的页面

func (this *UserLossController) ToChooseUserLossPage() {

	this.TplName = "user_analysis/user_loss.html"
}
