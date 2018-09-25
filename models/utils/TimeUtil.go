package utils

import (
	"fmt"
	"log"
	"strconv"
	"time"
)

/*
	此方法返回开始日期对应的周索引和周的差值

	beginTimeStr:2017-07-01 表示周一
	endTimeStr:2017-07-01	表示周日
*/

func GetWeekCount(beginTimeStr, endTimeStr string) (int, int) {
	beginTime, begErr := time.Parse("2006-01-02", beginTimeStr)

	if begErr != nil {
		log.Println("TimeUtil.go-GetWeekCount:字符串转换时间失败")
		Write_user_Info(GetLogPath("user_errInfo.log"), "TimeUtil.go-GetWeekCount:字符串转换时间失败")
	}

	_, beginWeekIndex := beginTime.ISOWeek()
	endTime, endErr := time.Parse("2006-01-02", endTimeStr)
	if endErr != nil {
		path := fmt.Sprintf(GetLogPath("user_errInfo.log"), "")
		log.Println(path)
		log.Println("TimeUtil.go-GetWeekCount:字符串转换时间失败")
		Write_user_Info(GetLogPath("user_errInfo.log"), "TimeUtil.go-GetWeekCount:字符串转换时间失败")
	}

	_, endWeekIndex := endTime.ISOWeek()

	return beginWeekIndex, (endWeekIndex - beginWeekIndex)
}

/*
	获取某两天的日期的差值
	函数返回两个方法的差的天数
	beginTimeStr:格式是2017-07-01,表示开始日期
	endTimeStr:格式是2017-07-02,表示结束日期

*/

func GetDateCount(beginTimeStr, endTimeStr string) int64 {

	beginTime, begErr := time.Parse("2006-01-02", beginTimeStr)
	endTime, endErr := time.Parse("2006-01-02", endTimeStr)

	if begErr != nil || endErr != nil {
		log.Println("TimeUtil.go================GetDateCount失败")
		Write_user_Info(GetLogPath("user_errInfo.log"), "TimeUtil.go-Month_between_days:字符串转换时间失败")
	}
	src := beginTime.Unix()
	dst := endTime.Unix()
	return (dst - src) / (24 * 3600)
}

/*
	作用是:查询一个时间段,每个月对应的天数,(也可以查某个月的天数,只不过第二个参数要赋值为空)
	month1:查询的开始月份,格式是"2017-01"
	month2:查询的结束月份,格式是"2017-06"
	包含开始和结束月份
	函数返回一个map类型的数组,就是包含月份和每个月所在的天数

*/
func Month_between_days(month1, month2 string) (map[string]int, error) {
	if len(month2) == 0 || month2 == "" {
		month2 = month1
	}
	var result = make(map[string]int)
	var time1, err = time.Parse("2006-01", month1)
	if err != nil {
		Write_user_Info(GetLogPath("user_errInfo.log"), "TimeUtil.go-Month_between_days:字符串转换时间失败")
		return nil, err
	}
	for time1.Format("2006-01") <= month2 {
		var oldtime = time1
		//加上31天,保证该日期进入下一个月,因为这个月可能是28,29,30天
		time1 = time1.Add(time.Duration(31*24) * time.Hour)
		//加上31天以后,这个日期可能不是这个月的第一号,所有格式化成第二个月的一号
		var str = fmt.Sprintf("%s-01", time1.Format("2006-01"))
		time1, err = time.Parse("2006-01-02", str)

		if err != nil {
			log.Println("转换时间失败.............")
			Write_user_Info(GetLogPath("user_errInfo.log"), "TimeUtil.go-Month_between_days:字符串转换时间失败")
		}

		//获取这两个月的差值,总共有多少天
		days := int(time1.Sub(oldtime) / (time.Duration(24) * time.Hour))
		result[oldtime.Format("2006-01")] = days
	}
	return result, nil
}

/*
msg 代表一个时间字符串  比如"2017-05-02"
step 表示要加几天或者减去几天
*/
func DateAddAndSub(msg string, step int) (string, error) {
	beginDate, err := time.Parse("2006-01-02", msg)
	if err != nil {
		fmt.Println("util:时间转换失败")
		Write_user_Info(GetLogPath("user_errInfo.log"), "TimeUtil.go-DateAddAndSub:对日期进行加减失败")
		return "", err
	}
	addDdateStr := beginDate.Add(time.Hour * time.Duration(24*step)).Format("2006-01-02")

	return addDdateStr, nil

}

/*
	对月份进行加几个月或者减去几个月
	msg:就是形如"2017-06"的日期格式的字符安穿
	step:就是对月份进行操作的数据
		可以加上几个月,可以减去几个月
*/
func MonthOperate(msg string, step int) string {
	date, _ := time.Parse("2006-01", msg)
	srcYear := date.Year()
	srcMonth := int(date.Month())

	var year int
	var month int
	var yearStr string
	var monthStr string
	month = srcMonth + step
	if step > 0 {

		if month > 12 {

			month = month - 12
			year = srcYear + 1
		} else {
			year = srcYear
		}
		if month < 10 {
			monthStr = "0" + strconv.Itoa(month)
		} else {
			monthStr = strconv.Itoa(month)
		}

		msg := fmt.Sprint(year, "-", monthStr)
		return msg
	} else {

		if month < 0 {
			yearStr = strconv.Itoa(srcYear - 1)
			month = 12 + month
		} else if month == 0 {
			month = 12
			yearStr = strconv.Itoa(srcYear - 1)
		} else {
			yearStr = strconv.Itoa(srcYear)
		}

		if month < 10 {
			monthStr = "0" + strconv.Itoa(month)
		} else {
			monthStr = strconv.Itoa(month)
		}

		msg := fmt.Sprint(yearStr, "-", monthStr)
		return msg

	}

}
