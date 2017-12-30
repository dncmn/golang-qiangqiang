package keFu_operation

import (
	"aaDeZhou/models/keFu_operation"
	"encoding/json"
	"fmt"
)

func (this *WorkerOpeController) GetOperateData() {
	selectTime := this.GetString("selectTime")
	fmt.Println("selectTime====================", selectTime)
	var data = make([]keFu_operation.WorkerOperation, 0)
	data = keFu_operation.FindOperationLog(selectTime)

	arr, _ := json.Marshal(data)
	fmt.Println(string(arr))
	this.Data["data"] = string(arr)
	this.Ctx.WriteString(string(arr))
	this.TplName = "kf_operation/worker.html"
}
