//发送添加用户的信息
function sendAddInfo() {
    var userName = $('#userName').val().trim();
    var password = $('#password').val().trim();
    var userTypeName = $("#userType").find("option:selected").html().trim();




    var re = new RegExp("^[ ]+$");
    if (userName == "" || userName == null || password == "" || password == null || re.test(userName) || re.test(password)) {
        alert("用户名或者密码不能为空");
        return;
    }

    $.ajax({
        url: "/toAdduser",
        type: "post",
        data: {
            "userName": userName,
            "password": password,
            "userTypeName": userTypeName
        },
        dataType: "json",
        success: function (result) {
            if (result.State == 0) {
                alert("添加成功");
                $('#userName').val("");
                $('#password').val("");
                document.getElementById("userType").options[0].selected = true;
                $('#cSource_span').html("")

            }
            if (result.State == 1 || result.State == 2) {
                $("#cSource_span").html(result.Message);
            }

        },
        error: function () {
            alert("添加失败");
        }
    });

}

//发送删除用户的信息
function sendDelInfo() {
    var userName = $('#delUserName').val().trim();


    var re = new RegExp("^[ ]+$");
    if (userName == "" || userName == null || re.test(userName)) {
        alert("用户名不能为空");
        return;
    }

    $.ajax({
        url: "/toDelUser",
        type: "post",
        data: {
            "userName": userName
        },
        dataType: "json",
        success: function (result) {
            if (result.State == 0) {
                alert("删除成功");
                $('#delUserName').val("");
                $('#delMsg').html("")

            }
            if (result.State == 1) {
                alert("用户名不存在");
                $('#delUserName').val("");
            }
            if (result.State == 2) {
                alert("删除数据失败");

            }

        },
        error: function () {
            alert("删除失败");
        }
    });
}

//发送更改用户的信息
function sendModInfo() {
    var userName = $('#userName2').val().trim();
    var password = $('#password2').val().trim();
    var userType = $("#userType2").find("option:selected").text().trim();


    var re = new RegExp("^[ ]+$");
    if (userName == "" || userName == null || password == "" || password == null || re.test(userName) || re.test(password)) {
        alert("用户名或者密码不能为空");
        return;
    }

    $.ajax({
        url: "/toModUser",
        type: "post",
        data: {
            "userName": userName,
            "password": password,
            "userType": userType
        },
        dataType: "json",
        success: function (result) {
            if (result.State == 0) {
                alert("更改信息成功");
                $('#userName2').val("");
                $('#password2').val("");
                document.getElementById("userType2").options[0].selected = true;
                $('#cSource_span').html("")

            }
            if (result.State == 1 || result.State == 2) {

                alert(result.Message);
            }

        },
        error: function () {
            alert("添加失败");
        }
    });
}


//获取所有的角色名称
function getRoleInfo(){

    $.ajax({
        url: "/toGetRoleName",
        type: "post",
        dataType: "json",
        success: function (result) {

            $.each(result, function (n, value) {

                var optionNode=" <option value="+n+">"+value.RoleName+"</option>";
                var $input = $(optionNode)//创建节点
                $('#userType').append($input)


            });
            $.each(result, function (n, value) {

                var optionNode=" <option value="+n+">"+value.RoleName+"</option>";
                var $input = $(optionNode)//创建节点

                $('#userType2').append($input)

            });
        },
        error: function () {
            alert("添加失败");
        }
    });
}


$(function () {
    window.onload = function () {
        getRoleInfo();


        $li = $('#tab li')
        $li.click(function () {


            $this = $(this); //获取点击获取的对象

            $liIndex = $this.index(); //获取点击的序号

            var sonIndex = '#son' + ($liIndex + 1)
            $(sonIndex).show().siblings().hide()
            for (var i = 0; i < $li.length; i++) {
                $li[i].removeAttribute("class")
            }
            $this.addClass('current')


            if ($liIndex == 3) {
                $('#trParent').html("");
                showUserInfo();
            }

        });
    }
});

function showUserInfo() {

    $.ajax({
        url: "/toShowUserInfo",
        type: "post",
        dataType: "json",
        success: function (result) {

                $.each(result, function (n, value) {
                    addForm(value.UserName, value.RoleName,value.ActionNames)
                });
        },
        error: function () {
            alert("添加失败");
        }
    });
}

function addForm(userName,roleName,actionList) {

    var parent = document.getElementById("trParent")
    var tr1 = document.createElement("tr")
    var td1 = document.createElement("td")
    var td2 = document.createElement("td")
    var td3 = document.createElement("td")

    td1.innerHTML = userName
    td2.innerHTML = roleName
    td3.innerHTML = actionList

    tr1.appendChild(td1)
    tr1.appendChild(td2)
    tr1.appendChild(td3)

    parent.appendChild(tr1)
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