package game_analysis

import (
	"encoding/json"

	"aaDeZhou/models/game_analysis"
	"log"
)

func (this *SNGController) Post() {
	//获取数据
	beginTimeStr := this.GetString("beginTime")
	radioValue := this.GetString("radioValue")

	data := make([]game_analysis.SNG, 0)

	if radioValue == "0" {
		data = HandleData2(beginTimeStr, 0)
	}

	if radioValue == "1" {
		data = HandleData2(beginTimeStr, 6)
	}
	if radioValue == "2" {
		data = HandleData2(beginTimeStr, 29)
	}

	arr, _ := json.Marshal(data)

	this.Data["data"] = string(arr)
	log.Println(string(arr))

	this.Ctx.WriteString(string(arr))
	this.TplName = "game_analysis/sng.html"

}
func HandleData2(beginTimeStr string, step int) []game_analysis.SNG {
	data := make([]game_analysis.SNG, 0)
	data = append(data, game_analysis.SNG{Class: "总和"})

	data = append(data, game_analysis.GetSNGData(beginTimeStr, step)...)

	counts := 0  //总的比赛场数
	one := 0     //一个机器人参与比赛的场数
	two := 0     //两个机器人参与比赛的场数
	win := 0     //玩家获胜的场数
	money := 0   //报名费与奖金差值累计
	incomes := 0 //系统收益
	ticket := 0  //使用门票数量

	for i := 0; i < len(data); i++ {
		counts += data[i].Count
		one += data[i].One
		two += data[i].Two
		win += data[i].UserWin
		money += data[i].Money
		incomes += data[i].Sys_income
		ticket += data[i].Ticket

	}
	data[0].Count = counts
	data[0].One = one
	data[0].Two = two
	data[0].UserWin = win
	data[0].Money = money
	data[0].Sys_income = incomes
	data[0].Ticket = ticket

	return data
}
