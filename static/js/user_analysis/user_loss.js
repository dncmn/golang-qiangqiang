//启用查看按钮
function StartLook() {
    document.getElementById("startLook").disabled = false;//这里设置的是禁用“下载”按钮，当点击“查看”的时候,启用这个按钮
}


//单选按钮--更改日期输入框的事件绑定函数
function updateDateOption() {

    var select = document.getElementById("procId");
    var options = select.options;
    options[0].selected=true;
    $('#procId').attr({"disabled":"disabled"});

    //清空表数据和统计图
    var liIndex=getIndex2()+1;
    var trParentIndex='#trParent'+liIndex
    $(trParentIndex).html("")//清空表格
    $('#main1').html("");//清空统计图


    /*
     *
     * 根据选中的  "周""月"
     * 显示为前面的输入框，选择不用的日历挂件
     * */
    var radioValue = gertRadioValue()


    $('#beginTime').remove();//清除之前的表格
    $('#endTime').remove();

    if (radioValue == "1") {
        var beginNodeInfo = "<input type='text' id='beginTime' name='beginTime' onclick='setmonth(this)'>&nbsp;&nbsp;"
        var endNodeInfo = "<input type='text' id='endTime' name='endTime' onclick='setmonth(this)'>&nbsp;&nbsp;"

    } else {
        var beginNodeInfo = "<input type='text' id='beginTime' name='beginTime'  onclick='WdatePicker()'>&nbsp;&nbsp;"
        var endNodeInfo = "<input type='text' id='endTime' name='endTime'  onclick='WdatePicker()'>&nbsp;&nbsp;"
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
    $('#endTime').val("")
    $('#main1').html("")
    $('#trParent1').html("")
    $('#trParent2').html("")
    document.getElementById("downloadId").disabled = true;//这里设置的是禁用“下载”按钮，当点击“查看”的时候,启用这个按钮
    var radios = document.getElementsByName("date")
    for (var i = 0; i < radios.length; i++) {
        radios[0].checked = true//默认选择第一个按钮

    }

    var body = document.getElementById("parentBody")
    if (document.getElementById("tagMark")) {
        var div = document.getElementById("tagMark")
        body.removeChild(div)
    }

    var radioValue = gertRadioValue()


    $('#beginTime').remove();//清除之前的输入框
    $('#endTime').remove();

    if (radioValue == 1) {
        var beginNodeInfo = "<input type='text' id='beginTime' name='beginTime' onclick='setmonth(this)'>&nbsp;&nbsp;"
        var endNodeInfo = "<input type='text' id='endTime' name='endTime' onclick='setmonth(this)'>&nbsp;&nbsp;"



    } else {

        var beginNodeInfo = "<input type='text' id='beginTime' name='beginTime'  onclick='WdatePicker()'>&nbsp;&nbsp;"
        var endNodeInfo = "<input type='text' id='endTime' name='endTime'  onclick='WdatePicker()'>&nbsp;&nbsp;"


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
            var select = document.getElementById("procId")
            if ($liIndex == 1) {


                select.style.display = ""//显示下拉列表
                select.options[0].selected = true
                //获取select的option的值  select.options[0].value
                $('#son1').hide();  //显示选择的时间
                $('#son2').show();
                $('#procId').attr({"disabled":"disabled"})

            } else {
                select.style.display = "none"
                $('#son2').hide();
                $('#son1').show();
            }

            for (var i = 0; i < $li.length; i++) {
                $li[i].removeAttribute("class")
            }
            $this.addClass('current')

        });
    }
});


/*  获取选中的单选框的值 */
function gertRadioValue() {
    var radios = document.getElementsByName("date")
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

//获取选中的option的值
function getOptionValue() {
    var select = document.getElementById("procId");
    var options = select.options;
    for (var i = 0; i < options.length; i++) {
        if (options[i].selected) {
            return options[i].value
            break
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


    var beginTime = document.getElementById("beginTime").value;
    var endTime = document.getElementById("endTime").value;

    var data = new Array(4);
    var liIndex = getIndex2()+1; //获取选中的li的值
    var ul = document.getElementById("tab");
    var lis = ul.getElementsByTagName("li");
    var radioValue = gertRadioValue();//获取单选按钮的值

    //查看按钮判断是否可以继续向下执行
    if (beginTime == "" || beginTime == null || endTime == "" || endTime == null) {

        //这里下来列表要选中第一个
        var select = document.getElementById("procId");
        var options = select.options;
        options[0].selected=true
        alert("开始时间必须是周一,结束日期必须是周日");
        return false;
    }


    //对输入时间的合法性进行校验
    var b1=checkDateForm(beginTime);
    var b2=checkDateForm(endTime);
    if ((b1+b2)==0 ||(b1+b2)==1){
        alert("输入的时间格式不对,请重新输入");
        return
    }

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
    div.style.height = "500px";
    div.setAttribute("id", "main1")
    body.appendChild(div)
}


//确定li的索引对应的url--ajax发送异步请求的时候需要用到
function confirmUrl() {

    var urlArray = new Array()
    urlArray[0] = "toLossRate"  //流失率
    urlArray[1] = "toLossMemberInfo"//流失玩家信息
    return urlArray[getIndex2()]
}


//设置全局变量，用来保存获取到的数据--下载的时候用到的。
var col1 = new Array() //保存日期
var col2 = new Array()//流失用户数量
var col3 = new Array()//流失率
var clo4 = new Array()//流失账户信息


//发送显示表格的异步请求
function showSingleInfo() {
    //清空表格
    $('#trParent').html("")
    $('#trParent2').html("")

    //启用下载按按钮
    document.getElementById("downloadId").disabled = false
    col1 = ""
    col2 = ""
    col3 = ""

    var arr = getInfo()

    if(!arr){
        return

    }

    var beginTime = arr[1];
    var endTime = arr[2];
    var radioValue = arr[3];
    var optionValue = getOptionValue()


    var url = "/toShowSingleInfo"


    data = {"beginTime": beginTime, "endTime": endTime, "radioValue": radioValue, "selectOption": optionValue}

    var dateArr = new Array()
    var accountArr = new Array()
    var uidArr = new Array()
    var phoneArr = new Array()
    $.post(url, data, function (res) {
        var tmp = JSON.parse(res)
        $.each(tmp, function (n, value) {
            dateArr[n] = value.Date;
            accountArr[n] = value.Account;
            uidArr[n] = value.Uid;
            phoneArr[n] = value.PhoneNumber;
            addForm(value.Date, value.Account, value.Uid, value.PhoneNumber) //添加表单信息
        });

        col1 = dateArr
        col2 = accountArr
        col3 = uidArr
        col4 = phoneArr


    });


}

//在发送ajax请求之情做的清理工作
function sendAjaxContenClear() {

    var liIndex=getIndex2()+1
    //启用下载按按钮
    var downloadIndex='#downloadId'+liIndex
    $(downloadIndex).removeAttr("disabled")
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
    //document.getElementById("procId").disabled = false;//这里设置的是禁用“下载”按钮，当点击“查看”的时候,启用这个按钮
    $('#procId').removeAttr("disabled")

    var arr = getInfo()
    if(!arr){
        return
    }
    var beginTime = arr[1];
    var endTime = arr[2];
    var radioValue = arr[3];


    var partUrl = confirmUrl()
    var url = "/" + partUrl

    if (partUrl == "toLossRate") { //流失率
        if (radioValue != "1") {//发送周请求
            var data = isMonAndSun(arr[1], arr[2])
            data = {
                "beginTime": beginTime,
                "endTime": endTime,
                "beginWeekIndex": data[0],//开始的周索引
                "endWeekIndex": data[1],//结束的周索引
                "radioValue": radioValue
            }

            var dateArr = new Array()
            var countArr = new Array()
            var rateArr = new Array()
            $.post(url, data, function (res) {
                var tmp = JSON.parse(res)
                $.each(tmp, function (n, value) {
                    dateArr[n] = value.Date;
                    countArr[n] = value.Count;
                    rateArr[n] = value.Rate;
                    addForm(value.Date, value.Count, value.Rate)
                });


                drawZhuZhuangAndZheXianImg(dateArr, countArr, rateArr)
                col1 = dateArr
                col2 = countArr
                col3 = rateArr

            });
        } else {//发送流失率的月请求


            data = {"beginTime": beginTime, "endTime": endTime, "radioValue": radioValue}

            var dateArr = new Array()
            var RateArr = new Array()
            var countArr = new Array()
            $.post(url, data, function (res) {
                var tmp = JSON.parse(res)
                $.each(tmp, function (n, value) {
                    dateArr[n] = value.Date
                    RateArr[n] = value.Rate;
                    countArr[n] = value.Count;
                    addForm(value.Date, value.Count, value.Rate)
                });

                drawZhuZhuangImg(RateArr, countArr)
            });
        }
    } else {//流失账户信息
        if (radioValue != "1") {//发送流失账户的周请求
            var data = isMonAndSun(arr[1], arr[2])
            data = {
                "beginTime": beginTime,
                "endTime": endTime,
                "beginWeekIndex": data[0],//开始的周索引
                "endWeekIndex": data[1],//结束的周索引
                "radioValue": radioValue
            }

            var dateArr = new Array()
            var countArr = new Array()
            var rateArr = new Array()
            var dateArr = new Array()
            var procArr = new Array()
            var countArr = new Array()
            $.post(url, data, function (res) {
                var tmp = JSON.parse(res)
                $.each(tmp, function (n, value) {
                    dateArr[n] = value.Date
                    procArr[n] = value.Proc;
                    countArr[n] = value.Count;
                });

                drawZhuZhuangImg(procArr, countArr)
            });

        } else {//发送月请求


            data = {"beginTime": beginTime, "endTime": endTime, "radioValue": radioValue}

            var dateArr = new Array()
            var procArr = new Array()
            var countArr = new Array()
            $.post(url, data, function (res) {
                var tmp = JSON.parse(res)
                $.each(tmp, function (n, value) {
                    dateArr[n] = value.Date
                    procArr[n] = value.Proc;
                    countArr[n] = value.Count;
                });

                drawZhuZhuangImg(procArr, countArr)
            });
        }
    }


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
        return
    }

    var beginWeekIndex = getWeekNumber(beginTime)

    //判断结束日期是不是周日
    var isSunDay = convertDateFromString(endTime).getDay()

    if (isSunDay != 0) {
        alert("结束时间选择的日期不是周日,请重新选择")
        return
    }

    endweekIndex = getWeekNumber(endTime)  //这里的beginTime就是周索引

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
function addForm(dateArr, CountArr, RateArr, phoneNum) {
    var index = getIndex2();


    if (index == 0) {
        var parent = document.getElementById("trParent1")
        var tr1 = document.createElement("tr")
        var td1 = document.createElement("td")
        var td2 = document.createElement("td")
        var td3 = document.createElement("td")
        td1.innerHTML = dateArr
        td2.innerHTML = CountArr
        td3.innerHTML = RateArr + "%"
        tr1.appendChild(td1)
        tr1.appendChild(td2)
        tr1.appendChild(td3)
        parent.appendChild(tr1)
    } else {
        var parent = document.getElementById("trParent2")
        var tr1 = document.createElement("tr")
        var td1 = document.createElement("td")
        var td2 = document.createElement("td")
        var td3 = document.createElement("td")
        //var td4 = document.createElement("td")
        td1.innerHTML = dateArr
        td2.innerHTML = CountArr
        td3.innerHTML = RateArr
        //td4.innerHTML = phoneNum
        tr1.appendChild(td1)
        tr1.appendChild(td2)
        tr1.appendChild(td3)
        //tr1.appendChild(td4)
        parent.appendChild(tr1)
    }

}

/*
 * @dataArr  表示横坐标的日期
 * @countArr  表示纵坐标对应的数值
 * */

//历史每日充值额和历史每日充值用户数量
function drawZhuZhuangAndZheXianImg(dateArr, countArr, rateArr) {


    //创建元素
    createEle()

    var myChart = echarts.init(document.getElementById('main1'));
    var res = getInfo()


    var colors = ['#5793f3', '#675bba'];

    option = {
        color: colors,

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            formatter:'日期:{b0}<br>'+
            '流失用户:{c0}<br>'+
            '流失率:{c1}%'

        },
        grid: {
            right: '20%'
        },
        legend: {
            data: ['数量', '留存率']
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                data: dateArr,
                axisLabel: {
                    interval: 0,
                    rotate: 30,//30度角倾斜显示
                }
            }
        ],
        yAxis: [

            {
                type: 'value',
                name: '数量',
                position: 'left',
                axisLine: {
                    lineStyle: {
                        color: colors[1]
                    }
                },
                axisLabel: {
                    formatter: '{value} 人'
                }
            },
            {
                type: 'value',
                name: '流失率',
                position: 'right',
                axisLine: {
                    lineStyle: {
                        color: colors[0]
                    }
                },
                axisLabel: {
                    formatter: '{value}% '
                }
            },
        ],
        series: [
            {
                name: '数量',
                type: 'bar',
                yAxisIndex: 0,
                data: countArr
            },

            {
                name: '留存率',
                type: 'line',
                yAxisIndex: 1,
                data: rateArr
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

    if (res[2] == null || res[2] == "") {
        div.innerHTML = ("--" + " " + res[1] + " " + res[0])
    } else {
        div.innerHTML = ("--" + " " + res[1] + " 到" + res[2] + " " + res[0])
    }

    body.appendChild(div)

}

/*
 -------------柱状图----------
 * @param dataArr  表示的是日期数组
 * @param countArr  表示的是数量数组
 *
 *
 * */


function drawZhuZhuangImg(procArr, countArr) {

    //创建元素
    createEle()

    var myChart = echarts.init(document.getElementById('main1'));

    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '流失用户数量'
        },
        tooltip: {},
        legend: {
            data: ['用户数量']
        },
        //横坐标
        xAxis: {
            data: procArr,
            axisLabel: {
                interval: 0,
                rotate: 30,//30度角倾斜显示
            }
        },
        yAxis: {},
        series: [{
            name: '用户数量',
            type: 'bar',
            data: countArr
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}