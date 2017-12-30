package reflect

import (
	"log"
	"reflect"
	"testing"
)

func Test_structTag(T *testing.T) {
	type Student struct {
		Name string `species:"gopher" color:"blue"`
		Sex  string `phone:"123456"`
	}

	s := Student{}
	st := reflect.TypeOf(s)
	log.Println("reflect.TypeOf(s)=", st)
	field := st.Field(0)
	log.Println("st.Field(0)=", field)
	log.Println(field.Tag.Get("species"), field.Tag.Get("color"))
	log.Println("field.Name=", field.Name, " field.Type=", field.Type)
}

//获取反射的类型和反射的值
func Test_hello(T *testing.T) {
	log.Println("hello")

	var aa int64 = 34

	log.Println(reflect.Zero(reflect.TypeOf(aa))) //获取变量aa的类型

	log.Println(reflect.ValueOf(aa))
	log.Println(reflect.ValueOf(nil)) //方法的说明是返回一个zero零值,但是测试数据是<invalid reflect.Value>
}

//可以利用NumField方法找出这个结构体中的字段类型
func Test_StructTag2(T *testing.T) {
	type Student struct {
		Name string `species:"gopher" color:"blue"`
		Sex  string `phone:"123456"`
	}

	s := Student{}
	st := reflect.TypeOf(s)
	log.Println(st)
	log.Println("st.Size=", st.NumField())
	log.Println(reflect.Slice)

}
