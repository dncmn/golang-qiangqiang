package local_server

import (
	"aaDeZhou/models/keFu_operation"
	"aaDeZhou/models/utils"
	"encoding/json"
	"log"
	"strings"
)

func (this *Server) HandSystemInfo() {

	selectInfo := this.GetString("selectInfo") //下拉列表的值--判断邮件还是系统消息
	userName := this.GetString("userName")
	sendInfo := this.GetString("content")
	log.Println("selectInfo=", selectInfo, "  sendInfo=", sendInfo)

	var msg []string
	//info_type_name,op_name,rec_name,rev_id,.....
	//拼接记录log的字符换,获取发布系统消息的内容
	if selectInfo == "sysInfo" { //sysInfo系统消息
		//将系统消息记录到日志文件中
		msg = []string{userName, "全体玩家", "自定义", getInfoTypeName(selectInfo), sendInfo}

	} else {
		radioValue := this.GetString("radioValue")
		var playerInfo string //保存玩家信息
		var rev_name string
		var rev_id string

		if radioValue == "all" {
			playerInfo = ""
			rev_name = "全体玩家"
			rev_id = "自定义"
		} else {
			playerInfo = this.GetString("playerInfo") //玩家id或玩家昵称
			rev_name, rev_id = keFu_operation.ShowUserInfo(playerInfo)
		}

		fuJians := this.GetString("fuJians")

		msg = []string{
			userName,
			rev_name, rev_id,
			getInfoTypeName(selectInfo),
			fuJians, sendInfo}

	}

	log_msg := strings.Join(msg, "   ")
	log.Println(log_msg)

	utils.Write_user_Info(utils.GetLogPath("send_systemInfo.log"), log_msg)
	if ok := keFu_operation.SaveSysInfo(log_msg); !ok {
		utils.Write_user_Info("user_errInfo.log", "system_info.go:将系统消息插入到数据库失败")
	}

	res := Result{State: 0, Message: "success"}
	arr, _ := json.Marshal(res)
	log.Println("string(arr)", string(arr))
	//封装返回值信息
	this.Ctx.WriteString(string(arr))

	return

}

//time,info_type,user_name,content
func getInfoTypeName(infoType string) string {
	arr := make(map[string]string)
	arr["mail"] = "邮件"
	arr["sysInfo"] = "系统消息"
	k, v := arr[infoType]
	if !v {
		return "未知类型"
	}
	return k
}

func getRadioName(name string) string {
	if name == "all" {
		return "全体玩家"
	}
	return "个人"
}
