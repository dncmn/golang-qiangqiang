/* 清空页面,然后禁用按钮 */
function clearContent() {

    $('#main1').html("");
    $('#trParent').html("");

    var liIndex=getIndex2()+1;
    if (liIndex==1|| liIndex==2){
        var beginTimeIndex='#beginTime1';
        var endTimeIndex='#endTime1';
    }else{
        var beginTimeIndex='#beginTime2';
        var endTimeIndex='#endTime2';
    }


    $(beginTimeIndex).val("");
    $(endTimeIndex).val("");

    liIndex=liIndex;
    var downloadIndex='#downloadId'+liIndex;
    $(downloadIndex).attr({"disabled":"disabled"})

}
$(function () {
    window.onload = function () {


        $li = $('#tab li')
        $li.click(function () {

            $this = $(this); //获取点击获取的对象

            $liIndex = $this.index(); //获取点击的序号

            if ($liIndex == 2) {

                //清空文本输入框

                $('#form1').hide()  //显示选择的时间
                $('#form2').show()

            } else {
                $('#form2').hide()
                $('#form1').show();
            }

            for (var i = 0; i < $li.length; i++) {
                $li[i].removeAttribute("class")
            }
            $this.addClass('current')
            clearContent()
        });
    }
});

/*  获取数据--
    data[0]:表示li的名字,可以给统计图添加左上角的名字
    data[1]:beginTime
    data[2]:endTime
* */
function getInfo() {

    var data = new Array(3)

    //获取被选中的li的名字
    var ul = document.getElementById("tab")
    var lis = ul.getElementsByTagName("li")

    for (var i = 0; i < lis.length; i++) {
        if (lis[i].hasAttribute("class")) {

            data[0] = lis[i].innerHTML//如果某一个li被选中,就会新添加一个class属性
            var liIndex=i+1;//保存选中的i的序列值
            break
        }

    }

    if (liIndex==1|| liIndex==2){
        var beginTimeIndex='#beginTime1';
        var endTimeIndex='#endTime1';
    }else{
        var beginTimeIndex='#beginTime2';
        var endTimeIndex='#endTime2';
    }

    var beginTime = $(beginTimeIndex).val();
    var endTime = $(endTimeIndex).val()

    //对输入时间是否是空值进行校验
    if( beginTime==""|| beginTime==null || endTime==""|| endTime==null){
        alert("必须选择时间")
        return false
    }

    //对输入时间的合法性进行校验
    var b1=checkDateForm(beginTime);
    var b2=checkDateForm(endTime);
    if ((b1+b2)==0 ||(b1+b2)==1){
        alert("输入的时间格式不对,请重新输入");
        return
    }


    data[1] = beginTime
    data[2] = endTime

    return data

}


//创建容纳统计图的div节点  宽度自适应,高度700px
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
    urlArray[0] = "toDayPreserveUser"
    urlArray[1] = "toWeekPreserveUser"
    urlArray[2] = "toMonthPreserveUser"
    return urlArray[getIndex2()]
}


//设置全局变量，用来保存获取到的数据
var col1 = new Array() //保存日期
var col2 = new Array()//保存数量
var col3 = new Array()//保存留存率


//在发送ajax请求之情做的清理工作
function sendAjaxContenClear(){
    //清空表格
    $('#trParent').html("");

    //删除节点及其下边的注释
    var body = document.getElementById("parentBody")
    if (document.getElementById("main1")) {
        var div = document.getElementById("main1")
        body.removeChild(div)
        var tagMark=document.getElementById("tagMark");
        body.removeChild(tagMark);
    }



    var liIndex=getIndex2()+1;
    var downLoadIndex='#downloadId'+liIndex;
    $(downLoadIndex).removeAttr("disabled");
    col1="";//将异步发送的数据,保存到这个全部变量的数组中,下载的时候可以用到
    col2="";
    col3="";
}

//这里发送ajax请求
function sendAjaxRequet() {
    sendAjaxContenClear();
    var liIndex=getIndex2()+1
    var arr=getInfo()

    if (!arr){
        return
    }


    var beginTime=arr[1]
    var endTime=arr[2]





    /*
    * 进行时间判断,
    *
     如果是次日留存，当天和昨天的没法选择
     时间验证逻辑在isMonAndSun实现了
     如果是七日留存，开始日期必须是周一，结束日期必须是周日,当周的日期不能选择
     如果是30日留存，选择的时间不能超过当月

     选择当月表示不完整数据
     选择之前的月份表示不是当月
    *
    *
    * */


    if(liIndex==1){//次日留存
        var sysDay=getCurDateString()
        if(sysDay==endTime  || sysDay==beginTime){

            //清空统计图和表格
            $('#main1').html("");
            alert("当天数据无法查询");
            return
        }
        if(beginTime>endTime){
            alert("开始日期必须大于结束日期")
            retrun
        }

    }

    if(liIndex==2){//七日留存
       var weekIndexs= isMonAndSun(beginTime,endTime)//返回的是开始和结束日期的周索引
        if(!weekIndexs){
            return
        }
    }


    if(liIndex==3){

        var sysMonth=getCurMonthString()

        if(endTime==sysMonth){
            alert("当前月不能查询,请重新选择")
            return
        }
        if(beginTime>sysMonth || (beginTime<sysMonth  && endTime>sysMonth)){ //判断查询当月的前一个月，那么就是要查询不完整数据,调用monthOperate()函数
            alert("开始月份过大或结束月份超过当前月份")
            return
        }
    }




    var partUrl = confirmUrl()
    var url = "/" + partUrl


    var dateArr = new Array()
    var countArr = new Array()
    var rateArr = new Array()



    if(liIndex==2){
        data = {"beginTime": beginTime, "endTime": endTime,"beginWeekIndex":weekIndexs[0],"endWeekIndex":weekIndexs[1]}
        $.post(url, data, function (res) {
            var tmp = JSON.parse(res)
            $.each(tmp, function (n, value) {
                dateArr[n] = value.Date;
                countArr[n] = value.Count;
                rateArr[n] = value.Rate;
                addForm(value.Date, value.Count, value.Rate)
            });


            UserPreserveImg(dateArr, countArr, rateArr)
            col1 = dateArr
            col2 = countArr
            col3 = rateArr

        });
    }else{
        data = {"beginTime": beginTime, "endTime": endTime}
        $.post(url, data, function (res) {
            var tmp = JSON.parse(res)
            $.each(tmp, function (n, value) {
                dateArr[n] = value.Date;
                countArr[n] = value.Count;
                rateArr[n] = value.Rate;
                addForm(value.Date, value.Count, value.Rate)
            });


            UserPreserveImg(dateArr, countArr, rateArr)
            col1 = dateArr
            col2 = countArr
            col3 = rateArr

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
        line = line + col1[i] + "," + col2[i] + "," + col3[i] +"%"+ "\r\n"

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
    var td3 = document.createElement("td")
    td1.innerHTML = dateArr
    td2.innerHTML = CountArr
    td3.innerHTML = RateArr+"%"
    tr1.appendChild(td1)
    tr1.appendChild(td2)
    tr1.appendChild(td3)
    parent.appendChild(tr1)
}

/*
 * @dataArr  表示横坐标的日期
 * @countArr  表示纵坐标对应的数值
 * */

//历史每日充值额和历史每日充值用户数量
function UserPreserveImg(dateArr, countArr, rateArr) {


    //创建元素
    createEle()

    var myChart = echarts.init(document.getElementById('main1'));
    var res = getInfo()
    var colors = ['#5793f3', '#675bba'];

    // 指定图表的配置项和数据
    // 指定图表的配置项和数据
    option = {
        color: colors,

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            formatter:'日期:{b0}<br>'+
            '留存用户:{c0}<br>'+
            '留存率:{c1}%'

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
                data:dateArr,
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
                name: '留存率',
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
