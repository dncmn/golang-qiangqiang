package reflect

import (
	"log"
	"reflect"
	"testing"

	"encoding/json"
	"fmt"
	"os"
)

//
////利用反射获取结构体字段的tag信息,直接获取还有就是利用get方式获取
func Test_StructTag3(T *testing.T) {
	type Student struct {
		Name string "this is sudent name"
		Age  int    "this is student age"
	}

	var s Student
	s.Name = "tom"
	s.Age = 18
	rs := reflect.TypeOf(s)

	for i := 0; i < rs.NumField(); i++ {
		log.Println(rs.Field(i).Tag)
	}
}

//利用反射获取结构体字段标签的名字和内容
func Test_StructTag4(T *testing.T) {
	type Student struct {
		Name string `content:"this is student name"`
		Age  int    `addr:"from anyWhere"`
	}
	var s Student
	s.Name = "tom"
	s.Age = 18

	rs := reflect.TypeOf(s)

	for i := 0; i < rs.NumField(); i++ {

		f := rs.Field(i)
		log.Println(f.Tag)

	}
}

func Test_rand(T *testing.T) {
	type User struct {
		Name string "json:string"
	}

	type ColorGroup struct {
		ID     int    `json:",string"`
		Name   string `json:",omitempty"`
		Colors []string
		User
	}

	group := ColorGroup{
		ID:     1,
		Name:   "",
		Colors: []string{"Crimson", "Red", "Ruby", "Maroon"},
		User:   User{Name: "tom"},
	}
	b, err := json.Marshal(group)
	if err != nil {
		fmt.Println("error:", err)
	}
	os.Stdout.Write(b)
}
