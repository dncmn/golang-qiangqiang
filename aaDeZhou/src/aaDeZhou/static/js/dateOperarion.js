/*
*
* 获取系统当前时间的字符串
* 函数返回值是：2017-07-01
* */

function getCurDateString(){
    var data=new Date();
    var  tmpMonth=data.getMonth()+1
    var weekIndex;
    var dayIndex;
    if (tmpMonth<10){
        weekIndex="0"+tmpMonth;
    }else{
        weekIndex=tmpMonth;
    }

    var tmpDay=data.getDate();
    var dayIndex;

    if(tmpDay<10){
        dayIndex="0"+tmpDay;
    }else{
        dayIndex=tmpDay;
    }

    var output= data.getFullYear()+"-"+weekIndex+"-"+dayIndex

    return output;
}


//获取当前时间   时间格式是:2017-07-05 15:00
function getTimeToMinuteStr() {
    var data = new Date();
    var tmpMonth = data.getMonth() + 1
    var weekIndex;
    var dayIndex;
    if (tmpMonth < 10) {
        weekIndex = "0" + tmpMonth;
    } else {
        weekIndex = tmpMonth;
    }

    var tmpDay = data.getDate();
    var dayIndex;

    if (tmpDay < 10) {
        dayIndex = "0" + tmpDay;
    } else {
        dayIndex = tmpDay;
    }

    var hourIndex;

    var tmpHour=data.getHours();
    if(tmpHour<10){
        hourIndex="0"+tmpHour;
    }else{
        hourIndex=tmpHour;
    }

    var minuteIndex;

    var minuteTmp=data.getMinutes();
    if(minuteTmp<10){
        minuteIndex="0"+minuteTmp;
    }else{
        minuteIndex=minuteTmp;
    }



    var output = data.getFullYear() + "-" + weekIndex + "-" + dayIndex + " " + hourIndex + ":" + minuteIndex


    return output;
}

//获取当前日期的年和月 返回值是:"2017-05"
function getCurMonthString(){
    var data=new Date();
    var  tmpMonth=data.getMonth()+1
    var weekIndex;
    var dayIndex;
    if (tmpMonth<10){
        weekIndex="0"+tmpMonth;
    }else{
        weekIndex=tmpMonth;
    }

    var tmpDay=data.getDate();


    var output= data.getFullYear()+"-"+weekIndex
    return output
}

/*
 *对一个月份："2017-01"
 * 进行加几个月或者减去几个月
 * 返回的是"2017-03",也就是加上或者减去的日期
 *
 * */

function MonthOperate(month,step){


    var date=new Date(month);
    var yearBefore=date.getFullYear()
    var monthBefore=date.getMonth()+1;

    if(step>0){
        var tmp=parseInt(step)+monthBefore;
        if(tmp>12){ //跨年了
            var month=tmp-12;
            var year=yearBefore+1;
        }else{
            var year=yearBefore;
            month=tmp;
        }

        if (month<10){
            month="0"+month
        }


        return (year+"-"+month);
    }

    var tmp=monthBefore+step;
    if(tmp<0){ //跨年了
        var month=12+tmp;
        var year=yearBefore-1;
    }else if(tmp==0){
        var month=12;
        var year=yearBefore-1;
    }else{
        var year=yearBefore;
        month=tmp;
    }

    if (month<10){
        month="0"+month
    }


    return (year+"-"+month);

}
/*   对周数据进行判断
    判断开始日期是否是周一,
    判断结束日期是否是周日,
    判断结束日期是否大约开始日期,
    判断结束日期是否是当周数据,如果是就会报错
   对开始日期和结束一起进行判断
 * 返回开始和结束周对应的周索引
 *
 *
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




/*判断月份是否是超过当前月
    beginMonth:格式是"2017-04"表示查询的开始月份
    endMonth:格式是"2017-05"表示是查询的结束月份
    该函数无返回值


*/

function checkIsOutofMonth(tag,beginMonth,endMonth){

    var beginTime=new Date(beginMonth).getTime();
    var endTime=new Date(endMonth).getTime();

    var tarTime=new Date(getCurMonthString()).getTime();

    if(beginTime-tarTime>0  || (beginTime-tarTime<0 && endTime-tarTime>0)){
        alert("结束月份不对或开始日期不对")
        return false;
    }

    if (tag=="habit"){ //付费习惯
        if(endTime<beginTime ){
            alert("结束月份必须大于开始月份或者结束月份超过了当前月份")
            return false;
        }
    }else{//付费率
        if(endTime<beginTime || endTime==tarTime){
            alert("结束月份必须大于开始月份或者选择了当前月份")
            return false;
        }
    }


    return true;


}


/*
 * @Param startDate:"2017-07-01"  指定初始日期，
 * @param  step int  指定要加几天
 *
 * */
function addDays(startDate,step){

    startDate = new Date(startDate);
    startDate = +startDate + 1000*60*60*24*step;
    startDate = new Date(startDate);

    var monthIndex=startDate.getMonth()+1
    if (monthIndex<10){
        monthIndex="0"+monthIndex

    }

    var dayIndex=startDate.getDate();
    if(dayIndex<10){
        dayIndex="0"+dayIndex
    }


    var nextStartDate = startDate.getFullYear()+"-"+monthIndex+"-"+dayIndex;

    return nextStartDate;


}

/*
 * 将时间格式的字符串转换成指定格式的
 * dateString:形式是"2017-07-01"
 * 返回值:包含年月日的数组
 * */
function convertDateFromString(dateString) {
    if (dateString) {
        var date = new Date(dateString.replace(/-/, "/"))
        return date;
    }
}

/**
 * 判断年份是否为润年
 *
 * @param {Number} year
 */
function isLeapYear(year) {
    return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
}
/**
 * 获取某一年份的某一月份的天数
 *
 * @param {Number} year
 * @param {Number} month
 */
function getMonthDays(year, month) {
    return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
}
26
/**
 * 获取某年的某天是第几周
 * @param {Number} y
 * @param {Number} m
 * @param {Number} d
 * @returns {Number}
 */
function getWeekNumber(date) {


    var res = convertDateFromString(date)


    var y = res.getFullYear()
    var m = res.getMonth()+1
    var d = res.getDate()
    var now = new Date(y, m - 1, d),
        year = now.getFullYear(),
        month = now.getMonth(),
        days = now.getDate();
    //那一天是那一年中的第多少天
    for (var i = 0; i < month; i++) {
        days += getMonthDays(year, i);
    }

    //那一年第一天是星期几
    var yearFirstDay = new Date(year, 0, 1).getDay() || 7;

    var week = null;
    if (yearFirstDay == 1) {
        week = Math.ceil(days / yearFirstDay);
    } else {
        days -= (7 - yearFirstDay + 1);
        week = Math.ceil(days / 7) + 1;
    }
    var result=week-1
    if(result==0){
        result=1
    }
    return result;
}

/*
* 下面这个函数是检查输入的文本框中的日期是否合法，因为文本框中的日期格式是有"2017-09"或者"2017-09-01"
* data:就是所要验证的日期。形式就是"2017-09"或者"2017-09-01"
* 函数返回值是布尔值true或者false
*
* */
function checkDateForm(data) {


    //首先检查日期是否符合2017-09或者2017-09-01的格式

    var te = /^\d{4}-\d{2}-\d{2}$/;
    var me = /^\d{4}-\d{2}$/;

    var b1 = te.test(data);
    var b2 = me.test(data);
    var sum = b1 + b2;

    if (sum == 0 || sum == 2) {
        //alert("输入的日期不合法,请重新输入!");
        return false
    }


    var arr = data.split("-");
    var year = parseInt(arr[0], 10);
    var month = parseInt(arr[1], 10);


    if (year < 1000 || year > 3000) {
        //alert("输入的日期不合法,请重新输入!");
        return false;
    }


    month = parseInt(month, 10);
    if (month == 0 || month > 12) {
        //alert("输入的日期不合法,请重新输入!");
        return false
    }


    if (arr.length == 2) {//只有年月

        return true

    }

    //检查日
    var day = parseInt(arr[2], 10)
    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        monthLength[1] = 29;
    }

    if (day < 0 || day > monthLength[month - 1]) {
        //alert("输入的日期不合法,请重新输入!");
        return false
    }

    return true


}