package pay_incomes

import (
	"aaDeZhou/models/utils"
	"fmt"
	"log"
)

//付费习惯
func FindPayHabit(dateBegin, dateEnd string) PayHabit {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	var data []CountResult //用来记录查询结果
	var res PayHabit       //用来封装返回值结果

	queryStr := "SELECT tag,COUNT(DATE)AS 'count'FROM(SELECT FROM_UNIXTIME(TIME,'%Y-%m-%d') AS 'date'," +
		" tag,COUNT(user_id) AS 'count' FROM user_recharge WHERE DATE(FROM_UNIXTIME(TIME))>=? " +
		" AND DATE(FROM_UNIXTIME(TIME))<=? GROUP BY FROM_UNIXTIME(TIME,'%Y-%m-%d'),user_id,tag" +
		" )AS tmp GROUP BY  tag;"

	db.Raw(queryStr, dateBegin, dateEnd).Scan(&data)
	log.Println("FindPayHabit============================", data)
	res.Date = fmt.Sprint(dateBegin, " to ", dateEnd)
	for i := 0; i < len(data); i++ {
		t := data[i]
		if t.Tag == 0 { //代表安卓
			res.App = t.Count
		} else if t.Tag == 1 { //代表微信
			res.Wx = t.Count
		} else { //代表支付宝
			res.Zfb = t.Count
		}
	}

	log.Print("FindPayHabit=============================", res)
	return res

}
