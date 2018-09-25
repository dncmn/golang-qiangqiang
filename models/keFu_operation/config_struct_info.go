package keFu_operation

//玩家信息
type UserInfo struct {
	UserName   string //玩家昵称
	UserId     string //玩家id
	UserCoin   int    //玩家金币
	RegTime    string //注册时间
	LoginTime  string //上次登录时间
	LogoutTime string //登出时间
}

//付费玩家信息
type UserRechare struct {
	UserName       string
	UserId         string
	RechargeTime   string //充值时间
	RechargeMoney  int    //充值金额
	RechargeTrench string //充值渠道
}

//同IP查询的玩家信息
type UserIp struct {
	Date      string //查询日期
	Ip        string //ip地址
	UserName  string //玩家昵称
	UserId    string //玩家id
	GameCount int    //比赛盘数
	UserCoin  int    //金币数量
}

//客服操作,查询玩家信息的时候用到的。
type WorkerOperation struct {
	Time    string `操作时间`
	Name    string `操作者姓名`
	RecName string `被操作者姓名`
	RecId   string `被操作id`
	Content string `操作说明`
}

//权限列表结构体

type UserPower struct {
	Id     string `查询的玩家id`
	Name   string `查询的玩家姓名`
	OpName string `对玩家进行操作的系统管理员的名字`
	Time   string `对玩家的操作时间`
	Status string `玩家的权限状态`
}

//查封用户账号状态
type ForbidIdUser struct {
	Id     string `被操作的的玩家id`
	Name   string `被操作的玩家姓名`
	OpName string `对玩家进行操作的系统管理员的名字`
	Time   string `对玩家的操作时间`
	Status string `玩家的账号状态`
}

//返回状态信息
type Result struct {
	State       int            `返回的状态码`
	Message     string         `返回的消息`
	PowerInfo   []UserPower    `用户的权限信息`
	AccountInfo []ForbidIdUser `查封用户账号的信息`
}
