package tests

import (
	"fmt"
	"github.com/jinzhu/gorm"
	"log"
	"testing"
)

func Test_one(T *testing.T) {
	log.Println("one..............one")
}

func Test_gorm_pool(T *testing.T) {
	dialet := "mysql"

	password := "123"

	name := "root"
	port := 3306
	ip := "127.0.0.1"
	charset := "utf8"
	dbName := "new_work"

	localUrl := fmt.Sprint(name, ":", password, "@tcp(", ip, ":", port, ")/", dbName, "?charset=", charset, "&parseTime=True&loc=Local")

	db, err := gorm.Open(dialet, localUrl)
	if err != nil {
		log.Println("数据库连接失败.....")
		log.Println(err)

		return
	}

	db.DB().SetMaxIdleConns(500)
	db.DB().SetMaxOpenConns(200)
	db.DB().SetConnMaxLifetime(1000)
	log.Println(db.DB().Ping())
}
