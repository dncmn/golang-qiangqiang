//发送添加用户的信息
function sendAddInfo() {
    var userName = $('#userName').val().trim();



    var re = new RegExp("^[ ]+$");
    if (userName == "" || userName == null  || re.test(userName) ) {
        alert("添加的角色名不能为空");
        return;
    }

    $.ajax({
        url: "/toAddRole",
        type: "post",
        data: {
            "roleName": userName

        },
        dataType: "json",
        success: function (result) {
            if (result.State == 0) {
                alert("添加成功");
                $('#userName').val("");



            }
            if (result.State == 1 || result.State == 2) {

               alert(result.Message)
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
        alert("角色名不能为空");
        return;
    }

    $.ajax({
        url: "/toDelRole",
        type: "post",
        data: {
            "roleName": userName
        },
        dataType: "json",
        success: function (result) {
            if (result.State == 0) {
                alert("删除成功");
                $('#delUserName').val("");


            }
            if (result.State == 1 || result.State==2) {
                alert(result.Message);
                $('#delUserName').val("");
            }

        },
        error: function () {
            alert("删除失败");
        }
    });
}

//发送更改角色的信息
function sendModInfo() {
    var userName = $('#userName2').val().trim();
    var password = $('#password2').val().trim();

    var userType = $("#userType2").find("option:selected").text().trim();


    var re = new RegExp("^[ ]+$");
    if (userName == "" || userName == null || password == "" || password == null || re.test(userName) || re.test(password)) {
        alert("角色名不能为空");
        return;
    }

    $.ajax({
        url: "/toModRole",
        type: "post",
        data: {
            "oldName": userName,
            "newName": password

        },
        dataType: "json",
        success: function (result) {
            if (result.State == 0) {
                alert("更改信息成功");
                $('#userName2').val("");
                $('#password2').val("");


            }
            if (result.State == 1 || result.State == 2) {

                alert(result.Message);
            }

        },
        error: function () {
            alert("更改角色失败");
        }
    });
}


/* 清空页面,然后禁用按钮 */
function clearContent() {

    $('#main1').html("");
    $('#trParent').html("");

    var liIndex = getIndex2() + 1;

    //清空选择开始时间
    var beginTimeIndex = '#beginTime' + liIndex;
    $(beginTimeIndex).val("");

    //清空选择结束的时间
    var endTimeIndex = '#endTime' + liIndex;
    $(endTimeIndex).val("");


    var downloadIndex = '#downloadId' + liIndex;
    $(downloadIndex).attr({"disabled": "disabled"})

}
$(function () {
    window.onload = function () {


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
            clearContent()

            if ($liIndex == 3) {
                $('trParent').html("");
                showRoleInfo();
            }

        });
    }
});

function showRoleInfo() {




    $.ajax({
        url: "/toShowRoleInfo",
        type: "post",
        dataType: "json",
        success: function (result) {



            $.each(result, function (n, value) {
                var  dateArr = value.RoleId;
                var countArr = value.RoleName;
                var rateArr = value.AddTime;
                addForm(value.RoleId, value.RoleName, value.AddTime)
            });
        },
        error: function () {
            alert("添加失败");
        }
    });
}

function addForm(userName,password,roleName) {

    var parent = document.getElementById("trParent")
    var tr1 = document.createElement("tr")
    var td1 = document.createElement("td")
    var td2 = document.createElement("td")
    var td3 = document.createElement("td")
    td1.innerHTML = userName
    td2.innerHTML = password
    td3.innerHTML = roleName
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