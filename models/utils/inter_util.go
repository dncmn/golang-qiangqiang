package utils

import (
	"log"

	"fmt"
	"github.com/astaxie/beego"
	//"io/ioutil"
	"net/http"
	//"net/url"
	"strings"
)

//与游戏服务器交互需要用到的方法

/*
将服务器发送get请求,参数形式是map[string]interface{}类型的
目标是发送含人一个多个键值对
*/
func Send_Get(data map[string]interface{}) (bool, string) {
	//获取配置信息
	ip := beego.AppConfig.String("ip")
	port := beego.AppConfig.String("httpport")

	//拼接请求参数
	tmp := make([]string, 0)

	for k, v := range data {
		t := fmt.Sprint(k, "=", v)
		tmp = append(tmp, t)
	}

	param := strings.Join(tmp, "&")

	uri := fmt.Sprint("http://", ip, ":", port, "/?", param)
	log.Println("uri=====================", uri)

	res, err := http.Get(uri)
	if err != nil {
		log.Println("获取数据失败.......", err)
		return false, ""
	}

	defer res.Body.Close()
	if res.StatusCode == 200 {
		return true, "ok"
	}
	return false, ""

}

//下面的是解析数据
//body, err := ioutil.ReadAll(resp.Body)
//if err != nil {
//	log.Println("解析数据失败......", err)
//}
//
//log.Println(string(body))
//return string(body)
