package game_analysis

import (
	"aaDeZhou/models/utils"
)

/*
	获取机器人参与比赛的盘数
*/

//汇总测试数据
/*
  date:表示要查询的日期
  tbName:表示要查询的表名,具体还要拼接
  step:表示查询的时间范围的增量,分为为0,6,29表示日、周、月
*/
func SingleAAFData(date, tbName string, step int) AAF {

	res := AAFLevelCount(date, tbName, step)                   //包含了总的比赛场数，赛前摇奖金额，抽水消耗
	res.Machine_res = AAFMachineGameResult(date, tbName, step) //机器人输赢的盘数的差值

	//机器人参与的比赛盘数和两个机器人同时参与比赛的盘数
	res.Machine_count, res.Double_machine = AAFMachineJoin(date, tbName, step)

	return res

}

//获取每一个等机场的--总的比赛场数，赛前摇奖金额，抽水消耗
func AAFLevelCount(date, dbName string, step int) AAF {
	endTime, _ := utils.DateAddAndSub(date, step)

	db := utils.GetConnection("", "", "")
	defer db.Close()
	var data AAF

	queryStr := "SELECT COUNT(*) AS game_count,SUM(money_before_game)  AS money_before,SUM(water_cost) AS water_cost " +
		" FROM(SELECT FROM_UNIXTIME(online,'%Y-%m-%d %H:%i:%s') AS 'online',machine_join,money_before_game," +
		"water_cost,machine_result FROM " + dbName + " WHERE FROM_UNIXTIME(online,'%Y-%m-%d')>=? " +
		" and FROM_UNIXTIME(online,'%Y-%m-%d')<=?) AS tmp;"

	db.Raw(queryStr, date, endTime).Scan(&data)

	return data
}

//表示机器人输赢的盘数
//date:2017-05-28表示查询的日期
//返回这一个等级场机器人输赢的盘数

func AAFMachineGameResult(date, dbName string, step int) int {
	endTime, _ := utils.DateAddAndSub(date, step)

	db := utils.GetConnection("", "", "")
	defer db.Close()

	var data []Result
	queryStr := "SELECT COUNT(online)  as 'count' FROM " + dbName +
		" WHERE FROM_UNIXTIME(online,'%Y-%m-%d')>= ? and FROM_UNIXTIME(online,'%Y-%m-%d')<=?  GROUP BY machine_result;"

	db.Raw(queryStr, date, endTime).Scan(&data)
	if len(data) == 0 {
		return 0
	}

	return data[1].Count - data[0].Count

}

//获取机器人参与比赛的场数--机器人参与比赛的参数和两个机器人参与比赛的场数
func AAFMachineJoin(date, dbName string, step int) (int, int) {
	endTime, _ := utils.DateAddAndSub(date, step)

	var sum int = 0            //保存机器人参与比赛的场数
	var double_machine int = 0 //保存两个机器人参与比赛的场数
	db := utils.GetConnection("", "", "")
	defer db.Close()

	type machineRes struct {
		Num   int //机器人参与比赛的人数
		Count int //对应参与比赛的场数
	}

	var data []machineRes
	queryStr := "SELECT machine_join AS num,  COUNT(*) AS 'count' FROM(SELECT " +
		"FROM_UNIXTIME(online,'%Y-%m-%d %H:%i:%s') AS 'online',machine_join,money_before_game,water_cost,machine_result " +
		" FROM " + dbName + " WHERE FROM_UNIXTIME(online,'%Y-%m-%d')>=? " +
		" and FROM_UNIXTIME(online,'%Y-%m-%d')<=? ) AS tmp GROUP BY machine_join ;"
	db.Raw(queryStr, date, endTime).Scan(&data)

	for i := 0; i < len(data); i++ {
		if data[i].Num == 0 {
			continue
		}
		if data[i].Num == 2 {
			double_machine = data[i].Count
		}

		sum = sum + data[i].Count

	}

	return sum, double_machine
}
