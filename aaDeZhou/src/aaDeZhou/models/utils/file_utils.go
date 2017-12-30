package utils

import (
	"fmt"
	"log"
	"os"
	"runtime"
	"strings"
	"time"
)

const LOG_PATH = "log"
const SYSTEM_SEPARATOR_WINDOWS = "\\"
const SYSTEM_SEPARATOR_LINUX = "/"

//获取记录日志的路径
func GetLogPath(filename string) string {
	dir, err := os.Getwd()
	if err != nil {
		return LOG_PATH
	}
	tmp := strings.Join([]string{dir, LOG_PATH}, GetSystemSeparator())
	path := fmt.Sprint(tmp, GetSystemSeparator(), filename)
	return path
}

//获取系统的文件分隔符
func GetSystemSeparator() string {
	if runtime.GOOS == "linux" {
		return SYSTEM_SEPARATOR_LINUX
	}
	return SYSTEM_SEPARATOR_WINDOWS
}

//向登录日志里面写数据
//filename:为要保存日志的文件名
//content:为要向日志添加的内容
func Write_user_Info(filename, content string) {

	file, err := os.OpenFile(filename, os.O_APPEND|os.O_RDWR|os.O_CREATE, 0666)
	if err != nil {
		log.Println("打开文件失败.....", err)
		return
	}
	defer file.Close()

	usr_time := time.Now().Format("2006-01-02 15:04:05")
	content = fmt.Sprint(usr_time, "   ", content, "\r\n")

	_, err = file.WriteString(content)
	if err != nil {
		log.Println("向日志中写数据失败.......", err)
		return
	}
	log.Println("write.....................end")
}

//检测文件是否存在
func PathExists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		return true, nil
	}
	if os.IsNotExist(err) {
		return false, nil
	}
	return false, err
}

//golang判断文件或文件夹是否存在的方法为使用os.Stat()函数返回的错误值进行判断:
//
//如果返回的错误为nil,说明文件或文件夹存在
//如果返回的错误类型使用os.IsNotExist()判断为true,说明文件或文件夹不存在
//如果返回的错误为其它类型,则不确定是否在存在
