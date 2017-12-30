//启用查看按钮
function StartLook() {

    document.getElementById("startLook").disabled = false;//这里设置的是禁用“下载”按钮，当点击“查看”的时候,启用这个按钮
}


//单选按钮--更改日期输入框的事件绑定函数
function updateDateOption() {

    /*
     *
     * 根据选中的  "周""月"
     * 显示为前面的输入框，选择不用的日历挂件
     * */
    var radioValue = gertRadioValue()
    var liIndex = getIndex2() + 1


    //清空表和统计图
    var trParentIndex = '#trParent' + liIndex;
    $(trParentIndex).html("")
    $('#main1').html("");//清空统计图


    var beginTimeId = "beginTime" + liIndex //获取选中的lide id
    var beginTimeName = "beginTime" + liIndex//创建input的名字
    //var insertIdIndex="insertId"+liIndex//单选按钮的id,创建的元素要在这个元素之前

    var insertIndex = '#insertId' + liIndex;
    var tmpStr = '#' + beginTimeId
    $(tmpStr).remove();

    if (radioValue == "2") {
        var nodeInfo = "<input type='text' id='" + beginTimeId + "' name='" + beginTimeName + "' onclick='setmonth(this)'>&nbsp;&nbsp;"
    } else {
        var nodeInfo = "<input type='text' id='" + beginTimeId + "' name='" + beginTimeName + "' onclick='WdatePicker()'>&nbsp;&nbsp;"

    }

    var $input = $(nodeInfo)//创建节点
    $input.insertBefore($(insertIndex))//插入节点
}

//更改li,绑定的单击事件,默认就是绑定日的
function bindDateOption() {
    var tagName = "beginTime" + (getIndex2() + 1)
    var beginTime = document.getElementById(tagName)
    beginTime.onclick = function () {

        WdatePicker();


    }

}

/* 清空页面,然后禁用按钮 */
function clearContent() {
    var liIndex = getIndex2() + 1;
    var begIndex = '#beginTime' + liIndex;
    var trParentIndex = '#trParent' + liIndex;
    var downIndex = '#downloadId' + liIndex;
    var trParentIndex = '#trParent' + liIndex

    //清空数据和设置按钮禁用属性
    $(begIndex).val("");
    $(trParentIndex).html("");
    $(downIndex).removeAttr("disabled");

    $(trParentIndex).html("")

    $('#main1').html("")//清空折线图


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


}

$(function () {
    window.onload = function () {

        //清理页面冗余数据

        $li = $('#tab li')
        $li.click(function () {


            $this = $(this); //获取点击获取的对象

            $liIndex = $this.index(); //获取点击的序号
            clearContent($liIndex)
            //创建页面元素的操作


            var sonIndex = '#son' + (parseInt($liIndex) + 1) //找出选中的表格的序号

            $(sonIndex).show().siblings('.table-wrap').hide()  //选中的表格显示,其他的表格隐藏

            var formIndex = '#form' + (parseInt($liIndex) + 1) //找出选中的时间表单的序号

            $(formIndex).show().siblings().hide()  //选中的表格显示,其他的表格隐藏

            for (var i = 0; i < $li.length; i++) {
                $li[i].removeAttribute("class")
            }
            $this.addClass('current')
            bindDateOption()//设置时间选择按钮的属性

        });
    }
});


/*  获取选中的单选框的值 */
function gertRadioValue() {

    var tagName = "date" + (getIndex2() + 1)
    var radios = document.getElementsByName(tagName)
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked == true) {
            return radios[i].value
        }
    }
}

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
 2 单选按钮的值

 --根据li的索引,判断生成的data数组的长度 */
function getInfo() {

    var data;
    var tmpIndex = getIndex2() + 1;
    var liIndex = "beginTime" + tmpIndex
    var beginTime = document.getElementById(liIndex).value;
    //查看按钮判断是否可以继续向下执行
    if (beginTime == "" || beginTime == null) {

        var downIdIndex = "downloadId" + (getIndex2() + 1)
        document.getElementById(downIdIndex).disabled = true//未选择日期,无法使用下载按钮
        alert("必须选择日期啊")
        return false
    }

    //对输入时间的合法性进行校验
    var b1=checkDateForm(beginTime);
    if (!b1){
        alert("输入的时间格式不对,请重新输入");
        return
    }


    if (tmpIndex == 4) {
        data = new Array(2);
        var ul = document.getElementById("tab")
        var lis = ul.getElementsByTagName("li")

        for (var i = 0; i < lis.length; i++) {
            if (lis[i].hasAttribute("class")) {

                data[0] = lis[i].innerHTML
                break
            }

        }
        data[1] = beginTime
        return data


    }

    data = new Array(3);
    var index = getIndex2()//获取选中的li的值

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
    data[2] = radioValue

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
    urlArray[0] = "toPeakValue"  //在线峰值
    urlArray[1] = "toDayAvgUserCount"//日均在线用户数
    urlArray[2] = "toDayAvgOnlineTime"//日均在线时长
    urlArray[3] = "toSingleOnlineTime"//单次使用时长分布
    return urlArray[getIndex2()]
}


//设置全局变量，用来保存获取到的数据--下载的时候用到的。
var col1 = new Array() //保存日期
var col2 = new Array()//流失用户数量
var col3 = new Array()//流失率
var clo4 = new Array()//流失账户信息
var col5 = new Array() //流失用户的uid信息
var col6 = new Array() //流失用户的手机号
var col7 = new Array() //流失用户的手机号


//在发送ajax请求之情做的清理工作
function sendAjaxContenClear() {
    trParentIndex = "trParent" + (getIndex2() + 1)

    //启用下载按按钮
    document.getElementById(trParentIndex).disabled = false
    col1 = ""
    col2 = ""
    col3 = ""
    //删除表格内容
    var trParentIndex = '#trParent' + (getIndex2() + 1)
    $(trParentIndex).html("")
}


//这里发送ajax请求
function sendAjaxRequet() {


    sendAjaxContenClear()//发送ajax的清理工作

    var arr = getInfo()
    if (!arr) {
        return
    }
    var beginTime = arr[1];
    var liIndex = getIndex2() + 1;

    if (liIndex == "4") {
        //日:不能选择当天
        var sysDay = getCurDateString()//2017-d07-01
        if (arr[1] == sysDay) {
            alert("当天数据不能查询")
            return
        }
    } else {
        /*
         * 因为:当天数据可以求完整的,也可以求不完整的,
         * 所以当点击“日”的时候，不用对日期进行判断
         * 只需要对月份进行判断
         *
         * 当月数据:
         *   月份不能超过当前月份
         *
         * */

        //sysMonth=getCurMonthString()
        //if(arr[1]>sysMonth){
        //    alert("选择月份不能超过当前月份")
        //    return
        //
        //}

    }


    var partUrl = confirmUrl()

    var url = "/" + partUrl
    if (partUrl != "toSingleOnlineTime") {
        var radioValue = arr[2];
        data = {"beginTime": beginTime, "radioValue": radioValue}

        var dateArr = new Array() //保存时间
        var countArr = new Array()//保存每个时间对用的
        $.post(url, data, function (res) {
            var tmp = JSON.parse(res)
            $.each(tmp, function (n, value) {
                dateArr[n] = value.Date;
                countArr[n] = value.Count;

                addForm(value.Date, value.Count)
            });
            if (countArr.length == 0) {//这里表示查询的数据为空的时候，不创建折线图

                alert("查询的  " + arr[1] + " 的  " + arr[0] + "  不存在!!!")
                $('#main1').html("")//清空折线图
                return
            }

            drawZheXianImg(dateArr, countArr)


        });

    } else {//单次使用时长分布

        data = {"beginTime": beginTime}

        var dateArr = new Array()
        var countArr = new Array(7)
        $.post(url, data, function (res) {
            var tmp = JSON.parse(res)
            $.each(tmp, function (n, value) {
                dateArr[n] = value.Date
                countArr[0] = value.S1;
                countArr[1] = value.S2;
                countArr[2] = value.S3;
                countArr[3] = value.M1;
                countArr[4] = value.M2;
                countArr[5] = value.M3;
                countArr[6] = value.M4;
                addForm(value.Date, countArr)


            });

            drawSingleOnlineTime(countArr)
        });
    }

}


//这里发送ajax请求 --日均在线用户数和在线时长
function sendAjaxRequet2() {
    sendAjaxContenClear()//发送ajax的清理工作
    var liIndex = getIndex2() + 1  //获取选中的li的值

    var radioValue = gertRadioValue() //获取按钮的值
    var arr = getInfo()
    var beginTime;//保存的是周一的数据


    if (radioValue == "1") {
        //判断当前日期是否是周一
        var weekIndex = convertDateFromString(arr[1]).getDay()

        if (weekIndex != 1) {
            alert("选择的日期不是周一,请重新选择");
            $('#main1').html("");
            return
        }

        var beginWeekIndex = getWeekNumber(arr[1])

        var sysDay = getCurDateString()
        var sysWeekIndex = getWeekNumber(sysDay)
        if (sysWeekIndex == beginWeekIndex) {
            alert("当周数据不能查询");
            $('#main1').html("");
            return
        }


        beginTime = arr[1]  //这里的beginTime就是周索引


    } else if (radioValue == 0) {
        //日:不能选择当天
        var sysDay = getCurDateString()//2017-d07-01
        if (arr[1] == sysDay) {
            alert("当天数据不能查询");
            $('#main1').html("");
            return
        }
        beginTime = arr[1]
    } else {
        var sysMonth = getCurMonthString()
        if (arr[1] == sysMonth) {
            alert("当月数据不能查询");
            $('#main1').html("");
            return
        }
        beginTime = arr[1]
    }


    var partUrl = confirmUrl()

    var url = "/" + partUrl

    var radioValue = arr[2];

    data = {"beginTime": beginTime, "radioValue": radioValue}

    var dateArr = new Array()
    var countArr = new Array()
    $.post(url, data, function (res) {
        var tmp = JSON.parse(res)
        $.each(tmp, function (n, value) {
            dateArr[n] = value.Date;
            countArr[n] = value.Count;
            addForm(value.Date, value.Count)
        });

        drawZheXianImg(dateArr, countArr)


    });


}

/*    保存文件到本地 */
function download() {
    //1、获取数据
    //数据保存在全局变量定义的数组中col1,col2,col3
    var exportContent = "\uFEFF";

    var blob = ""
    var line = ""
    //2、解析数据
    for (var i = 0; i < col1.length; i++) {
        line = line + col1[i] + "," + col2[i] + "," + col3[i] + "%" + "\r\n"

    }
    blob = new Blob([exportContent + line], {type: "text/plain;charset=utf-8"});
    //3、实现下载
    saveAs(blob, "hello world.csv");
    //下面的操作是清空保存全局变量的数组
    col1 = ""
    col2 = ""
    col3 = ""

}


/*  向表中添加节点---  这是用在三个表头内容一样的情况下使用的
 *  向表中添加数据-- 根据选中的li来判断 生成的列数
 * */
function addForm(dateArr, CountArr) {
    var index = getIndex2() + 1; //选中的li的索引值+1


    if (index != 4) {

        var trParentIndex = "trParent" + index
        var parent = document.getElementById(trParentIndex)
        var tr1 = document.createElement("tr")
        var td1 = document.createElement("td")
        var td2 = document.createElement("td")
        td1.innerHTML = dateArr
        td2.innerHTML = CountArr
        tr1.appendChild(td1)
        tr1.appendChild(td2)
        parent.appendChild(tr1)
    } else {
        var parent = document.getElementById("trParent4")
        var tr1 = document.createElement("tr")
        var td1 = document.createElement("td")
        var td2 = document.createElement("td")
        var td3 = document.createElement("td")
        var td4 = document.createElement("td")
        var td5 = document.createElement("td")
        var td6 = document.createElement("td")
        var td7 = document.createElement("td")
        var td8 = document.createElement("td")

        var sum = parseInt(0);
        for (var i = 0; i < CountArr.length; i++) {

            sum = sum + CountArr[i];

        }


        td1.innerHTML = dateArr
        if (sum == 0) {//这里添加判断的原因是如果这一天没有人登录，在页面上显示的数据全部都是0
            alert("当天无人登录");//方案一：直接弹出提示，说明当天没有人登录。
            return
            //td2.innerHTML="0%"//方案二：就是没有提示框,直接在页面显示0%
            //td2.innerHTML= "0%"
            //td3.innerHTML="0%"
            //td4.innerHTML="0%"
            //td5.innerHTML="0%"
            //td6.innerHTML="0%"
            //td7.innerHTML="0%"
            //td8.innerHTML="0%"
        } else {
            td2.innerHTML = Math.round(CountArr[0] / sum * 100) + "%"
            td3.innerHTML = Math.round(CountArr[1] / sum * 100) + "%"
            td4.innerHTML = Math.round(CountArr[2] / sum * 100) + "%"
            td5.innerHTML = Math.round(CountArr[3] / sum * 100) + "%"
            td6.innerHTML = Math.round(CountArr[4] / sum * 100) + "%"
            td7.innerHTML = Math.round(CountArr[5] / sum * 100) + "%"
            td8.innerHTML = Math.round(CountArr[6] / sum * 100) + "%"
        }


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

}


/*
 -------------柱状图----------
 * @param dataArr  表示的是日期数组
 * @param countArr  表示的是数量数组
 *
 * 单次使用时长分布。。。。
 *
 * */


function drawSingleOnlineTime(countArr) {

    //创建元素
    createEle()

    var myChart = echarts.init(document.getElementById('main1'));

    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '单次使用时长分布'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}:\n{c}%'
        },
        legend: {
            data: ['百分比']
        },
        //横坐标
        xAxis: {
            data: ["1-10秒", "11-30秒", "31-60秒", "1-3分", "3-10分", "10-30分", "30+"]
        },
        yAxis: {},
        series: [{
            name: '百分比',
            type: 'bar',
            data: countArr
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}


/*
 * @dataArr  表示横坐标的日期
 * @countArr  表示纵坐标对应的数值
 * */

//在线峰值、日均在线用户数、日均在线时长
function drawZheXianImg(dateArr, countArr) {

    //创建元素
    createEle()

    var myChart = echarts.init(document.getElementById('main1'));
    var res = getInfo()

    // 指定图表的配置项和数据
    // 指定图表的配置项和数据
    option = {
        title: {
            text: res[0],

        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: [res[0]]
        },
        toolbox: {
            show: false,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {

            type: 'category',
            boundaryGap: false,
            data: dateArr,
            axisLabel: {
                interval: 0,
                rotate: 15,//45度角倾斜显示
            }
        },
        yAxis: [
            {
                name: res[0],
                type: 'value',
                axisLabel: {
                    formatter: '{value}人'
                }
            },
        ],

        series: [
            {
                name: res[0],
                type: 'line',
                yAxisIndex: 0,
                data: countArr
            },

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


    div.innerHTML = ( " " + res[1] + " " + res[0])


    body.appendChild(div)
}
