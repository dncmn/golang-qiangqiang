package tests

import (
	"log"

	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"

	"testing"
)

func Test_connect(T *testing.T) {

	db := GetConnection("new_work")

	type Result struct {
		Name     string
		Password string
	}

	query := " select  user_name as 'name' , password from admin_user" +
		" where user_id=100"

	var res Result
	db.Raw(query).Scan(&res)
	log.Println(res)

}

func GetConnection(dbName string) *gorm.DB {

	dialet := "mysql"

	password := "123"

	name := "root"
	port := 3306
	ip := "127.0.0.1"
	charset := "utf8"

	localUrl := fmt.Sprint(name, ":", password, "@tcp(", ip, ":", port, ")/", dbName, "?charset=", charset, "&parseTime=True&loc=Local")

	db, err := gorm.Open(dialet, localUrl)
	if err != nil {
		log.Println("数据库连接失败.....")
		log.Println(err)

		return nil
	}

	return db
}

//利用gorm创建数据库还有表格
func Test_createTable(T *testing.T) {
	db := GetConnection("work")

	//创建表
	//db.AutoMigrate(&Notice{})

	//检查表是否存在
	ok := db.HasTable("notices")
	log.Println(ok)
}

func Test_link_database(T *testing.T) {
	db := GetConnection("work")
	url := " CREATE TABLE `aaf_advanced` (" +
		" `online` varchar(255) NOT NULL COMMENT '比赛日期'," +
		" `machine_join` int(11) DEFAULT NULL COMMENT '机器人参与比赛的人数'," +
		" `money_before_game` int(11) DEFAULT NULL COMMENT '赛前摇奖金额'," +
		" `water_cost` int(11) DEFAULT NULL COMMENT '抽水消耗'," +
		" `machine_result` int(11) DEFAULT NULL COMMENT '机器人输赢结果'," +
		"  PRIMARY KEY (`online`)" +
		" ) ENGINE=InnoDB DEFAULT CHARSET=utf8;"

	if err := db.Exec(url).Error; err != nil {
		log.Println("创建数据表失败", err)
		return
	}

	log.Println("ok....................ok")
}

type Notice struct {
	Id        int    `gorm:"primary_key"`
	Title     string `gorm:"type:varchar(20);not null"`
	Content   string `gorm:"type:text;not null"`
	CreatedAt string `gorm:"type:varchar(255);not null"`
	UpdatedAt string `gorm:"type:varchar(255);not null"`
	AdminId   int    `gorm:"not null"`
}
type User struct {
	Id       int    `gorm:"primary_key;unique"`
	Name     string `gorm:type:varchar(255);not null`
	Password string `gorm:type:varchar(255);not null`
}

func Test_define_table(T *testing.T) {
	db := GetConnection("work")

	gorm.DefaultTableNameHandler = func(db *gorm.DB, defaultTableName string) string {

		return Substr(defaultTableName, 0, len(defaultTableName)-1)
	}

	db.AutoMigrate(&Notice{}, &User{})

}

func Test_update_string(T *testing.T) {
	msg := "hello"
	end := Substr(msg, 0, len(msg)-1)
	log.Println(end)
}

func Substr(str string, start int, end int) string {
	rs := []rune(str)
	length := len(rs)

	if start < 0 || start > length {
		panic("start is wrong")
	}

	if end < 0 || end > length {
		panic("end is wrong")
	}

	return string(rs[start:end])
}
