package user_analysis

//留存时,需要的用户数据,返回给controller
type UserData struct {
	Date  string
	Count string
	Rate  string
}

//留存时,查询数据库返回的需要的,表示留存或者登录的用户数量
type Restult struct {
	Count int
}

//单次使用时长结构体
type SingleTime struct {
	Date string
	S1   int `1-10s`
	S2   int `11-30s`
	S3   int `31-59s`
	M1   int `60-179s`
	M2   int `180-599s`
	M3   int `600-1799s`
	M4   int `1800s`
}

//流失省份和数量
type LossProc struct {
	Date  string
	Proc  string
	Count int
}

//流失账户信息--结构体
type LossAccountInfo struct {
	Date        string
	Account     string
	Uid         string
	PhoneNumber string
}
