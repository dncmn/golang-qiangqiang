package webservice_test

import (
	//"aaDeZhou/models/utils"
	"aaDeZhou/models/webservice_test"
	"encoding/json"

	"log"

	"fmt"
	"time"
)

func (this *Webservice) Get() {
	handRequest(this)
	this.Ctx.WriteString("ok...............ok")
	this.Data["ok"] = "ok.................ok"

}

func handRequest(this *Webservice) {
	data := this.GetString("data") //获取一条数据
	var res webservice_test.Result
	parseErr := json.Unmarshal([]byte(data), &res)
	if parseErr != nil {
		log.Println("解析数据错误", parseErr)
		this.Ctx.WriteString("解析数据失败.....")
		return
	}
	msg := fmt.Sprint("   ", res.Name, "   ", res.Password)
	log.Println(time.Now().Format("20016-01-02 15:04:05"), "  ", msg)
	//utils.Write_user_Info("log/sng.log", msg)
	//if ok := webservice_test.Write_log(res); !ok {
	//	this.Ctx.WriteString("error...............error")
	//	this.Data["ok"] = "error................error"
	//	return
	//}

}
