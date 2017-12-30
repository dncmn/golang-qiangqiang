package keFu_operation

import (
	"encoding/json"
	"fmt"
	"log"

	"aaDeZhou/models/keFu_operation"
)

//获取玩家信息GetUserData
func (this *WorkerOpeController) GetUserData() {
	msg := this.GetString("beginTime") //查询条件:玩家昵称或玩家id

	fmt.Println("查询条件是:", msg)
	data := make([]keFu_operation.UserInfo, 0)

	//测试从数据库获取数据,然后进行查询
	user := keFu_operation.FindUserInfo(msg)
	log.Println(user)
	data = append(data, user)

	arr, _ := json.Marshal(data)
	fmt.Println(string(arr))
	this.Data["data"] = string(arr)
	this.Ctx.WriteString(string(arr))
	this.TplName = "kf_operation/findUser.html"

}
