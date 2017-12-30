package tests

import (
	"testing"

	"log"

	"strconv"
	"strings"
)

type SNG struct {
	Date       int //日期
	Class      int //比赛等级
	Count      int //游戏比赛的场数
	One        int //1机器人参与场数
	Two        int //2机器人参与场数
	UserWin    int //玩家获胜场数
	Money      int //报名费与奖金差值累计
	Sys_income int //系统收益
	ticket     int //使用门票数量
}

func Test_sng(T *testing.T) {
	db := GetConnection("new_work")
	defer db.Close()

	msg := "2017-10-25"

	date, _ := strconv.Atoi(strings.Join(strings.Split(msg, "-"), ""))
	query := "SELECT class,total AS 'count',ONE AS 'one', two" +
		",user_win,money,sys_income,ticket" +
		" FROM sng WHERE DATE between ? and ? ORDER BY class ;"

	var data []SNG

	db.Raw(query, date, date*1).Scan(&data)
	log.Println(data)

}
func Test_string_split(T *testing.T) {
	msg := "2017-01-02"
	//将获得的日期转换成数字
	num, _ := strconv.Atoi(strings.Join(strings.Split(msg, "-"), ""))
	log.Println(num)

}
