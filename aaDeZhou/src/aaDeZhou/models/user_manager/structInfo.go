package user_manager

//用户角色信息
type RoleInfo struct {
	RoleId   int
	RoleName string
	AddTime  string
}
type ActionInfo struct {
	Id      int
	Pid     int
	Title   string
	Href    string
	AddTime string
}

//用户信息
type UserInfo struct {
	UserName    string   //show  //用户名
	Password    string   //用户密码
	RoleId      int      //角色id
	RoleName    string   //角色名称
	ActionIds   []string //角色id的字符串数组
	ActionNames string   //角色名称的字符串
	Actions     string   //角色id的字符串
}

/*
	检查用户的登录信息
	userName:表示用户名
	password:表示登录密码
*/
type LoginInfo struct {
	UserName string //用户名
	Password string //密码

}
