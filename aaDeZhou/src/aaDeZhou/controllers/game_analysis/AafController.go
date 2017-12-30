package game_analysis

import (
	"encoding/json"

	"aaDeZhou/models/game_analysis"
)

func (this *AAFController) Post() {
	//获取数据
	beginTimeStr := this.GetString("beginTime")
	radioValue := this.GetString("radioValue")

	data := make([]game_analysis.AAF, 0)

	if radioValue == "0" {
		data = HandleData(beginTimeStr, 0)
	}

	if radioValue == "1" {
		data = HandleData(beginTimeStr, 6)
	}
	if radioValue == "2" {
		data = HandleData(beginTimeStr, 29)
	}

	arr, _ := json.Marshal(data)

	this.Data["data"] = string(arr)

	this.Ctx.WriteString(string(arr))
	this.TplName = "game_analysis/sng.html"

}
func HandleData(beginTimeStr string, step int) []game_analysis.AAF {
	data := make([]game_analysis.AAF, 0)
	data = append(data, game_analysis.AAF{Game_class: "总和"})

	arr := GetAAFTableName()
	nameArr := GetClassName()

	game_count := 0
	machine_count := 0
	double_machine := 0
	money_before := 0
	water_cost := 0
	machine_res := 0

	for i := 0; i < len(arr); i++ {
		aaf := game_analysis.SingleAAFData(beginTimeStr, arr[i], step)
		aaf.Game_class = nameArr[i] //添加等级名

		//将下面的数据进行累加,然后补充到data数组的第一个元素中
		game_count += aaf.Game_count
		machine_count += aaf.Machine_count
		double_machine += aaf.Machine_count
		money_before += aaf.Money_before
		water_cost += aaf.Water_cost
		machine_res += aaf.Machine_res

		data = append(data, aaf)
	}

	data[0].Game_count = game_count
	data[0].Machine_count = machine_count
	data[0].Double_machine = double_machine
	data[0].Money_before = money_before
	data[0].Water_cost = water_cost
	data[0].Machine_res = machine_res

	return data
}

func GetClassName() []string {
	arr := []string{
		"训练场",
		"初级场",
		"中级场",
		"高级场",
		"神豪场",
	}

	return arr
}

func GetAAFTableName() []string {
	arr := []string{
		"aaf_train",
		"aaf_primary",
		"aaf_middle",
		"aaf_advanced",
		"aaf_evo",
	}
	return arr
}
