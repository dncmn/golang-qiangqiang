/* 清空页面,然后禁用按钮 */
function clearContent(liIndex) {
    //清空数据和设置按钮禁用属性
    $('#beginTime').val("")
    $('#trParent').html("")


}


/*  获取数据
 0 li的文本值
 1 开始时间
 2 单选按钮的值


 --根据li的索引,判断生成的data数组的长度 */
function getFormInfo() {

    var beginTime = document.getElementById("beginTime").value;

    var re = new RegExp("^[ ]+$");

    //查看按钮判断是否可以继续向下执行
    if (beginTime == "" || beginTime == null ||re.test(beginTime)) {

        alert("查询条件不能为空")
        return false
    }


    var data = new Array(2);

    var ul = document.getElementById("tab");
    var lis = ul.getElementsByTagName("li");


    for (var i = 0; i < lis.length; i++) {
        if (lis[i].hasAttribute("class")) {
            data[0] = lis[i].innerHTML;
            break
        }

    }

    data[1] = beginTime;
    return data
}


//设置全局变量，用来保存获取到的数据--下载的时候用到的。
var userNickName = new Array() //比赛等级
var userId = new Array()//比赛场数
var moneyCount = new Array()//机器人参与游戏的盘数
var registerTime = new Array()//两个机器人参加表
var lastLoginTime = new Array()//赛前摇奖金额


//在发送ajax请求之情做的清理工作
function sendAjaxContenClear() {



    userNickName = ""
    userId = ""
    moneyCount = ""
    registerTime = ""
    lastLoginTime = ""

    //删除表格内容

    $('#trParent').html("")

}


//这里发送ajax请求
function sendAjaxRequest() {

    sendAjaxContenClear()//发送ajax的清理工作
    var arr = getFormInfo()
    if(!arr){
        return
    }
    var beginTime = arr[1];


    var url = "/toGetUserData"


    data = {
        "beginTime": beginTime
    }

    $.post(url, data, function (res) {

        var tmp = JSON.parse(res)
        $.each(tmp, function (n, value) {
            userNickName[n] = value.UserName;
            userId[n] = value.UserId;
            moneyCount[n] = value.UserCoin;
            registerTime[n] = value.RegTime;
            lastLoginTime[n] = value.LoginTime;

            addForm(value.UserName, value.UserId, value.UserCoin,
                value.RegTime, value.LoginTime)
        });
    });


}



function addForm(userNickName, userId, MachineCount,
                 DoubleMachineCount, lastLoginTime) {

    var parent = document.getElementById("trParent")

    var tr1 = document.createElement("tr")
    var td1 = document.createElement("td")
    var td2 = document.createElement("td")
    var td3 = document.createElement("td")
    var td4 = document.createElement("td")
    var td5 = document.createElement("td")

    td1.innerHTML = userNickName
    td2.innerHTML = userId
    td3.innerHTML = MachineCount
    td4.innerHTML = DoubleMachineCount
    td5.innerHTML = lastLoginTime
    tr1.appendChild(td1)
    tr1.appendChild(td2)
    tr1.appendChild(td3)
    tr1.appendChild(td4)
    tr1.appendChild(td5)
    parent.appendChild(tr1)

}


