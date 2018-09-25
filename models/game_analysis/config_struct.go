package game_analysis

type SNG struct {
	Date       int    //日期
	Class      string //比赛等级
	Tag        int    //比赛等级的标志
	Count      int    //游戏比赛的场数
	One        int    //1机器人参与场数
	Two        int    //2机器人参与场数
	UserWin    int    //玩家获胜场数
	Money      int    //报名费与奖金差值累计
	Sys_income int    //系统收益
	Ticket     int    //使用门票数量
}

//type SNG struct {
//	Date           string //日期
//	Game_class     string //游戏级别
//	Game_count     int    //游戏比赛的场数
//	Machine_count  int    //机器人参与比赛的场数
//	Double_machine int    //两个机器人参与比赛的场数
//	Money_before   int    //赛前摇奖金额
//	Water_cost     int    //抽水消耗
//	Machine_res    int    //机器人输赢场次
//}
type AAF struct {
	Date           string //日期
	Game_class     string //游戏级别
	Game_count     int    //游戏比赛的场数
	Machine_count  int    //机器人参与比赛的场数
	Double_machine int    //两个机器人参与比赛的场数
	Money_before   int    //赛前摇奖金额
	Water_cost     int    //抽水消耗
	Machine_res    int    //机器人输赢场次
}

/*
	获取机器人参与比赛的盘数
*/

type Result struct {
	Count int //表示数量
}
