var totalPowerList = new Array();

//获取所有的角色名称
function getUserName() {

    $.ajax({
        url: "/toShowUserName",
        type: "post",
        dataType: "json",
        success: function (result) {


            if (result.State == 0) {

                $.each(result.UserData, function (n, value) {//这里显示用户的名字

                    totalPowerList[n] = value.ActionIds //将行为id保存到全局变量的数组中
                    var optionNode = " <option value=" + n + ">" + value.UserName + "</option>";
                    var $input = $(optionNode);//创建节点
                    $('#procId').append($input);
                });


                //默认选中下拉列表中第一个名字的权限
                var ids = result.UserData[0].ActionIds;
                var idArr = ids.join(",")

                $.each(result.Data, function (n, value) {//这里添加表格用

                    if (value.Pid == 0) {
                        addForm(value.Id, value.Pid, value.Title, value.Href, false);

                    } else {


                        if (idArr.indexOf(value.Id) == -1) {//判断该用户的权限id是否有被选中的
                            var flag = false
                        } else {
                            var flag = true
                        }

                        addForm(value.Id, value.Pid, value.Title, value.Href, flag);
                    }

                });


            } else {
                alert(result.Message)
            }

        },
        error: function () {
            alert("添加失败");
        }
    });
}

//更改用户权限
function sendAjaxRequet() {


    //获取选中的用户名
    var select = document.getElementById("procId");
    var options = select.options;


    var userName = "";
    var userIndx = "";
    for (var i = 0; i < options.length; i++) {
        if (options[i].selected) {
            userName = options[i].text;
            userIndx = i;
            break;

        }
    }

    var arr = new Array();
    var index = 0;
    //获取选中的复选框的值
    var one = document.getElementsByName("action");
    for (var i = 0; i < one.length; i++) {
        if (one[i].checked) {
            arr[index] = one[i].value;
            index++;
        }
    }
    var idStr = arr.join(",");



    //发送http请求
    $.ajax({
        url: "/toModifyUserPower",
        type: "post",
        dataType: "json",
        data:{
            "actionIds":idStr,
            "userName":userName
        },
        success: function (result) {
            if(result.State==0){
                alert(result.Message);
            }else{
                alert(result.Message);
            }
        }
    });

    //善后处理
}

//更改用户名,显示这个用户的权限
function ChangeUserPower() {
    //获取下拉列表的值--选中的用户标号
    var optionValue = getOptionValue();

    //清空之前被选中的复选框
    var one = document.getElementsByName("action")
    for (var i = 0; i < one.length; i++) {
        one[i].checked = false;
    }

    //根据用户编号,找到选中的这个人的权限id,这里可以从全局变量的数据中获取
    var oneIds = totalPowerList[optionValue];

    var idStr = oneIds.join(",")

    //遍历actions,相等的就是选中
    for (var i = 0; i < one.length; i++) {
        if (idStr.indexOf(one[i].value) != -1) {
            one[i].checked = true;
        }
    }

}

//获取选中的获取下拉列表option的用户的编号
function getOptionValue() {
    var select = document.getElementById("procId");
    var options = select.options;
    for (var i = 0; i < options.length; i++) {
        if (options[i].selected) {

            //("option[i].text==============="+options[i].text); //获取文本值
            //("option[i].text==============="+options[i].value);//获取序号
            return options[i].value
            break
        }
    }
}
/*
 *这里是添加表格
 * ok表示在创建表格时,是否被选中
 * */

function addForm(id, pid, title, href, isChecked) {


    var parent = document.getElementById("trParent1")
    var tr1 = document.createElement("tr")
    var td1 = document.createElement("td")
    if (pid == 0) {

        td1.innerHTML = title
        var td2 = document.createElement("td")
        var td3 = document.createElement("td")
        td2.innerHTML = ""
        td3.innerHTML = ""
    } else {
        td1.innerHTML = ""
        var td2 = document.createElement("td")
        td2.innerHTML = title
        var td3 = document.createElement("td")
        var inputNode = document.createElement("input");
        inputNode.setAttribute("type", "checkbox");
        inputNode.setAttribute("name", "action");
        inputNode.setAttribute("value", id);
        if (isChecked) {
            inputNode.setAttribute("checked", isChecked);
        }

        inputNode.setAttribute("id", id);
        td3.appendChild(inputNode)

    }




    tr1.appendChild(td1)
    tr1.appendChild(td2)
    tr1.appendChild(td3)
    parent.appendChild(tr1)


}

$(function () {
    window.onload = function () {
        getUserName();//这里获取所有的用户的名字
    }
});





