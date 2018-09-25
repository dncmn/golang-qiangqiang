
//设置全局变量，用来保存获取到的数据--下载的时候用到的。
var col1 = new Array() //保存日期
var col2 = new Array()//ARPU值

//单选按钮--更改日期输入框的事件绑定函数
function updateDateOption() {


    //清空表格
    $('#trParent1').html("")
    //清空统计图
    $('#main1').html("")
    //禁用下载按钮
    $('#downloadId1').attr({"disabled":"disabled"});


    /*
     *
     * 根据选中的  "周""月"
     * 显示为前面的输入框，选择不用的日历挂件
     * */
    var radioValue = gertRadioValue()


    $('#beginTime1').remove();//清除之前的输入框
    $('#endTime1').remove();


    //如果是月的话
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


    $('#trParent1').html("")
    $('downloadId1').attr({"disabled":"disabled"});

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
    $('#main1').html("")


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
function getInfo() {

    var beginTime = document.getElementById("beginTime1").value;
    var endTime = document.getElementById("endTime1").value;
    //查看按钮判断是否可以继续向下执行
    if (beginTime == "" || beginTime == null || endTime=="" || endTime==null) {

        $('#downloadId1').attr({"disabled":"disabled"})
        //document.getElementById("downloadId1").disabled = true//未选择日期,无法使用下载按钮
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
    var radioValue = gertRadioValue()//获取单选按钮的值  -//这里获取是2不是周


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
    urlArray[0] = "toPayArpu"  //在线峰值

    return urlArray[0]
}

//在发送ajax请求之情做的清理工作
function sendAjaxContenClear() {

    col1 = ""
    col2 = ""
    //删除表格内容
    $('#trParent1').html("");


}


//这里发送ajax请求
function sendAjaxRequet() {

    sendAjaxContenClear();//发送ajax的清理工作

    var arr = getInfo();

    if(!arr){
        return
    }


    var beginTime = arr[1];
    var endTime = arr[2];

    var partUrl = confirmUrl()

    var url = "/" + partUrl
    if (gertRadioValue() == 1) {//发送周请求
        var data = isMonAndSun(arr[1], arr[2])
        data = {
            "beginTime": beginTime,
            "endTime": endTime,
            "radioValue": gertRadioValue()
        }

        var dateArr = new Array()
        var countArr = new Array()

        $.post(url, data, function (res) {
            var tmp = JSON.parse(res)
            $.each(tmp, function (n, value) {
                dateArr[n] = value.Date;
                countArr[n] = value.Arpu;
                addForm(value.Date, value.Arpu)
            });

            drawZheXianImg(dateArr, countArr)


        });
    } else {
        //查看查询日期是否包含当前日期


        if (gertRadioValue() == 0) {//发送查数据的日请求
            var curDay = getCurDateString()
            if (endTime == curDay) {
                alert("不能查询当天数据,请重新选择")
                return
            }
        } else {//单选按钮是“月”的情况

            if (!checkIsOutofMonth("arpu",beginTime, endTime)) {
                //这里清空表格和统计图
                $('#trParent1').html("")
                $('#main1').html("")

                return
            }

        }

        data = {"beginTime": beginTime, "endTime": endTime, "radioValue": arr[3]}

        var dateArr = new Array()
        var countArr = new Array()


        $.post(url, data, function (res) {
            var tmp = JSON.parse(res)
            $.each(tmp, function (n, value) {
                dateArr[n] = value.Date;
                countArr[n] = value.Arpu;
                addForm(value.Date, value.Arpu)
            });


            drawZheXianImg(dateArr, countArr)


        });



    }

    //将表格数据,保存到全局变量的数组中
    col1 = dateArr
    col2 = countArr
    //启用下载按按钮
    $('#downloadId1').removeAttr("disabled");

}


/*    保存文件到本地 */
function download() {
    //1、获取数据
    //数据保存在全局变量定义的数组中col1,col2,col3
    var exportContent = "\uFEFF";

    var blob = ""
    var line = "ARPU值\r\n日期         RAPU值\r\n"
    //2、解析数据
    for (var i = 0; i < col1.length; i++) {
        line = line + col1[i] + "   " + col2[i] + "\r\n"

    }
    blob = new Blob([exportContent + line], {type: "text/plain;charset=utf-8"});
    //3、实现下载
    saveAs(blob, "ARPU值.csv");
    //下面的操作是清空保存全局变量的数组
    col1 = ""
    col2 = ""
}


/*  向表中添加节点---  这是用在三个表头内容一样的情况下使用的
 *  向表中添加数据-- 根据选中的li来判断 生成的列数
 * */
function addForm(dateArr, countArr) {


    var parent = document.getElementById("trParent1")
    var tr1 = document.createElement("tr")
    var td1 = document.createElement("td")
    var td2 = document.createElement("td")

    td1.innerHTML = dateArr
    td2.innerHTML = countArr


    tr1.appendChild(td1)
    tr1.appendChild(td2)


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
        return false
    }

    endweekIndex = getWeekNumber(endTime);  //这里的beginTime就是周索引

    //获取当前的周数
    //var curWeekIndex=getCurDateString()
    var curWeekIndex = getWeekNumber(getCurDateString())

    if (curWeekIndex == endweekIndex) {
        alert("当周数据不能查询,请重新选择日期")
        return false
    }


    //查看开始开始日期和结束日期的差值  days=0,表示查询的是同一周,否则就是差值的天数
    var days = (endweekIndex - beginWeekIndex)
    if (days < 0) {
        alert("结束一起必须大于开始日期,请重新选择")
        return false
    }

    data[0] = beginWeekIndex
    data[1] = endweekIndex
    return data;

}


/*
 * @dataArr  表示横坐标的日期
 * @countArr  表示纵坐标对应的数值
 * */

//历史每日充值额和历史每日充值用户数量
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
            data: ['ARPU值']
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
                name: "ARPU值",
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                }
            },
        ],

        series: [
            {
                name: "ARPU值",
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


    div.innerHTML =  res[1] + "到" + res[2] +" 的ARPU值"


    body.appendChild(div)
}
