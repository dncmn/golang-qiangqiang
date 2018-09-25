//单选按钮--更改日期输入框的事件绑定函数
function updateDateOption() {


    //清空表格
    $('#trParent1').html("")
    //清空统计图
    $('#main1').html("")
    //禁用下载按钮
    $('#downloadId1').attr({"disabled":"disabled"})


    /*
     *
     * 根据选中的  "周""月"
     * 显示为前面的输入框，选择不用的日历挂件
     * */
    var radioValue = gertRadioValue()


    $('#beginTime1').remove();//清除之前的输入框
    $('#endTime1').remove();

    if (radioValue == 2) {
        var beginNodeInfo = "<input type='text' id='beginTime1' name='beginTime1' onclick='setmonth(this)'>&nbsp;&nbsp;"
        var endNodeInfo = "<input type='text' id='endTime1' name='endTime1' onclick='setmonth(this)'>&nbsp;&nbsp;"


    } else {

        var beginNodeInfo = "<input type='text' id='beginTime1' name='beginTime1'  onclick='WdatePicker()'>&nbsp;&nbsp;"
        var endNodeInfo = "<input type='text' id='endTime1' name='endTime1'  onclick='WdatePicker()'>&nbsp;&nbsp;"

    }


    var $beginInput = $(beginNodeInfo)//创建节点
    var $enInput = $(endNodeInfo)//创建节点

    $('#beginSpan').after($beginInput)//追加节点
    $('#endSpan').after($enInput)//追加节点

}


/* 清空页面,然后禁用按钮 */
function clearContent(liIndex) {
    //清空数据和设置按钮禁用属性
    $('#beginTime1').val("")

    $('#main1').html("")
    $('#trParent1').html("")

    $('#downloadId1').attr({"disabled": "disabled"})//禁用下载按钮


    var radioIndex = "date" + (getIndex2() + 1)
    var radios = document.getElementsByName(radioIndex)
    for (var i = 0; i < radios.length; i++) {
        radios[0].checked = true//默认选择第一个按钮

    }


    var body = document.getElementById("parentBody")
    if (document.getElementById("tagMark")) {
        var div = document.getElementById("tagMark")
        body.removeChild(div)
    }

    //删除表格内容
    $('#trParent1').html("")

}


/*  获取选中的单选框的值 */
function gertRadioValue() {


    var radios = document.getElementsByName("date1")
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked == true) {

            return radios[i].value
        }
    }
}


/*  获取数据
 0 li的文本值
 1 开始时间
 2 结束时间
 3 单选按钮的值


 --根据li的索引,判断生成的data数组的长度 */
function getFormInfo() {

    var beginTime = document.getElementById("beginTime1").value;
    var endTime = document.getElementById("endTime1").value;
    //查看按钮判断是否可以继续向下执行
    if (beginTime == "" || beginTime == null  || endTime=="" || endTime==null) {

        document.getElementById("downloadId1").disabled = true//未选择日期,无法使用下载按钮
        alert("必须选择日期啊")
        return
    }


    //对输入时间的合法性进行校验
    var b1=checkDateForm(beginTime);
    var b2=checkDateForm(endTime);
    if ((b1+b2)==0 ||(b1+b2)==1){
        alert("输入的时间格式不对,请重新输入");
        return false
    }

    var data = new Array(4);

    var ul = document.getElementById("tab")
    var lis = ul.getElementsByTagName("li")
    var radioValue = gertRadioValue()//获取单选按钮的值


    for (var i = 0; i < lis.length; i++) {
        if (lis[i].hasAttribute("class")) {
            data[0] = lis[i].innerHTML
            break
        }

    }

    data[1] = beginTime
    data[2] = endTime
    data[3] = radioValue

    return data
}

//创建容纳统计图的div节点
function createEle() {
    var body = document.getElementById("parentBody")
    if (document.getElementById("main1")) {
        var div = document.getElementById("main1")
        body.removeChild(div)
    }

    var div = document.createElement("div")
    div.style.width = "auto";
    div.style.height = "700px";
    div.setAttribute("id", "main1")
    body.appendChild(div)
}


//确定li的索引对应的url--ajax发送异步请求的时候需要用到
function confirmUrl() {

    var urlArray = new Array()
    urlArray[0] = "toPayHabit"  //在线峰值

    return urlArray[0]
}


//设置全局变量，用来保存获取到的数据--下载的时候用到的。
var downDateArr = new Array() //保存日期
var downAppleArr = new Array()//苹果
var downWeiXinArr = new Array()//微信
var clo4 = new Array()//支付宝


//在发送ajax请求之情做的清理工作
function sendAjaxContenClear() {


    //启用下载按按钮
    document.getElementById("trParent1").disabled = false
    downDateArr = ""
    downAppleArr = ""
    downWeiXinArr = ""
    downZhiFuBaoArr = ""
    //删除表格内容
    $('#trParent1').html("")

}


//这里发送ajax请求
function sendAjaxRequest() {

    sendAjaxContenClear()//发送ajax的清理工作
    var arr = getFormInfo()

    if(!arr){
        return
    }

    var beginTime = arr[1];
    var endTime = arr[2];
    var partUrl = confirmUrl()

    var url = "/" + partUrl

    var dateArr = new Array()
    var appleArr = new Array()
    var WxArr = new Array()
    var ZfArr = new Array()

    var   data = {
        "beginTime": beginTime,
        "endTime": endTime,
        "radioValue": gertRadioValue()
    }

    if (gertRadioValue() == 1) {//发送周请求
        var weekIndexs = isMonAndSun(arr[1], arr[2]) //判断这周开始和结束日期是不是周一或者周日

        if (!weekIndexs) {
            return
        }


        $.post(url, data, function (res) {
            var tmp = JSON.parse(res)
            $.each(tmp, function (n, value) {
                dateArr[n] = value.Date;
                appleArr[n] = value.App;
                WxArr[n] = value.Wx;
                ZfArr[n] = value.Zfb;
                addForm(appleArr, WxArr, ZfArr)
            });
            drawBingZhuangImg(appleArr, WxArr, ZfArr)
            downDateArr = dateArr
            downAppleArr = appleArr
            downWeiXinArr = WxArr
            downZhiFuBaoArr = ZfArr
            $('#downloadId1').removeAttr("disabled")


        });

    } else {
        //查看查询日期是否包含当前日期
        if (gertRadioValue() == 0) {//发送查数据的日请求
            var curDay = getCurDateString()
            if (endTime == curDay) {
                alert("不能查询当天数据,请重新选择")
                return
            }
        } else {//判断选择月份有没有不是当月的
            if (!checkIsOutofMonth("habit", beginTime, endTime)) {
                return
            }

        }



        $.post(url, data, function (res) {
            var tmp = JSON.parse(res)
            $.each(tmp, function (n, value) {
                dateArr[n] = value.Date;
                appleArr[n] = value.App;
                WxArr[n] = value.Wx;
                ZfArr[n] = value.Zfb;

                addForm(appleArr, WxArr, ZfArr)

            });
            drawBingZhuangImg(appleArr, WxArr, ZfArr)
            downDateArr = dateArr
            downAppleArr = appleArr
            downWeiXinArr = WxArr
            downZhiFuBaoArr = ZfArr
            $('#downloadId1').removeAttr("disabled")



        });



    }


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
 * */
function addForm(appleArr, WxArr, ZfArr) {
    var sum1 = 0;
    var sum2 = 0;
    var sum3 = 0;

    for (var i = 0; i < appleArr.length; i++) {
        sum1 = sum1 + appleArr[i];
    }
    for (var i = 0; i < WxArr.length; i++) {
        sum2 = sum2 + WxArr[i];
    }
    for (var i = 0; i < ZfArr.length; i++) {
        sum3 = sum3 + ZfArr[i];
    }

    var arr = getFormInfo();
    var sum = sum1 + sum2 + sum3;
    var parent = document.getElementById("trParent1")

    var tr1 = document.createElement("tr")
    var td1 = document.createElement("td")
    var td2 = document.createElement("td")
    var td3 = document.createElement("td")
    var td4 = document.createElement("td")

    if(sum==0){
        //alert("所查询的数据为空.....");//可以不再表单中显示数据，但是需要额外添加不显示统计图的代码。
        //return
        td2.innerHTML=sum1;
        td3.innerHTML=sum2;
        td4.innerHTML=sum3;
    }else{
        td2.innerHTML = sum1 + "(" + (parseInt(sum1 / sum * 100)) + "%)"
        td3.innerHTML = sum2 + "(" + (parseInt(sum2 / sum * 100)) + "%)"
        td4.innerHTML = sum3 + "(" + (parseInt(sum3 / sum * 100)) + "%)"
    }

    td1.innerHTML = arr[1] + " to " + arr[2]

    tr1.appendChild(td1)
    tr1.appendChild(td2)
    tr1.appendChild(td3)
    tr1.appendChild(td4)
    parent.appendChild(tr1)

}
/* 对开始日期和结束一起进行判断
 * 返回开始和结束周对应的周索引
 * */
function isMonAndSun(beginTime, endTime) {
    var data = new Array(2);
    //判断开始日期是不是周一
    var isMonday = convertDateFromString(beginTime).getDay()

    if (isMonday != 1) {
        alert("开始时间选择的日期不是周一,请重新选择")
        return false
    }

    var beginWeekIndex = getWeekNumber(beginTime)


    //判断结束日期是不是周日
    var isSunDay = convertDateFromString(endTime).getDay()

    if (isSunDay != 0) {
        alert("结束时间选择的日期不是周日,请重新选择")
        return
    }

    endweekIndex = getWeekNumber(endTime);  //这里的beginTime就是周索引

    //获取当前的周数
    //var curWeekIndex=getCurDateString()
    var curWeekIndex = getWeekNumber(getCurDateString())

    if (curWeekIndex == endweekIndex) {
        alert("当周数据不能查询,请重新选择日期")
        return
    }


    //查看开始开始日期和结束日期的差值  days=0,表示查询的是同一周,否则就是差值的天数
    var days = (endweekIndex - beginWeekIndex)
    if (days < 0) {
        alert("结束一起必须大于开始日期,请重新选择")
        return
    }

    data[0] = beginWeekIndex
    data[1] = endweekIndex
    return data;

}


/*
 *
 * @countArr  表示对应占的数量
 * */

//付费习惯
function drawBingZhuangImg(appleArr, WxArr, ZfArr) {


    var sum1 = 0;
    var sum2 = 0;
    var sum3 = 0;

    for (var i = 0; i < appleArr.length; i++) {
        sum1 = sum1 + appleArr[i];
    }
    for (var i = 0; i < WxArr.length; i++) {
        sum2 = sum2 + WxArr[i];
    }
    for (var i = 0; i < ZfArr.length; i++) {
        sum3 = sum3 + ZfArr[i];
    }





    //创建元素
    createEle()

    var myChart = echarts.init(document.getElementById('main1'));
    var res = getFormInfo()

    // 指定图表的配置项和数据
    // 指定图表的配置项和数据
    option = {
        title: {
            text: '某站点用户访问来源',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            left: 'left',
            data: ['苹果', '微信', '支付宝']


        },
        series: [
            {
                name: '付费习惯',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    {value: sum1, name: '苹果'},
                    {value: sum2, name: '微信'},
                    {value: sum3, name: '支付宝'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);


    var body = document.getElementById("parentBody")
    if (document.getElementById("tagMark")) {
        var div = document.getElementById("tagMark")
        body.removeChild(div)
    }
    var div = document.createElement("div")
    div.setAttribute("id", "tagMark")


    div.innerHTML =  res[1] + "到" + res[2] +" 的付费习惯"


    body.appendChild(div)
}
