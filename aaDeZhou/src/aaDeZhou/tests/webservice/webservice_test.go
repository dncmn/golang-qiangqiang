package webservice

import (
	"log"

	"encoding/json"

	"fmt"
	//"io/ioutil"
	"net/http"
	"testing"
	"time"
)

type User struct {
	Name     string
	Password string
}

func Test_Parse_struct(T *testing.T) {
	//data := make([]User, 0)
	//for i := 1; i < 9; i++ {
	//	data = append(data, User{Name: fmt.Sprint("tom", i), Password: fmt.Sprint("pwd", i)})
	//}
	user := User{Name: "tom", Password: "123456789"}
	arr, jsonErr := json.Marshal(user)

	if jsonErr != nil {
		log.Println("解析数据失败", jsonErr)
		return
	}

	log.Println(string(arr))

	var res User
	parseErr := json.Unmarshal(arr, &res)
	if parseErr != nil {
		log.Println("解析数据失败", parseErr)
		return
	}

	log.Println("res=", res)

}

//测试字符串转byte数组
func Test_string_to_byte(T *testing.T) {
	msg := "hello"
	arr := []byte(msg)
	log.Println(arr)

}

func Test_sendd_sngs(T *testing.T) {

	for j := 1; j <= 100; j++ {
		go func(j int) {

		}(j)
	}

}

func TestGo(t *testing.T) {

	for i := 0; i < 1; i++ {
		go func() {
			for j := 0; j < 1000; j++ {
				go sendGet(j)
				time.Sleep(time.Microsecond * 200)

			}

		}()

	}

	time.Sleep(time.Second * 300)
}

func sendGet(i int) {
	var res User
	res.Name = fmt.Sprint("tom", i)
	res.Password = fmt.Sprint("pwd", i)
	btr, err := json.Marshal(res)
	if err != nil {
		log.Println("转换json失败", err)
		return
	}
	uri := fmt.Sprint("http://127.0.0.1:9092/testSng?data=", string(btr))
	log.Println("uri=====================", uri)
	resp, err := http.Get(uri)
	if err != nil {
		log.Println("获取数据失败.......", err)
	}

	defer resp.Body.Close()
	//body, err := ioutil.ReadAll(resp.Body)
	//if err != nil {
	//	log.Println("解析数据失败......", err)
	//}
	//
	//log.Println(string(body))
}

//测试从通道里面读数据
func Test_Read_From_channel(T *testing.T) {
	ch := make(chan int, 10)

	ch <- 1
	close(ch)

	for {

		num, ok := <-ch
		if !ok {
			log.Println("here")
			break
		}
		log.Println(num)

	}

}

//自己写一个队里来消化这些消息
//func Test_bing_fa(T *testing.T) {
//	ch := make(chan int, 100)
//}
