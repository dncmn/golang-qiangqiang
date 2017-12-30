package keFu_operation

import (
	"aaDeZhou/models/keFu_operation"
	"encoding/json"
	"fmt"
	"log"
)

func (this *WorkerOpeController) ToFindPayIncomePage() {
	this.TplName = "kf_operation/findPayIncome.html"
}

func (this *WorkerOpeController) ToGetPayIncomeData() {
	selectName := this.GetString("selectName")
	selectTime := this.GetString("selectTime")

	log.Println("selectName=============", selectName)
	log.Println("selectTime=============", selectTime)

	trenchArr := GetRechargeTrenchArr()

	//调用sql查询用户
	partArr := keFu_operation.ShowUserRechargeInfo(selectName, selectTime)
	data := make([]keFu_operation.UserRechare, len(partArr))
	fmt.Println("partArr======================", partArr)
	fmt.Println("len(partArr)=================", len(partArr))
	for i := 0; i < len(partArr); i++ {
		data[i] = partArr[i]
		data[i].RechargeTrench = trenchArr[partArr[i].RechargeTrench]
	}

	arr, _ := json.Marshal(data)
	fmt.Println(string(arr))
	this.Data["data"] = string(arr)
	this.Ctx.WriteString(string(arr))
	this.TplName = "kf_operation/findPayIncome.html"
}
func GetRechargeTrenchArr() map[string]string {
	arr := make(map[string]string, 5)
	arr["0"] = "IOS"
	arr["1"] = "微信"
	arr["2"] = "支付宝"

	return arr
}
