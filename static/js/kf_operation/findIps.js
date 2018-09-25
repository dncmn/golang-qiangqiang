/* 清空页面,然后禁用按钮 */
function clearContent() {
    //清空数据和设置按钮禁用属性
    $('#selectTime').val("");
    $('#selectTime2').val("");
    $('#selectName').val("");
    $('#main1').html("");
    var liIndex=getIndex2()+1;
    var trParentIndex='#trParent'+liIndex;

    $(trParentIndex).html("")
}
$(function () {
    window.onload = function () {


        $li = $('#tab li')
        $li.click(function () {


            $this = $(this); //获取点击获取的对象

            $liIndex = $this.index(); //获取点击的序号

            if ($liIndex == 1) {


                $('#son1').hide();  //不同的表格的显示和隐藏
                $('#son2').show();

                $('#form2').show();
                $('#form1').hide();


            } else {

                $('#son2').hide();
                $('#son1').show();

                $('#form1').show();
                $('#form2').hide();

            }

            for (var i = 0; i < $li.length; i++) {
                $li[i].removeAttribute("class")
            }
            $this.addClass('current')
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

    if (liIndex==1){
        var selectTime = document.getElementById("selectTime").value;
        if (selectTime == "" || selectTime == null) {
            alert("时间不能为空");
            return false;
        }

        var data=new Array(2);
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
    var selectTime = document.getElementById("selectTime2").value;
    var selectName = document.getElementById("selectName").value;
    var re = new RegExp("^[ ]+$");
    if (selectTime == "" || selectTime == null || selectName=="" || selectName==null || re.test(selectName)) {
        alert("查询条件不能为空");
        return false;
    }

    var checkIpStr = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    var reg = selectName.match(checkIpStr);
    if (reg == null) {
        alert("IP地址不合法！");
        return false;
    }




    var data=new Array(3);
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

    data[2]=selectName;

    return data;


}


//确定li的索引对应的url--ajax发送异步请求的时候需要用到
function confirmUrl() {

    var urlArray = new Array()
    urlArray[0] = "allIpLogin"  //流失率
    urlArray[1] = "singleIpLogin"//流失玩家信息
    return urlArray[getIndex2()]
}


//设置全局变量，用来保存获取到的数据--下载的时候用到的。
var col1 = new Array() //保存日期
var col2 = new Array()//流失用户数量
var col3 = new Array()//流失率
var clo4 = new Array()//流失账户信息


//在发送ajax请求之情做的清理工作
function sendAjaxContenClear() {

    var liIndex = getIndex2() + 1
    //启用下载按按钮

    col1 = ""
    col2 = ""
    col3 = ""
    //删除表格内容
    var trParentIndex = '#trParent' + liIndex
    $(trParentIndex).html("")
}


//这里发送ajax请求
function sendAjaxRequet() {
    sendAjaxContenClear()//发送异步请求时,所要做的清理工作

    var arr = getInfo()
    if (!arr) {
        return
    }
    var partUrl = confirmUrl()
    var url = "/" + partUrl
    if (partUrl == "allIpLogin") {//同IP登录
        var selectTime = arr[1];

        data = {"selectTime": selectTime}
        var dateArr = new Array()
        var countArr = new Array()
        $.post(url, data, function (res) {
            var tmp = JSON.parse(res)
            $.each(tmp, function (n, value) {
                dateArr[n] = value.Ip;
                countArr[n] = value.GameCount;
                addForm(value.Ip, value.GameCount)
            });

        });
    }

    if (partUrl == "singleIpLogin") { //IP查询
        var selectTime = arr[1];
        var selectName = arr[2];
        data = {"selectTime": selectTime, "selectName": selectName}
        var nameArr = new Array();
        var idArr = new Array();
        var gamecountArr = new Array();
        var moneyCountArr = new Array();

        $.post(url, data, function (res) {
            var tmp = JSON.parse(res)
            $.each(tmp, function (n, value) {
                nameArr[n] = value.UserName;
                idArr[n] = value.UserId;
                gamecountArr[n] = value.GameCount;
                moneyCountArr[n] = value.UserCoin;
                addForm(value.UserName, value.UserId, value.GameCount, value.UserCoin)
            });

        });
    }


}


/*  向表中添加节点---  这是用在三个表头内容一样的情况下使用的
 *  向表中添加数据-- 根据选中的li来判断 生成的列数
 * */
function addForm(dateArr, CountArr, RateArr, phoneNum) {
    var index = getIndex2();


    if (index == 0) {
        var parent = document.getElementById("trParent1")
        var tr1 = document.createElement("tr")
        var td1 = document.createElement("td")
        var td2 = document.createElement("td")
        td1.innerHTML = dateArr
        td2.innerHTML = CountArr
        tr1.appendChild(td1)
        tr1.appendChild(td2)
        parent.appendChild(tr1)
    } else {
        var parent = document.getElementById("trParent2")
        var tr1 = document.createElement("tr")
        var td1 = document.createElement("td")
        var td2 = document.createElement("td")
        var td3 = document.createElement("td")
        var td4 = document.createElement("td")
        td1.innerHTML = dateArr
        td2.innerHTML = CountArr
        td3.innerHTML = RateArr
        td4.innerHTML = phoneNum
        tr1.appendChild(td1)
        tr1.appendChild(td2)
        tr1.appendChild(td3)
        tr1.appendChild(td4)
        parent.appendChild(tr1)
    }

}

