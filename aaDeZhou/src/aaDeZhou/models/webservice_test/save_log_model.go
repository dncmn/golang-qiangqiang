package webservice_test

import (
	"aaDeZhou/models/utils"

	"log"
)

//用于解析结构体的数据

type Result struct {
	Name     string
	Password string
}

func Write_log(res Result) bool {
	db := utils.GetConnection("", "", "")
	defer db.Close()

	query := " insert into user(name,password) values(?,?)"
	err := db.Exec(query, res.Name, res.Password).Error
	if err != nil {
		log.Println(err)
		return false
	}
	return true

}
