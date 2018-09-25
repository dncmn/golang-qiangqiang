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

    var selectName = document.getElementById("selectName").value;
    var selectTime = document.getElementById("selectTime").value;


    var re = new RegExp("^[ ]+$");

    //查看按钮判断是否可以继续向下执行
    if (selectName == "" || selectName == null || selectTime == "" || selectTime == null ||re.test(selectName)) {

        alert("查询条件不能为空")
        return false
    }


    var data = new Array(3);

    var ul = document.getElementById("tab");
    var lis = ul.getElementsByTagName("li");


    for (var i = 0; i < lis.length; i++) {
        if (lis[i].hasAttribute("class")) {
            data[0] = lis[i].innerHTML;
            break
        }

    }

    data[1] = selectName;
    data[2] = selectTime;
    return data
}


//设置全局变量，用来保存获取到的数据--下载的时候用到的。
var userNickName = new Array() //用户昵称
var userId = new Array()//用户id
var loginTime = new Array()//用户进入游戏的时间
var payCount = new Array()//充值金额
var payMethod=new Array()//充值方式


//在发送ajax请求之情做的清理工作
function sendAjaxContenClear() {


    //启用下载按按钮
    document.getElementById("trParent").disabled = false
    userNickName = ""
    userId = ""
    loginTime = ""
    payCount = ""
    payMethod = ""

    //删除表格内容

    $('#trParent').html("")

}


//这里发送ajax请求
function sendAjaxRequest() {

    sendAjaxContenClear()//发送ajax的清理工作
    var arr = getFormInfo();
    if (!arr) {
        return
    }
    var selectName = arr[1];
    var selectTime = arr[2];


    var url = "/toGetPayIncomeData";


    data = {
        "selectName": selectName,
        "selectTime": selectTime
    };


    $.post(url, data, function (res) {

        var tmp = JSON.parse(res)

        $.each(tmp, function (n, value) {
            userNickName[n] = value.UserName;
            userId[n] = value.UserId;
            loginTime[n] = value.RechargeTime;
            payCount[n] = value.RechargeMoney;
            payMethod[n] = value.RechargeTrench;


            addForm(value.UserName, value.UserId, value.RechargeTime,
                value.RechargeMoney,value.RechargeTrench);
        });
    });


}


/*  向表中添加节点---  这是用在三个表头内容一样的情况下使用的
 *  向表中添加数据-- 根据选中的li来判断 生成的列数
 * */
function addForm(userNickName, userId, PayTime,
                 payCount,PayMethod) {

    var parent = document.getElementById("trParent")

    var tr1 = document.createElement("tr")
    var td1 = document.createElement("td")
    var td2 = document.createElement("td")
    var td3 = document.createElement("td")
    var td4 = document.createElement("td")
    var td5 = document.createElement("td")


    td1.innerHTML = userNickName
    td2.innerHTML = userId
    td3.innerHTML = PayTime
    td4.innerHTML = payCount
    td5.innerHTML = PayMethod

    tr1.appendChild(td1)
    tr1.appendChild(td2)
    tr1.appendChild(td3)
    tr1.appendChild(td4)
    tr1.appendChild(td5)

    parent.appendChild(tr1)

}


