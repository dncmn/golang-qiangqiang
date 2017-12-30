package keFu_operation

import (
	"aaDeZhou/models/keFu_operation"
	"aaDeZhou/models/utils"
	"encoding/json"
	"fmt"
	"log"
	"time"
)

//获取玩家账户列表
func (this *WorkerOpeController) ToAccountInfoList() {

	var res keFu_operation.Result

	selectTime := this.GetString("selectValue")
	fmt.Println("selectTime=================", selectTime)

	data := make([]keFu_operation.ForbidIdUser, 0)

	//测试从数据库获取数据,然后进行查询,
	data = keFu_operation.ShowIdsList(selectTime)

	res.State = 0
	res.Message = "查询成功"
	res.AccountInfo = data
	arr, _ := json.Marshal(res)
	fmt.Println(string(arr))
	this.Data["data"] = string(arr)
	this.Ctx.WriteString(string(arr))
	this.TplName = "kf_operation/forbidId.html"
}

//记录玩家的账户信息
func (this *WorkerOpeController) HandAccountLog() {
	var res keFu_operation.Result

	//获取接收的数据
	id := this.GetString("userId")
	name := this.GetString("userName")
	op_name := this.GetString("opName")
	time := time.Now().Unix()
	status := this.GetString("status")

	log.Println("id=", id, " name=", name, " op_name=", op_name, " time=", time, " status=", status)
	if ok := keFu_operation.LogAccountInfoLog(id, name, op_name, time, status); !ok {
		res.State = 1
		res.Message = "封号失败"
	} else {
		res.State = 0
		res.Message = "封号成功"
	}

	//将数据记录到日志文件中
	power_msg := fmt.Sprint("id=", id, " name=", name, " op_name=", op_name, " status=", status)
	utils.Write_user_Info("account_status.log", power_msg)

	arr, _ := json.Marshal(res)
	log.Println(string(arr))
	this.Data["data"] = string(arr)
	this.Ctx.WriteString(string(arr))
	this.TplName = "kf_operation/forbidId.html"

}

//取消玩家的封号状态
func (this *WorkerOpeController) CancleForbidAccountLog() {

	var res keFu_operation.Result
	/*
		这里是取消玩家的账户,需要对数据库进行两次操作,插入两条记录.
		第一条是:取消玩家账户的记录
		第二条是:重新添加一条玩家账户正常的记录。
	*/

	//获取接收的数据
	id := this.GetString("userId")
	name := this.GetString("userName")
	op_name := this.GetString("opName")
	logTime := time.Now().Unix()
	status := this.GetString("status")

	log.Println("id=", id, " name=", name, " op_name=", op_name, " time=", logTime, " status=", status)

	keFu_operation.LogAccountInfoLog(id, name, op_name, logTime, status)
	logTime = time.Now().Add(time.Second * 2).Unix()
	keFu_operation.LogAccountInfoLog(id, name, "", logTime, "0")

	//将信息添加到日志文件中
	power_msg := fmt.Sprint("id=", id, " name=", name, " op_name=", op_name, " status=", status)
	utils.Write_user_Info("account_status.log", power_msg)

	arr, _ := json.Marshal(res)
	log.Println(string(arr))
	this.Data["data"] = string(arr)
	this.Ctx.WriteString(string(arr))
	this.TplName = "kf_operation/forbidId.html"

}

//查询玩家的账户信息
func (this *WorkerOpeController) FindAccountInfoByName() {

	selectValue := this.GetString("selectValue")
	log.Println("selectValue=======================", selectValue)

	var res keFu_operation.Result

	//首先检验玩家是否存在
	if ok, msg := keFu_operation.IsExistUser(selectValue); !ok {
		res.State = 1
		res.Message = msg
	} else {
		data := keFu_operation.ShowAccountInfo(selectValue)
		res.State = 0
		res.Message = ""
		res.AccountInfo = data
	}

	//测试从数据库获取数据,然后进行查询,
	/*
		这里的顺序是按照时间倒序的

	*/

	arr, _ := json.Marshal(res)
	log.Println(string(arr))
	this.Data["data"] = string(arr)
	this.Ctx.WriteString(string(arr))
	this.TplName = "kf_operation/forbidId.html"

}
