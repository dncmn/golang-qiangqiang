package pay_incomes

//付费收入
import (
	"aaDeZhou/models/utils"

	"log"
)

//获取总的，某一天的新增付费用户和新增用户
//date:2017-01-02表示要查询的某一天的数据
func FindPayUserCount(date string) NewPayUser {

	var data NewPayUser
	payUser := findNewPayUser(date)
	newLogin := findNewLoginUser(date)
	data.Date = date
	data.PayUser = payUser
	data.NewLogin = newLogin

	log.Println("FindPayUserCount========================", data)
	return data

}

//获取日新增付费用户--根据日期
//date:形式如2017-09-08
func findNewPayUser(date string) int {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	var data CountResult

	queryStr := "SELECT COUNT(user_id) AS 'count'" +
		" FROM first_recharge WHERE DATE(FROM_UNIXTIME(TIME))=?;"
	db.Raw(queryStr, date).Scan(&data)
	log.Println("新增付费用户数是:", data.Count)
	return data.Count
}

//找出某一天新增的用户，(这一天新登录的吧)
func findNewLoginUser(date string) int {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	var data CountResult

	queryStr := "SELECT COUNT(user_id) AS 'count'" +
		" FROM user_reg WHERE DATE(FROM_UNIXTIME(init_login_time))=?;"
	db.Raw(queryStr, date).Scan(&data)
	log.Println("新增用户数是:", data.Count)
	return data.Count
}
