package utils

import (
	"crypto/md5"
	"fmt"
	"io"
	"log"

	"github.com/astaxie/beego"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

//将给定的字符串进行md5加密
func Md5String(pwd string) string {
	h := md5.New()
	io.WriteString(h, pwd) //将str写入到h中

	pwd = fmt.Sprintf("%x", h.Sum(nil))
	return pwd
}

//返回一个数据库连接gb对象
/*
	默认连接的是我本地的数据库
	userName=root
	password=123
	dbName=new_work
	如果要修改的话,就是去配置文件中
*/
func GetConnection(name, password, dbName string) *gorm.DB {

	dialet := beego.AppConfig.String("dialetName")
	if len(name) == 0 {
		name = beego.AppConfig.String("userName")
	}
	if len(password) == 0 {
		password = beego.AppConfig.String("password")
	}
	if len(dbName) == 0 {
		dbName = beego.AppConfig.String("dbName")
	}

	ip := beego.AppConfig.String("ip") //read from conf/app.conf
	port := beego.AppConfig.String("port")
	charset := beego.AppConfig.String("charset")

	localUrl := fmt.Sprint(name, ":", password, "@tcp(", ip, ":", port, ")/", dbName, "?charset=", charset, "&parseTime=True&loc=Local")

	db, err := gorm.Open(dialet, localUrl)

	if err != nil {
		log.Println("数据库连接失败.....")
		Write_user_Info(GetLogPath("user_errInfo.log"), "util.go-GetConnection:数据库连接失败......")
		return nil
	}
	db.DB().SetMaxOpenConns(1000)
	db.DB().SetMaxIdleConns(500)

	return db
}

/*
	src:表示上周登录的用户的id的数组
	dst:表示当周登录的用户的id数组
	函数的返回值是未登录用户的id

*/

func Find_loss_Ids(src, dst []int) []int {
	src_map := make(map[int]bool, len(dst))

	for _, val := range dst {
		src_map[val] = true
	}

	result := make([]int, 0, len(src))

	for _, val := range src {
		if _, ok := src_map[val]; !ok {
			result = append(result, val)
		}
	}

	return result
}

/*
用户登录成功以后，将用户的sessionid保存到数据库中
当用户再次登录的时候,这个sessionid会再次生成并且插入到数据库中
*/

func SaveSessionId(sessionid, userName string) bool {
	db := GetConnection("", "", "")
	defer db.Close()
	if err := db.Exec("UPDATE admin_user SET sessionid=? WHERE  user_name=?;", sessionid, userName).Error; err != nil {
		Write_user_Info(GetLogPath("user_errInfo.log"), "SaveSessionId-SaveSessionId:获取sessionId失败......")
		return false
	}

	return true
}
