package pay_incomes

//付费率---in use
type PayRate struct {
	Date    string
	PayUser int
	PayRate int
}

//付费收入-- in use
type PayIncome struct {
	Date string
	Anz  int
	Ios  int
}

//新增付费用户--in use
type NewPayUser struct {
	Date     string
	NewLogin int //新增用户
	PayUser  int //付费用户
}

//付费习惯结构体---in use

type PayHabit struct {
	Date string
	App  int //苹果
	Wx   int //微信
	Zfb  int //支付宝
}

//ARPU结构体--- in use
type PayArpu struct {
	Date string
	Arpu int
}

//新版本的付费用户
type Recharge struct {
	Date   string //查询的日期
	Trench int    //渠道标志0:表示安卓,1表示ios
	Money  int    //表示这个日期内充值的金额
}

//新增付费用户时用到的
type CountResult struct {
	Tag   int
	Count int
}
type PayNewLogin struct {
	Date       string
	NewLogin   int //日登陆用户数   --付费用户
	NewPayUser int //日新增付费用户---付费率
}
