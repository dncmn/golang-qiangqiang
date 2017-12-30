package game_analysis

import (
	"aaDeZhou/models/utils"

	"log"
	"strconv"
	"strings"
)

func GetSNGData(msg string, step int) []SNG {

	db := utils.GetConnection("", "", "")
	defer db.Close()

	date, _ := strconv.Atoi(strings.Join(strings.Split(msg, "-"), ""))
	query := "SELECT class as 'tag',SUM(total) AS 'count',SUM(ONE) AS 'one', SUM(two) AS two" +
		",SUM(user_win) AS user_win,SUM(money) AS money,SUM(sys_income) AS sys_income,SUM(ticket) AS  ticket" +
		" FROM sng WHERE DATE BETWEEN ? AND ? GROUP BY class ORDER BY class ;"

	var data []SNG
	db.Raw(query, date, date+step).Scan(&data)
	arr := GetGameClassArr()

	for i := 0; i < len(data); i++ {
		v := data[i]
		data[i].Class = arr[v.Tag]
		log.Println(data[i].Class)
	}

	return data

}

//获取比赛等级的名字
func GetGameClassArr() map[int]string {

	arr := make(map[int]string)

	arr[0] = "训练场"
	arr[1] = "初级场"
	arr[2] = "中级场"
	arr[3] = "高级场"
	arr[4] = "神豪场"

	return arr
}
