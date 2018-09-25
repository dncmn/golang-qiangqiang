//单选按钮--更改日期输入框的事件绑定函数
function updateDateOption() {


    //清空表格
    $('#trParent').html("")
    //清空统计图
    $('#main1').html("")
    //禁用下载按钮
    $('#downloadId').attr({"disabled": "disabled"})

    var radioValue = gertRadioValue()


    $('#beginTime').remove();//清除之前的输入框
    $('#endTime').remove();

    if (radioValue == 1) {
        var beginNodeInfo = "<input type='text' id='beginTime' name='beginTime1' onclick='setmonth(this)'>&nbsp;&nbsp;"
        var endNodeInfo = "<input type='text' id='endTime' name='endTime1' onclick='setmonth(this)'>&nbsp;&nbsp;"


    } else {

        var beginNodeInfo = "<input type='text' id='beginTime' name='beginTime1'  onclick='WdatePicker()'>&nbsp;&nbsp;"
        var endNodeInfo = "<input type='text' id='endTime' name='endTime1'  onclick='WdatePicker()'>&nbsp;&nbsp;"

    }


    var $beginInput = $(beginNodeInfo)//创建节点
    var $enInput = $(endNodeInfo)//创建节点

    $('#beginSpan').after($beginInput)//追加节点
    $('#endSpan').after($enInput)//追加节点

}
/* 清空页面,然后禁用按钮 */
function clearContent() {
    //清空数据和设置按钮禁用属性
    $('#beginTime').val("")

    $('#main1').html("")
    $('#trParent').html("")

    $('#downloadId').attr({"disabled": "disabled"})//禁用下载按钮


    var radios = document.getElementsByName("date")
    for (var i = 0; i < radios.length; i++) {
        radios[0].checked = true//默认选择第一个按钮

    }


    var body = document.getElementById("parentBody")
    if (document.getElementById("tagMark")) {
        var div = document.getElementById("tagMark")
        body.removeChild(div)
    }

    //删除表格内容
    $('#trParent').html("")

    var radioValue = gertRadioValue()


    $('#beginTime').remove();//清除之前的输入框
    $('#endTime').remove();

    if (radioValue == 1) {
        var beginNodeInfo = "<input type='text' id='beginTime' name='beginTime1' onclick='setmonth(this)'>&nbsp;&nbsp;"
        var endNodeInfo = "<input type='text' id='endTime' name='endTime1' onclick='setmonth(this)'>&nbsp;&nbsp;"


    } else {

        var beginNodeInfo = "<input type='text' id='beginTime' name='beginTime1'  onclick='WdatePicker()'>&nbsp;&nbsp;"
        var endNodeInfo = "<input type='text' id='endTime' name='endTime1'  onclick='WdatePicker()'>&nbsp;&nbsp;"

    }


    var $beginInput = $(beginNodeInfo)//创建节点
    var $enInput = $(endNodeInfo)//创建节点

    $('#beginSpan').after($beginInput)//追加节点
    $('#endSpan').after($enInput)//追加节点

}

$(function () {
    window.onload = function () {


        $li = $('#tab li')
        $li.click(function () {

            clearContent()
            $this = $(this); //获取点击获取的对象

            $liIndex = $this.index(); //获取点击的序号


            for (var i = 0; i < $li.length; i++) {
                $li[i].removeAttribute("class")
            }
            $this.addClass('current')


        });
    }
});


/*  获取选中的li的文本值 */
function getInfo() {
    var tmpIndex = getIndex2() + 1;//获取点钟的li的索引值


    var beginTime = document.getElementById("beginTime").value;
    var endTime = document.getElementById("endTime").value;

    //查看按钮判断是否可以继续向下执行
    if (beginTime == "" || beginTime == null ||endTime=="" || endTime==null) {
        document.getElementById("downloadId").disabled = true//未选择日期,无法使用下载按钮
        alert("必须选择日期啊")
        return false
    }

    //对输入时间的合法性进行校验
    var b1=checkDateForm(beginTime);
    var b2=checkDateForm(endTime);
    if ((b1+b2)==0 ||(b1+b2)==1){
        alert("输入的时间格式不对,请重新输入");
        return false
    }


    var data = new Array(4);
    var lis = document.getElementsByTagName("li")


    for (var i = 0; i < lis.length; i++) {
        if (lis[i].hasAttribute("class")) {
            data[0] = lis[tmpIndex - 1].innerHTML
            break
        }

    }

    data[1] = beginTime
    data[2] = endTime
    data[3] = gertRadioValue()


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
    div.style.height = "500px";
    div.setAttribute("id", "main1")
    body.appendChild(div)
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

//确定li的索引对应的url--ajax发送异步请求的时候需要用到
function confirmUrl() {

    var urlArray = new Array()
    urlArray[0] = "toNewAddUser"
    urlArray[1] = "toActiveUser"
    urlArray[2] = "toHistoryUser"
    return urlArray[getIndex2()]
}


//设置全局变量，用来保存获取到的数据
var col1 = new Array() //保存日期
var col2 = new Array()//保存数量


/*  测试选中的单选框的值 */
function gertRadioValue() {
    var radios = document.getElementsByName("date")
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked == true) {
            return radios[i].value
        }
    }
}

function clearSendAjaxContent() {
    //发送异步请求之前，清空全局变量的数据
    col1 = ""
    col2 = ""
    //清空表单数据
    $('#trParent').html("")
    //启用下载按按钮
    document.getElementById("downloadId").disabled = false
    document.getElementById("startLook").disabled = false


    //删除节点及其下边的注释
    var body = document.getElementById("parentBody")
    if (document.getElementById("main1")) {
        var div = document.getElementById("main1")
        body.removeChild(div)
        var tagMark = document.getElementById("tagMark");
        body.removeChild(tagMark);
    }
}


//这里发送ajax请求
function sendAjaxRequet() {
    clearSendAjaxContent()

    var data = getInfo();
    if (!data) {
        return
    }

    //获取数据
    var beginTime = data[1];
    var endTime = data[2];


    //选择日时,开始时间不能小于结束时间
    if (beginTime > endTime) {
        alert("开始时间不能小于结束时间")
        return
    }

    var liIndex = getIndex2() + 1;
    if (liIndex == 2) {   //这里是对活跃用户进行设置
        var sysMonth = getCurMonthString()//获取系统当前的月份
        var radioValue = data[3];

        if (radioValue == "0") {
            var sysDay = getCurDateString();
            if (beginTime == sysDay || endTime == sysDay) {
                alert("当天数据不能查询");
                return
            }
        }

        if (radioValue == "1") {
            if (beginTime > sysMonth || (beginTime < sysMonth && endTime > sysMonth)) {
                alert("开始时间或者结束时间超过当前月份");
                return
            }


            if (beginTime == sysMonth || endTime == sysMonth) {
                alert("当前月份不能查询");
                return
            }
        }


    }

    if (liIndex == 3) {//这里指的是游戏的开服时间--这里需要单独设置
        //beginTime==""
    }


    if (data[3] == "1") {//选择月份,那么beginTime代表"2017-01",endTime代表"2017-06"
        //获取当前日期的年月
        var sysMonthDate = getCurMonthString()
        if (beginTime > sysMonthDate) {
            alert("开始时间超过系统当前月份")
            return
        }
        if (beginTime < sysMonthDate && endTime > sysMonthDate) {
            alert("结束时间超出当前月份")
            return
        }
    }


    var dateTag = gertRadioValue()

    var partUrl = confirmUrl()

    if (partUrl == "toHistoryUser") {
        var url = "/" + partUrl

        data = {"beginTime": beginTime, "endTime": endTime, "tagValue": dateTag}

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
            col1 = dateArr   //这两个数组清空,是在选择不同的li的是时候
            col2 = countArr
        });

    } else {
        var url = "/" + partUrl

        data = {"beginTime": beginTime, "endTime": endTime, "tagValue": dateTag}

        var dateArr = new Array()
        var countArr = new Array()

        $.post(url, data, function (res) {
            var tmp = JSON.parse(res)
            $.each(tmp, function (n, value) {
                dateArr[n] = value.Date;
                countArr[n] = value.Count;

                addForm(value.Date, value.Count)
            });


            drawZhuZhuangImg(dateArr, countArr)
            col1 = dateArr
            col2 = countArr
        });
    }


}


/*    保存文件到本地 */
function download(dateArr, countArr, rateArr) {
    //1、获取数据
    //数据保存在全局变量定义的数组中col1,col2,col3
    var exportContent = "\uFEFF";

    var blob = ""
    var line = ""
    //2、解析数据
    for (var i = 0; i < col1.length; i++) {
        line = line + col1[i] + "," + col2[i] + "\r\n"

    }
    blob = new Blob([exportContent + line], {type: "text/plain;charset=utf-8"});
    //3、实现下载
    saveAs(blob, "hello world.csv");
    //下面的操作是清空保存全局变量的数组
    col1 = ""
    col2 = ""
    col3 = ""

}


/*  向表中添加节点---  这是用在三个表头内容一样的情况下使用的  */
function addForm(dateArr, CountArr, RateArr) {
    var parent = document.getElementById("trParent")
    var tr1 = document.createElement("tr")
    var td1 = document.createElement("td")
    var td2 = document.createElement("td")
    td1.innerHTML = dateArr
    td2.innerHTML = CountArr
    tr1.appendChild(td1)
    tr1.appendChild(td2)
    parent.appendChild(tr1)
}

/*
 -------------柱状图----------
 * @param dataArr  表示的是日期数组
 * @param countArr  表示的是数量数组
 *
 *
 * */


function drawZhuZhuangImg(dateArr, countArr) {
    var data = getInfo()

    if (!data) {
        return
    }

    //创建元素
    createEle()

    var myChart = echarts.init(document.getElementById('main1'));

    // 指定图表的配置项和数据
    var option = {
        title: {
            text: data[0]
        },
        tooltip: {},
        legend: {
            data: [data[0]]
        },
        //横坐标
        xAxis: {
            data: dateArr,
            axisLabel: {
                interval: 0,
                rotate: 30,//30度角倾斜显示
            }
        },
        yAxis: {},
        series: [{
            name: data[0],
            type: 'bar',
            data: countArr
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    var res = getInfo()
    var body = document.getElementById("parentBody")
    if (document.getElementById("tagMark")) {
        var div = document.getElementById("tagMark")
        body.removeChild(div)
    }
    var div = document.createElement("div")
    div.setAttribute("id", "tagMark")


    div.innerHTML = ( +res[1] + "到" + res[2] + "的" + data[0])


    body.appendChild(div)
}


/*
 -------------折线图----------
 * @dataArr  表示横坐标的日期
 * @countArr  表示纵坐标对应的数值
 * */


function drawZheXianImg(dateArr, countArr, rateArr) {


    //创建元素
    createEle()

    var myChart = echarts.init(document.getElementById('main1'));
    var res = getInfo()
    if (!res) {
        return
    }

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
            data: ['历史用户数量']
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
                rotate: 30,//30度角倾斜显示
            }
        },
        yAxis: [
            {
                name: "历史用户数量",
                type: 'value',
                axisLabel: {
                    formatter: '{value}人'
                }
            },
        ],

        series: [
            {
                name: "历史用户数量",
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


    div.innerHTML = ( +res[1] + "到" + res[2] + "的" + res[0])


    body.appendChild(div)

}
