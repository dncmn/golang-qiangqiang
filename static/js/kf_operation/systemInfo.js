//向游戏服务器发送http请求
function sendSystemInfo() {


    //从cookie中获取用户名和当前时间
    var userName = getCookie("user")
    //获取输入框文本的值
    var sendInfo = $('#textAreaId').val();
    //对输入的文本框进行校验，输入不能为空,不能为空格
    var re = new RegExp("^[ ]+$");
    if (re.test(sendInfo) || sendInfo == "" || sendInfo == null || sendInfo.length == 0) {
        alert("发布的消息不能为空");
        return
    }


    //获取选中的下拉列表的值
    var selectInfo = $('#selectInfo').val();//mail--------------ysInfo


    if (selectInfo == "sysInfo") {//系统消息
        var data = {
            "userName": userName, //正在操作的玩家信息
            "selectInfo": selectInfo,//下拉列表的值:mail or sysInfo
            "content": sendInfo//发送的系统消息
        }
    } else {//邮件
        //获取单选按钮的值
        var radioValue = $('input[name="radioType"]:checked').val();//one or all

        if (radioValue == "one") {
            var playInfo = $('#playerNickName').val();//玩家昵称或id
        }

        //获取附件的内容
        var fujian = GetFuJianInfo();


        var data = {
            "userName": userName,    //正在操作的玩家信息
            "selectInfo": selectInfo,//下拉列表的值:mail or sysInfo
            "content": sendInfo,//要发送的系统消息
            "radioValue": radioValue,//单选按钮的值:one or all
            "playerInfo": playInfo,
            "fuJians": fujian
        }

    }


    $.ajax({
        url: "/systemInfo",
        type: "post",
        data: data,
        dataType: "json",
        success: function (res) {

            if (res.State == 0) {
                alert("发送成功");

                //发送完消息以后复原现场
                clearRequestInfo()


                return
            } else {
                alert("发送失败");
            }


        },
        error: function () {
            alert("发送消息失败!请查看服务器是否关闭");

        }
    });


}

//发送完系统消息以后,开始清理系统消息
function clearRequestInfo() {
    $('#textAreaId').val("");//清空复选框
    $('#playerNickName').val("");//玩家昵称或id
    $('#playerNickName').attr({"disabled": "disabled"});//禁用玩家姓名或昵称


    $('#fujian').removeAttr("checked");//附件如果选中就取消选中

    for (var i = 1; i <= 4; i++) {//清空附件id列表
        var input = '#input' + i
        var count = '#count' + i
        $(input).val("");//这里清空输入框
        $(count).val("");
        $(input).attr({"disabled": "disabled"});//这里禁用输入框
        $(count).attr({"disabled": "disabled"});

    }

    //消息类型：选择第一个
    var select = document.getElementById("selectInfo");
    var options = select.options;
    options[0].selected=true;
    //单选按钮：选择第一个
    $('input:radio:first').attr('checked', 'true');
}

//发送系统公告时,获取附件id,及其数量，如果id为空,那么对应的数量即使写上了，也会被忽略。
//返回的是一个数组,然后是以键值对的形式返回的。
function GetFuJianInfo() {

    var arr = new Array();

    for (var i = 1; i <= 4; i++) {
        var input = '#input' + i
        var count = '#count' + i
        var a = $(input).val();
        var b = $(count).val();
        var re = new RegExp("^[ ]+$");
        if (a == null || a == "" || b == null || b == "" || re.test(a) || re.test(b)) {
            continue
        }
        var res = a + "=" + b
        arr.push(res)


    }
    var msg = arr.join("&");
    return msg
}

//选择全体玩家，禁用输入框
function forbidInput() {

    //获取单选按钮的值
    var radioValue = $('input[name="radioType"]:checked').val();

    //获取选中的下拉列表的值
    var selectInfo = $('#selectInfo').val();


    if (radioValue == "all") { //选择全体玩家
        $('#playerNickName').attr({"disabled": "disabled"})
        $('#playerNickName').val("");

    }

    if (radioValue == "one" && selectInfo == "mail") {//选择个人
        $('#playerNickName').removeAttr("disabled");

    }
}

//下拉菜单更改,触发的事件
function startAndForbid() {
    var selectInfo = $('#selectInfo').val(); //获取选中的option的值
    $('#textAreaId').val("");//清空发送区域的内容

    if (selectInfo == "mail") { //选择邮件
        //启用附件
        $('#fujian').removeAttr("disabled");
        //启用最后一个单选按钮
        $('input:radio:last').removeAttr("disabled");

    }
    if (selectInfo == "sysInfo") {//系统信息

        //清空玩家昵称或者id
        $('#playerNickName').val("");


        //附件取消选中
        $('#fujian').removeAttr("checked");

        //禁用附件
        $('#fujian').attr({"disabled": "disabled"});
        for (var i = 1; i <= 4; i++) {
            var inputIndex = '#input' + i;
            $(inputIndex).val("");//清空ID输入框
            $(inputIndex).attr({"disabled": "disabled"});
            var countIndex = '#count' + i;
            $(countIndex).val("");//清空数量输入框
            $(countIndex).attr({"disabled": "disabled"});
        }
        //禁用玩家昵称
        $('#playerNickName').attr({"disabled": "disabled"});

        //单选按钮选中全体玩家--也就是设置第一个单选按钮被选中
        $('input:radio:first').prop("checked", "checked")
        //最后一个单选按钮被禁用
        $('input:radio:last').attr("disabled", "disabled");


    }


}

//启用附件下的所有输入框
function startFuJian() {

    //判断复选框是否被选中
    if (!$('#fujian').is(":checked")) {
        for (var i = 1; i <= 4; i++) {//如果复选框被选中了,那就清空和禁用下面的输入框
            var inputIndex = '#input' + i;
            $(inputIndex).val("");
            $(inputIndex).attr({"disabled": "disabled"})
            var countIndex = '#count' + i;
            $(countIndex).val("");
            $(countIndex).attr({"disabled": "disabled"})
        }

    } else { //如果复选框没有被选中,启用下面的输入框
        for (var i = 1; i <= 4; i++) {
            var inputIndex = '#input' + i;
            $(inputIndex).removeAttr("disabled");
            var countIndex = '#count' + i;
            $(countIndex).removeAttr("disabled");
        }
    }


}

