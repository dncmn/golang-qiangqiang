package user_analysis

import (
	"aaDeZhou/models/utils"

	"log"
	"strconv"
)

//在线峰值:日-------完整数据,返回一个UserData的数组
func ShowDayFullPeakValue(date string) []UserData {
	db := utils.GetConnection("", "", "")

	defer db.Close()
	var res []UserData

	db.Raw("SELECT CONCAT( FROM_UNIXTIME(peak_time,'%Y-%m-%d %H'),':00') AS 'date',MAX(COUNT) AS 'count' "+
		" FROM(SELECT id ,TIME  AS peak_time,COUNT FROM user_peakValue WHERE FROM_UNIXTIME(TIME,'%Y-%m-%d')=?"+
		" ) AS tmp GROUP BY FROM_UNIXTIME(peak_time,'%H');", date).Scan(&res)

	log.Println(res)
	return res

}

//在线峰值：月-----完整数据,返回一个UserData的数组,就是这个月，每天的峰值
func ShowMonthFullPeakValue(MonthDate string) []UserData {
	db := utils.GetConnection("", "", "")

	defer db.Close()
	var res []UserData

	db.Raw("SELECT FROM_UNIXTIME(TIME,'%Y-%m-%d')  AS 'date',MAX(COUNT) AS 'count' FROM user_peakvalue"+
		" WHERE FROM_UNIXTIME(time,'%Y-%m')=? GROUP BY date ORDER BY date;", MonthDate).Scan(&res)

	log.Println(res)
	return res
}

//日均在线用户数
func ShowDayAvgUser(date string) UserData {
	db := utils.GetConnection("", "", "")

	defer db.Close()
	var res UserData

	var data Restult

	db.Raw("SELECT COUNT(*) AS 'count' FROM(SELECT user_id,COUNT(DISTINCT(user_id))"+
		" FROM user_login WHERE DATE(FROM_UNIXTIME(login_time))=? GROUP BY user_id)AS tmp;", date).Scan(&data)

	//	msg := fmt.Sprintf("%.f", float64(data.Count)/24*100)
	log.Println("原始数据是:", data.Count)
	log.Println("查询过以后的数据是:", data.Count/24)

	res.Count = strconv.Itoa(data.Count)
	res.Date = date
	return res
}

//日均在线时长
func ShowDayAvgTime(date string) UserData {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var res UserData
	var data Restult

	db.Raw("SELECT  ROUND(SUM(single_time)  /COUNT(*)/60) AS 'count'  FROM(SELECT"+
		" user_id,SUM(online_time) AS single_time FROM user_login	WHERE DATE(FROM_UNIXTIME(login_time))=?"+
		" GROUP BY user_id HAVING SUM(online_time)>=1800) AS tmp;", date).Scan(&data)

	res.Date = date
	res.Count = strconv.Itoa(data.Count)
	log.Println("获取日均在线时长:", res.Count)
	return res
}

//单次使用时长分布:完整数据
//date:参数形式是:2017-07-08，表示要查询的某一天的具体日期
func ShowSingleLoginTime(date string) SingleTime {
	db := utils.GetConnection("", "", "")
	defer db.Close()
	var res SingleTime //保存查询范围的时间
	var data Restult   //用来保存从数据库中查询到的数量
	tmpArr := make([]int, 7)
	timeRange := [][]int{{1, 10}, {11, 30}, {31, 59}, {60, 179}, {180, 599}, {600, 1799}, {1800, 0}}

	for i := 0; i < len(timeRange); i++ {
		if i == len(timeRange)-1 {
			db.Raw("SELECT COUNT(*) AS 'count' FROM user_login WHERE DATE(FROM_UNIXTIME(login_time))=?"+
				" AND online_time>=?;", date, 1800).Scan(&data)
		} else {
			db.Raw("SELECT COUNT(*) AS 'count' FROM user_login WHERE DATE(FROM_UNIXTIME(login_time))=?"+
				" AND online_time>=? AND online_time<=?;", date, timeRange[i][0], timeRange[i][1]).Scan(&data)
		}
		tmpArr[i] = data.Count

	}

	res.Date = date
	res.S1 = tmpArr[0]
	res.S2 = tmpArr[1]
	res.S3 = tmpArr[2]
	res.M1 = tmpArr[3]
	res.M2 = tmpArr[4]
	res.M3 = tmpArr[5]
	res.M4 = tmpArr[6]

	log.Println("获取单次使用时长分布:", res)

	return res
}
