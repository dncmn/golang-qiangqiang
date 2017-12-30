
/* 登录按钮触发的事件  */
function loginAction() {
    $("#code").closest('.form-group').removeClass("check-error");
    $("#code").parent().find(".input-help").remove();
    $("#code").closest('.form-group').addClass("check-success");
    $("#password").closest('.form-group').removeClass("check-error");
    $("#password").parent().find(".input-help").remove();
    $("#password").closest('.form-group').addClass("check-success");
    var ok = true;
    //获取请求参数
    var userName = $("#code").val().trim();
    var password = $("#password").val().trim();
    if (userName == "") {
        var e = $("#code").attr("data-validate").split(":");
        $("#code").closest('.form-group').removeClass("check-success");
        $("#code").closest('.form-group').addClass("check-error");
        $("#code").closest('.field').append('<div class="input-help"><ul>' + e[1] + '</ul></div>');
        ok = false;
    }
    if (password == "") {
        var pwd = $("#password").attr("data-validate").split(":");
        ;
        $("#password").closest('.form-group').removeClass("check-success");
        $("#password").closest('.form-group').addClass("check-error");
        $("#password").closest('.field').append('<div class="input-help"><ul>' + pwd[1] + '</ul></div>');
        ok = false;
    }
    if (ok) {


        $.ajax({
            url: "/login",
            type: "post",
            data: {"userName": userName, "password": password},
            dataType: "json",
            success: function (result) {

                if(result=="reLogin"){
                    alert("have a try");
                }

                if (result.State == 0) {//登录成功


                    var user = result.Data;

                    addCookie("user", user.UserName, 2);
                    addCookie("roleId", user.RoleId, 3);


                    addCookie("userId", user.UserId, 3);
                    addCookie("token",result.Token,3);



                    window.location.href = "/toIndex";


                }
                if (result.State == 1) {//用户名为空
                    $("#code").closest('.form-group').removeClass("check-success");
                    $("#code").closest('.form-group').addClass("check-error");
                    $("#code").closest('.field').append('<div class="input-help"><ul>' + result.Message + '</ul></div>');
                }
                if (result.State == 2) {//密码为空
                    $("#password").closest('.form-group').removeClass("check-success");
                    $("#password").closest('.form-group').addClass("check-error");
                    $("#password").closest('.field').append('<div class="input-help"><ul>' + result.Message + '</ul></div>');
                }
                if (result.State == 3) {//用户名或者密码错误

                    $("#password").closest('.form-group').removeClass("check-success");
                    $("#password").closest('.form-group').addClass("check-error");
                    $("#code").closest('.form-group').removeClass("check-success");
                    $("#code").closest('.form-group').addClass("check-error");
                    $("#password").closest('.field').append('<div class="input-help"><ul>' + result.Message + '</ul></div>');
                }
            },
            error: function () {
                alert("我在这里登陆失败");

            }
        });
    }
}