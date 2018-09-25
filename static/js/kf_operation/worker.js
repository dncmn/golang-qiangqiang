/* 清空页面,然后禁用按钮 */
function clearContent() {
    //清空数据和设置按钮禁用属性
    $('#selectTime').val("");
    $('#main1').html("");
    $('#trParent').html("")
}
$(function () {
    window.onload = function () {


        $li = $('#tab li')
        $li.click(function () {


            $this = $(this); //获取点击获取的对象

            $liIndex = $this.index(); //获取点击的序号
            clearContent()

        });
    }
});


//确定选中的li的索引
function getIndex2() {


    var ul = document.getElementById("tab")
    var lis = ul.getElementsByTagName("li")

    for (var i = 0; i < lis.length; i++) {
        if (lis[i].hasAttribute("class")) {

            return i
        }

    }

}


/*  获取数据
 0 li的文本值
 1 开始时间
 2 结束时间
 3 单选按钮的值


 --根据li的索引,判断生成的data数组的长度 */
function getInfo() {
    var liIndex = getIndex2() + 1; //获取选中的li的值

    if (liIndex == 1) {
        var selectTime = document.getElementById("selectTime").value;
        var re = new RegExp("^[ ]+$");
        if (selectTime == "" || selectTime == null || re.test(selectTime)) {
            alert("查询条件不能为空");
            return false;
        }

        var data = new Array(2);
        var ul = document.getElementById("tab");
        var lis = ul.getElementsByTagName("li");

        //查看按钮判断是否可以继续向下执行
        for (var i = 0; i < lis.length; i++) {
            if (lis[i].hasAttribute("class")) {

                data[0] = lis[i].innerHTML
                break
            }

        }

        data[1] = selectTime
        return data;
    }

}


//确定li的索引对应的url--ajax发送异步请求的时候需要用到
function confirmUrl() {

    var urlArray = new Array()
    urlArray[0] = "getOperateData"  //流失率


    return urlArray[getIndex2()]
}


//在发送ajax请求之情做的清理工作
function sendAjaxContenClear() {
    //删除表格内容
    $('#trParent').html("")
}


//这里发送ajax请求
function sendAjaxRequet() {
    sendAjaxContenClear()//发送异步请求时,所要做的清理工作

    var arr = getInfo()
    if (!arr) {
        return
    }

    /*
     * 这里是向游戏服务器发送请求，请求获取到数据
     * */
    var partUrl = confirmUrl()
    var url = "/" + partUrl


    var selectTime = arr[1];

    data = {"selectTime": selectTime}
    var nickArr = new Array();//玩家昵称
    var idsArr = new Array();//玩家id
    var OpArr = new Array();//操作人
    var dateArr = new Array();//操作时间
    var OpContentArr = new Array();//状态列表


    $.post(url, data, function (res) {
        var tmp = JSON.parse(res)
        if(tmp.length==0){
            alert("查询的当天数据为空....");
            return
        }

        $.each(tmp, function (n, value) {
            nickArr[n] = value.RecName;
            idsArr[n] = value.RecId;
            OpArr[n] = value.Name;
            dateArr[n] = value.Time;
            OpContentArr[n] = value.Content;

            addForm(value.RecName, value.RecId, value.Name, value.Time, value.Content)
        });

    });


}


/*  向表中添加节点---  这是用在三个表头内容一样的情况下使用的
 *  向表中添加数据-- 根据选中的li来判断 生成的列数
 * */

// addForm(value.UserNickName, value.UserId, value.Op, value.OpTime, value.OpContent)
function addForm(UserNickName, UserId, Op, OpTime, OpContent) {

    var parent = document.getElementById("trParent")
    var tr1 = document.createElement("tr")
    var td1 = document.createElement("td")
    var td2 = document.createElement("td")
    var td3 = document.createElement("td")
    var td4 = document.createElement("td")
    var td5 = document.createElement("td")
    td1.innerHTML = UserNickName
    td2.innerHTML = UserId
    td3.innerHTML = Op
    td4.innerHTML = OpTime
    td5.innerHTML = OpContent
    tr1.appendChild(td1)
    tr1.appendChild(td2)
    tr1.appendChild(td3)
    tr1.appendChild(td4)
    tr1.appendChild(td5)
    parent.appendChild(tr1)

}

