/* 清空页面,然后禁用按钮 */
function clearContent(liIndex) {
    //清空数据和设置按钮禁用属性
    $('#beginTime').val("")

    $('#trParent').html("")

    $('#downloadId').attr({"disabled": "disabled"})//禁用下载按钮


    var radioIndex = "date" + (getIndex2() + 1)
    var radios = document.getElementsByName(radioIndex)
    for (var i = 0; i < radios.length; i++) {
        radios[0].checked = true//默认选择第一个按钮

    }


}

/*  获取选中的单选框的值 */
function gertRadioValue() {


    var radios = document.getElementsByName("date")
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked == true) {


            return radios[i].value
        }
    }
}


/*  获取数据
 0 li的文本值
 1 开始时间
 2 单选按钮的值


 --根据li的索引,判断生成的data数组的长度 */
function getFormInfo() {

    var beginTime = document.getElementById("beginTime").value;

    //查看按钮判断是否可以继续向下执行
    if (beginTime == "" || beginTime == null) {

        document.getElementById("downloadId").disabled = true//未选择日期,无法使用下载按钮
        alert("未选择日期")
        return
    }


    var data = new Array(3);

    var ul = document.getElementById("tab");
    var lis = ul.getElementsByTagName("li");
    var radioValue = gertRadioValue();//获取单选按钮的值  -//这里获取是2不是周


    for (var i = 0; i < lis.length; i++) {
        if (lis[i].hasAttribute("class")) {
            data[0] = lis[i].innerHTML;
            break
        }

    }

    data[1] = beginTime;
    data[2] = radioValue;
    return data
}


//设置全局变量，用来保存获取到的数据--下载的时候用到的。
var gameClass = new Array() //比赛等级
var gameCount = new Array()//比赛场数
var machineArr = new Array()//机器人参与游戏的盘数
var doubleMachineArr = new Array()//两个机器人参加表
var MoneyBeforeGame = new Array()//赛前摇奖金额
var waterCost = new Array()//抽水消耗
var machineWinAndFail = new Array()//机器人输赢的盘数


//在发送ajax请求之情做的清理工作
function sendAjaxContenClear() {


    //启用下载按按钮
    document.getElementById("trParent").disabled = false
    gameClass = ""
    gameCount = ""
    machineArr = ""
    doubleMachineArr = ""
    MoneyBeforeGame = ""
    waterCost = ""
    machineWinAndFail = ""
    //删除表格内容

    $('#trParent').html("")

}


//这里发送ajax请求
function sendAjaxRequest() {

    sendAjaxContenClear()//发送ajax的清理工作
    var arr = getFormInfo()
    var beginTime = arr[1];
    var radioValue = arr[2];


    var url = "/toSNG"


    data = {
        "beginTime": beginTime,
        "radioValue": radioValue
    }


    $.post(url, data, function (res) {

        var tmp = JSON.parse(res);

        var sum=0 ;
        $.each(tmp, function (n,value) {

            sum+=value.Game_count;
        });

        if(sum==0){
            alert("查询的当天的数据为空");
            return
        }


        $.each(tmp, function (n, value) {
            gameClass[n] = value.Class;
            gameCount[n] = value.Count;
            machineArr[n] = value.One;
            doubleMachineArr[n] = value.Two;
            MoneyBeforeGame[n] = value.Money;
            waterCost[n] = value.Sys_income;
            machineWinAndFail[n] = value.Ticket;
            addForm(value.Class, value.Count, value.One,
                value.Two,value.UserWin, value.Money,
                value.Sys_income, value.Ticket)
        });

        $('#downloadId1').removeAttr("disabled")


    });


}


/*    保存文件到本地 */
function download() {
    //1、获取数据
    //数据保存在全局变量定义的数组中downDateArr,downAppleArr,downWeiXinArr
    var exportContent = "\uFEFF";

    var blob = ""
    var line = "付费习惯\r\n日期  苹果  微信  支付宝\r\n"
    //2、解析数据
    for (var i = 0; i < downDateArr.length; i++) {
        line = line + downDateArr[i] + "," + downAppleArr[i] + "," + downWeiXinArr[i] + "," + downZhiFuBaoArr[i] + "\r\n"

    }
    blob = new Blob([exportContent + line], {type: "text/plain;charset=utf-8"});
    //3、实现下载
    saveAs(blob, "付费习惯.csv");
    //下面的操作是清空保存全局变量的数组
    downDateArr = ""
    downAppleArr = ""
    downWeiXinArr = ""
    downWeiXinArr = ""

}


/*  向表中添加节点---  这是用在三个表头内容一样的情况下使用的
 *  向表中添加数据-- 根据选中的li来判断 生成的列数
 *  value.Class, value.Count, value.One,
 value.Two,value.UserWin, value.Money,
 value.Sys_income, value.Ticket
 * */
function addForm(GameClass, GameCount, MachineCount,
                 DoubleMachineCount, UserWin,MoneyBeforeGame,
                 WaterCost, MachineWinAndFail) {

    var parent = document.getElementById("trParent")

    var tr1 = document.createElement("tr")
    var td1 = document.createElement("td")
    var td2 = document.createElement("td")
    var td3 = document.createElement("td")
    var td4 = document.createElement("td")
    var td5 = document.createElement("td")
    var td6 = document.createElement("td")
    var td7 = document.createElement("td")
    var td8 = document.createElement("td")
    td1.innerHTML = GameClass
    td2.innerHTML = GameCount
    td3.innerHTML = MachineCount
    td4.innerHTML = DoubleMachineCount
    td5.innerHTML = MoneyBeforeGame
    td6.innerHTML = WaterCost
    td7.innerHTML = MachineWinAndFail
    td8.innerHTML = UserWin
    tr1.appendChild(td1)
    tr1.appendChild(td2)
    tr1.appendChild(td3)
    tr1.appendChild(td4)
    tr1.appendChild(td5)
    tr1.appendChild(td6)
    tr1.appendChild(td7)
    tr1.appendChild(td8)
    parent.appendChild(tr1)

}


