/* 清空页面,然后禁用按钮 */
function clearContent(liIndex) {
    //清空数据和设置按钮禁用属性
    $('#beginTime').val("")


    $('#trParent').html("")


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


    var url = "/toAAF"


    data = {
        "beginTime": beginTime,
        "radioValue": radioValue
    }


    $.post(url, data, function (res) {

        var tmp = JSON.parse(res);


        $.each(tmp, function (n, value) {

            if (n == 0 && value.Game_count == 0) {
                alert("查询的当天数据为空");
                return
            }

            gameClass[n] = value.Game_class;
            gameCount[n] = value.Game_count;
            machineArr[n] = value.Machine_count;
            doubleMachineArr[n] = value.Double_machine;
            MoneyBeforeGame[n] = value.Money_before;
            waterCost[n] = value.Water_cost;
            machineWinAndFail[n] = value.Machine_res;
            addForm(value.Game_class, value.Game_count, value.Machine_count,
                value.Double_machine, value.Money_before,
                value.Water_cost, value.Machine_res)
        });


    });


}


/*  向表中添加节点---  这是用在三个表头内容一样的情况下使用的
 *  向表中添加数据-- 根据选中的li来判断 生成的列数
 * */
function addForm(GameClass, GameCount, MachineCount,
                 DoubleMachineCount, MoneyBeforeGame,
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
    td1.innerHTML = GameClass
    td2.innerHTML = GameCount
    td3.innerHTML = MachineCount
    td4.innerHTML = DoubleMachineCount
    td5.innerHTML = MoneyBeforeGame
    td6.innerHTML = WaterCost
    td7.innerHTML = MachineWinAndFail
    tr1.appendChild(td1)
    tr1.appendChild(td2)
    tr1.appendChild(td3)
    tr1.appendChild(td4)
    tr1.appendChild(td5)
    tr1.appendChild(td6)
    tr1.appendChild(td7)
    parent.appendChild(tr1)

}


