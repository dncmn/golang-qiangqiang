package interaction

import (
	//"encoding/json"
	"log"
)

//解析服务器发送过来的数据

func (this *InteractionController) ParseData() {
	log.Println("begin==================================begin")
	source := this.GetString("source")
	log.Println(source)
	this.Ctx.WriteString("hello")

}
