//单选按钮--更改日期输入框的事件绑定函数
function updateDateOption() {

    var liIndex = getIndex2() + 1
    //清空表格
    var trParentIndex = '#trParent' + liIndex
    $(trParentIndex).html("")
    //清空统计图
    $('#main1').html("")

    //禁用下载按钮
    var downloadIndex = '#downloadId' + liIndex
    $(downloadIndex).attr({"disabled": "disabled"})

    //清空全局变量保存的数据
    col1 = "";
    col1 = "";
    col1 = "";
    col1 = "";

    /*
     *
     * 根据选中的  "周""月"
     * 显示为前面的输入框，选择不用的日历挂件
     * */
    var radioValue = gertRadioValue()

    var beginTimeId = "beginTime" + liIndex //获取选中的lide id
    var beginTimeName = "beginTime" + liIndex//创建input的名字

    var insertIndex = '#insertId' + liIndex;
    var tmpStr = '#' + beginTimeId
    $(tmpStr).remove();

    if (radioValue == "2" || radioValue == "0") {
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
        setmonth(this);
    }

}

/* 清空页面,然后禁用按钮 */
function clearContent() {
    //清空全局变量保存的数据
    col1 = "";
    col1 = "";
    col1 = "";
    col1 = "";

    var liIndex = getIndex2() + 1;
    //
    //清空数据和设置按钮禁用属性
    var beginTimeStr = '#beginTime' + liIndex;


    $(beginTimeStr).val("");

    $('#main1').html("");

    var trParentIndex = 'trParent' + liIndex; //清空表格
    $(trParentIndex).html("");

    var downloadIdIndex = 'downloadId' + liIndex;

    document.getElementById(downloadIdIndex).disabled = true;//这里设置的是禁用“下载”按钮，当点击“查看”的时候,启用这个按钮

    var radioIndex = "date" + liIndex
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
    var trParentIndex = '#trParent' + liIndex
    $(trParentIndex).html("")


}

$(function () {
    window.onload = function () {

        //清理页面冗余数据

        $li = $('#tab li')
        $li.click(function () {


            $this = $(this); //获取点击获取的对象

            $liIndex = $this.index(); //获取点击的序号
            clearContent()
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
            //alert(radios[i].value);
            //return
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
    var tmpIndex = getIndex2() + 1;//获取点钟的li的索引值

    var liIndex = "beginTime" + tmpIndex;
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

    var data = new Array(3);
    var lis = document.getElementsByTagName("li")


    for (var i = 0; i < lis.length; i++) {
        if (lis[i].hasAttribute("class")) {
            data[0] = lis[tmpIndex - 1].innerHTML
            break
        }
    }

    data[1] = beginTime
    data[2] = gertRadioValue()
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
    div.style.width = "1500px";
    div.style.height = "700px";
    div.setAttribute("id", "main1")
    body.appendChild(div)
}


//确定li的索引对应的url--ajax发送异步请求的时候需要用到
function confirmUrl() {

    var urlArray = new Array()
    urlArray[0] = "toPayUser";//付费用户
    urlArray[1] = "toPayIocome";//付费收入
    urlArray[2] = "toPayRate";//付费率
    urlArray[3] = "toNewPayUser";//新增付费用户


    return urlArray[getIndex2()];
}


//设置全局变量，用来保存获取到的数据--下载的时候用到的。
//对应的li                      付费用户    付费收入       付费率     新增付费用户
var col1 = new Array() //      保存日期      日期         日期          日期
var col2 = new Array()//       付费用户数量   安卓         付费率      新增付费用户
var col3 = new Array()//       付费率         IOS                    新增用户
var clo4 = new Array()//       流失账户信息    付费总收入


//在发送ajax请求之情做的清理工作
function sendAjaxContenClear() {
    trParentIndex = "trParent" + (getIndex2() + 1)

    //启用下载按按钮
    document.getElementById(trParentIndex).disabled = false
    col1 = ""
    col2 = ""
    col3 = ""
    col4 = ""
    //删除表格内容
    var trParentIndex = '#trParent' + (getIndex2() + 1)
    $(trParentIndex).html("")
}
//付费用户
function sendAjaxRequest() {


    sendAjaxContenClear()//发送ajax的清理工作
    var liIndex = getIndex2() + 1  //获取选中的li的值

    var radioValue = gertRadioValue() //获取按钮的值
    var arr = getInfo()
    if (!arr) {
        return
    }
    var beginWeekIndex;//保存周索引


    if (radioValue == "1") {  //单选按钮选择周
        //判断当前日期是否是周一
        var weekDay = convertDateFromString(arr[1]).getDay()

        if (weekDay != 1) {
            alert("选择的日期不是周一,请重新选择")
            $('#main1').html("")
            return
        }
        beginWeekIndex = getWeekNumber(arr[1])  //这里的beginTime就是周索引
        data = {"beginTime": arr[1], "beginWeekIndex": beginWeekIndex, "radioValue": radioValue}


    } else {  //这里要判断选择的月份是否超出当前月份

        beginTime = arr[1] //输入框选择的时间
        var currentMonthIndex = getCurMonthString()
        if (beginTime > currentMonthIndex) {
            alert("选择的日期超过了当前月份,请重新选择")
            return
        }

        data = {"beginTime": beginTime, "radioValue": radioValue}
    }

    var partUrl = confirmUrl()

    var url = "/" + partUrl

    //付费用户
    if (partUrl == "toPayUser") {
        var dateArr = new Array()
        var countArr = new Array()
        var rateArr = new Array()

        $.post(url, data, function (res) {
            var tmp = JSON.parse(res)
            $.each(tmp, function (n, value) {
                dateArr[n] = value.Date;
                countArr[n] = value.PayUser;
                rateArr[n] = value.PayRate;

                addForm(value.Date, value.PayUser, value.PayRate);
            });

            if(countArr.length==0){
                alert("查询数据为空")
                $('#main1').html("")
                return
            }

            drawZhuZhuangAndZheXianImg(dateArr, countArr, rateArr);
            col1 = dateArr;
            col2 = countArr;
            col3 = rateArr;


        });
    }
    //付费收入
    if (partUrl == "toPayIocome") {
        var dateArr = new Array()
        var AnzArr = new Array()
        var IosArr = new Array()
        var totalArr = new Array()


        $.post(url, data, function (res) {

            var tmp = JSON.parse(res)

            $.each(tmp, function (n, result) {



                dateArr[n] = result.Date;
                AnzArr[n] = result.Anz;
                IosArr[n] = result.Ios;
                totalArr[n] = result.Anz + result.Ios;


                addForm(result.Date, result.Anz, result.Ios);
            });

            if (totalArr==0){
                alert("所查询的数据为空....");
                $('#main1').html("");
                $('#tagMark').html("");
                return
            }


            drawDoubleZhuZhuangImg(dateArr, AnzArr, IosArr, totalArr);
            col1 = dateArr;
            col2 = AnzArr;
            col3 = IosArr;
            col4 = totalArr;


        });

    }

    //付费率
    if (partUrl == "toPayRate") {

        var dateArr = new Array()
        var countArr = new Array()
        var rateArr = new Array()

        $.post(url, data, function (res) {
            var tmp = JSON.parse(res)
            $.each(tmp, function (n, value) {
                dateArr[n] = value.Date;
                countArr[n] = value.PayUserCount;
                rateArr[n] = value.PayRate;

                //柱状图的时候,不显示付费用户
                addForm(value.Date, value.PayUserCount, value.PayRate)//这里的value.PayUserCount并不起作用
            });


            if(countArr.length==0){
                alert("查询的数据为空");

                $('#main1').html("");
                $('#tagMark').html("");
                return
            }

            //画统计图的时候,显示付费用户
            drawPayRateImg(dateArr, countArr, rateArr)//这里的countArr用来显示付费用户数量
            col1 = dateArr;
            col2 = rateArr;
        });
    }

    //新增付费用户
    if (partUrl == "toNewPayUser") {

        //付费率

        var dateArr = new Array()
        var payUserArr = new Array()
        var newPayUserArr = new Array()

        $.post(url, data, function (res) {
            var tmp = JSON.parse(res)
            $.each(tmp, function (n, value) {
                dateArr[n] = value.Date;
                payUserArr[n] = value.PayUser;
                newPayUserArr[n] = value.NewLogin;


                //柱状图的时候,不显示付费用户
                addForm(value.Date, value.PayUser, value.NewLogin)
            });
            alert("payUserArr.length="+payUserArr.length+"  newPayUserArr.length="+newPayUserArr.length);
            if(payUserArr.length==0 && newPayUserArr.length==0){
                alert("所查询的数据为空");
                $('#main1').html("");
                $('#tagMark').html("");
                return
            }
            //画统计图的时候,显示付费用户
            drawNewPayUserImg(dateArr, payUserArr,newPayUserArr)//这里的countArr用来显示付费用户数量
            col1 = rateArr;
            col2 = countArr;
            col3 = rateArr;


        });


    }

    //启用下载按钮
    var downloadIndex = '#downloadId' + liIndex;
    $(downloadIndex).removeAttr("disabled");


}

/*    保存付费用户数据 */
function download1() {
    //1、获取数据
    //数据保存在全局变量定义的数组中col1,col2,col3
    var exportContent = "\uFEFF";

    var blob = ""
    var line = "付费用户\r\n日期,付费用户,付费率\r\n"
    //2、解析数据
    for (var i = 0; i < col1.length; i++) {
        line = line + col1[i] + "," + col2[i] + "," + col3[i] + "%" + "\r\n"

    }
    blob = new Blob([exportContent + line], {type: "text/plain;charset=utf-8"});
    //3、实现下载
    saveAs(blob, "pay_user.csv");
    //下面的操作是清空保存全局变量的数组
    col1 = ""
    col2 = ""
    col3 = ""

}
/*    付费收入 */
function download2() {
    //1、获取数据
    //数据保存在全局变量定义的数组中col1,col2,col3
    var exportContent = "\uFEFF";

    var blob = ""
    var line = "付费收入\r\n日期,安卓,IOS,付费总收入\r\n"
    //2、解析数据
    for (var i = 0; i < col1.length; i++) {
        line = line + col1[i] + "," + col2[i] + "," + col3[i] + "," + col4[i] + "\r\n"

    }
    blob = new Blob([exportContent + line], {type: "text/plain;charset=utf-8"});
    //3、实现下载
    saveAs(blob, "pay_incomes.csv");
    //下面的操作是清空保存全局变量的数组
    col1 = ""
    col2 = ""
    col3 = ""
    col4 = ""

}
/*    保存付费率 */
function download3() {
    //1、获取数据
    //数据保存在全局变量定义的数组中col1,col2,col3
    var exportContent = "\uFEFF";

    var blob = ""
    var line = "付费率\r\n日期,付费率\r\n"
    //2、解析数据
    for (var i = 0; i < col1.length; i++) {
        line = line + col1[i] + "," + col2[i] + "%" + "\r\n"

    }
    blob = new Blob([exportContent + line], {type: "text/plain;charset=utf-8"});
    //3、实现下载
    saveAs(blob, "pay_rate.csv");
    //下面的操作是清空保存全局变量的数组
    col1 = ""
    col2 = ""
}
/*    保存新增付费用户 */
function download4() {
    //1、获取数据
    //数据保存在全局变量定义的数组中col1,col2,col3
    var exportContent = "\uFEFF";

    var blob = ""
    var line = "新增付费用户\r\n日期,新增付费用户,新增用户\r\n"
    //2、解析数据
    for (var i = 0; i < col1.length; i++) {
        line = line + col1[i] + "," + col2[i] + "," + col3[i] + "\r\n"

    }
    blob = new Blob([exportContent + line], {type: "text/plain;charset=utf-8"});
    //3、实现下载
    saveAs(blob, "new_pay_user.csv");
    //下面的操作是清空保存全局变量的数组
    col1 = ""
    col2 = ""
    col3 = ""

}


/*  向表中添加节点---  这是用在三个表头内容一样的情况下使用的
 *  向表中添加数据-- 根据选中的li来判断 生成的列数
 * */
function addForm(dateArr, CountArr, RateArr) {
    var index = getIndex2() + 1; //选中的li的索引值+1


    if (index == 1) {

        var trParentIndex = "trParent" + index
        var parent = document.getElementById(trParentIndex)
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
    }
    if (index == 2) {
        var parent = document.getElementById("trParent2")
        var tr1 = document.createElement("tr")
        var td1 = document.createElement("td")
        var td2 = document.createElement("td")
        var td3 = document.createElement("td")
        var td4 = document.createElement("td")
        td1.innerHTML = dateArr
        td2.innerHTML = CountArr
        td3.innerHTML = RateArr
        td4.innerHTML = CountArr + RateArr
        tr1.appendChild(td1)
        tr1.appendChild(td2)
        tr1.appendChild(td3)
        tr1.appendChild(td4)
        parent.appendChild(tr1)
    }

    if (index == 3) {
        var trParentIndex = "trParent" + index
        var parent = document.getElementById(trParentIndex)
        var tr1 = document.createElement("tr")
        var td1 = document.createElement("td")
        var td2 = document.createElement("td")
        td1.innerHTML = dateArr
        td2.innerHTML = RateArr + "%"
        tr1.appendChild(td1)
        tr1.appendChild(td2)
        parent.appendChild(tr1)
    }

    if (index == 4) {
        var trParentIndex = "trParent" + index
        var parent = document.getElementById(trParentIndex)
        var tr1 = document.createElement("tr")
        var td1 = document.createElement("td")
        var td2 = document.createElement("td")
        var td3 = document.createElement("td")
        td1.innerHTML = dateArr
        td2.innerHTML = CountArr //新增付费用户
        td3.innerHTML = RateArr //付费用户
        tr1.appendChild(td1)
        tr1.appendChild(td2)
        tr1.appendChild(td3)
        parent.appendChild(tr1)
    }

}

/*
 * @dataArr  表示横坐标的日期
 * @countArr  表示纵坐标对应的数值
 * */

//付费用户
function drawZhuZhuangAndZheXianImg(dateArr, countArr, rateArr) {


    //创建元素
    createEle()

    var myChart = echarts.init(document.getElementById('main1'));
    var res = getInfo()

    // 指定图表的配置项和数据
    // 指定图表的配置项和数据
    var colors = ['#5793f3', '#675bba'];

    option = {
        color: colors,

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            formatter:'日期:{b0}<br>'+
            '付费用户:{c0}<br>'+
            '付费率:{c1}%'
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


    div.innerHTML = ( res[1]  + " " + res[0])


    body.appendChild(div)

}


/*
 *       付费收入的统计图
 *       一个横坐标,两跟柱状图
 * */
function drawDoubleZhuZhuangImg(dateArr, countArr, rateArr, sumArr) {
    //创建元素
    createEle()

    var myChart = echarts.init(document.getElementById('main1'));
    var res = getInfo()

    // 指定图表的配置项和数据
    // 指定图表的配置项和数据
    var colors = ['#5793f3', '#675bba'];

    // 指定图表的配置项和数据

    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            },
            formatter: function (data) {
                return data[0].name
                    + "<br/>" + data[0].seriesName + ":" + data[0].value
                    + "<br/>"
                    + data[1].seriesName + ":" + data[1].value + "<br/>"
                    + "总收入:" + (data[0].value + data[1].value)

            }
        },
        legend: {
            data: ['安卓', 'IOS']
        },
        xAxis: [
            {
                type: 'category',
                data: dateArr,
                axisPointer: {
                    type: 'shadow'
                },
                axisLabel: {
                    interval: 0,
                    rotate: 30,//30度角倾斜显示
                }
            }
        ],
        yAxis: {
            type: 'value',
            name: '数量',
            interval: 400,
            axisLabel: {
                formatter: '{value} 万'
            }
        },
        series: [

            {
                name: '安卓',
                type: 'bar',
                data: countArr
            },
            {
                name: 'IOS',
                type: 'bar',
                data: rateArr
            }
        ]
    };

    myChart.setOption(option);


    var body = document.getElementById("parentBody")
    if (document.getElementById("tagMark")) {
        var div = document.getElementById("tagMark")
        body.removeChild(div)
    }
    var div = document.createElement("div")
    div.setAttribute("id", "tagMark")

    div.innerHTML = ( res[1]  + " " + res[0])

    body.appendChild(div)
}

//付费率
function drawPayRateImg(dateArr, countArr, rateArr) {
    //创建元素
    createEle()

    var myChart = echarts.init(document.getElementById('main1'));
    var res = getInfo()

    // 指定图表的配置项和数据

    option = {
        title: {
            text: '付费率',

        },
        tooltip: {
            trigger: 'axis',
            formatter: function (data) {


                return data[0].name
                    + "<br/>" + data[0].seriesName + ":" + data[0].value + "%"
                    + "<br/>"
                    + "付费用户:" + countArr[data[0].dataIndex]


            }
        },
        legend: {
            data: ['付费率']
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
                name: "付费率",
                type: 'value',
                axisLabel: {
                    formatter: '{value}%'
                }
            },
        ],

        series: [
            {
                name: "付费率",
                type: 'line',
                yAxisIndex: 0,
                data: rateArr
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

    div.innerHTML = ( res[1]  + " " + res[0])

    body.appendChild(div)
}


function drawNewPayUserImg(dateArr, payUserArr,newPayUser) {
//创建元素

    var res = getInfo()


    //创建元素
    createEle()

    var myChart = echarts.init(document.getElementById('main1'));

    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '历史每日充值额'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            formatter: function (data) {


                return data[0].name
                    + "<br/>"
                    + "新增付费用户:" + payUserArr[data[0].dataIndex]
                    + "<br/>"
                    + "       新增用户:" + newPayUser[data[0].dataIndex]


            }

        },
        legend: {
            data: ['用户数量']
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
            name: '用户数量',
            type: 'bar',
            data: payUserArr
        }]
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

    div.innerHTML = ( res[1]  + " " + res[0])

    body.appendChild(div)

}