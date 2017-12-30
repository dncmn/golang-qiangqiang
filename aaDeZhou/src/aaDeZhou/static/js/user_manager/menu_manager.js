//发送添加用户的信息
function add_menu() {
    var subTitle = $('#userName').val().trim();
    var subHref = $('#password').val().trim();
    var newMenuName = $('#parentMenu').val().trim();
    var mainMenu = $("#userType").find("option:selected").val().trim();

    //判断单选按钮是否被选中
    var flag = $("input[type='checkbox']").is(':checked');
    var re = new RegExp("^[ ]+$");
    if (!flag) {//复选框没有被选中
        if (subTitle == "" || subTitle == null || subHref == "" || subHref == null || re.test(subTitle) || re.test(subHref)) {
            alert("子菜单选项不能为空");
            return;
        }


    } else {
        if (re.test(newMenuName) || newMenuName == "" || newMenuName == null || subTitle == "" || subTitle == null || subHref == "" || subHref == null || re.test(subTitle) || re.test(subHref)) {
            alert("数据不能为空");
            return;
        }
        mainMenu = newMenuName;//当复选框选中时,表示新创建父菜单的名字,当为选中则表示父菜单的id
        //是否被选中根据falg来判断
    }


    $.ajax({
        url: "/toCreateMenu",
        type: "post",
        data: {
            "menuName": subTitle,
            "menuHref": subHref,
            "mainMenu": mainMenu,
            "flag": flag
        },
        dataType: "json",
        success: function (result) {
            if (result.State == 0) {

                $('#userName').val("");
                $('#password').val("");
                $('#parentMenu').val("");//清空父菜单的名字
                $('#parentMenu').attr({"disabled":"disabled"});
                $("[name='action']").removeAttr("checked");//取消全选
                document.getElementById("userType").options[0].selected = true;//设置第一个被选中
                $('#userType').removeAttr("disabled");
                $('#cSource_span').html("");

                if (flag) {//重新创建父菜单和子菜单,把父菜单重新添加到下拉列表中
                    var optionNode = " <option value=" + result.NewMainId + ">" + newMenuName + "</option>";
                    var $input = $(optionNode)//创建节点
                    $('#userType').append($input)
                }
                alert("添加成功");


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



//移动菜单
function modify_menu() {

    var mainTitle = $("#modParentType").find("option:selected").val().trim();
    var subTitle = $("#modSonType").find("option:selected").val().trim();




    $.ajax({
        url: "/toMoveMenu",
        type: "post",
        data: {
            "mainId": mainTitle,
            "subId": subTitle
        },
        dataType: "json",
        success: function (result) {
            if (result.State == 0) {

                //设置第几个下拉项被选中
                document.getElementById("modParentType").options[0].selected = true;
                document.getElementById("modSonType").options[0].selected = true;
                alert("更改信息成功");
            }
            if (result.State == 1 || result.State == 2) {

                alert(result.Message);
                return

            }

        },
        error: function () {
            alert("添加失败");
        }
    });
}


//获取主菜单的名字
function getRoleInfo() {

    $.ajax({
        url: "/toGetMainMenuName",
        type: "post",
        dataType: "json",
        success: function (result) {

            $.each(result, function (n, value) {

                var optionNode = " <option value=" + value.Id + ">" + value.Title + "</option>";
                var $input = $(optionNode)//创建节点
                $('#userType').append($input)


            });

        },
        error: function () {
            alert("获取主菜单失败");
        }
    });
}

//定义一个全局变量的数组用来保存子菜单信息
var commonSubMenu = new Array();
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

            if ($liIndex == 0) {
                $('#parentMenu').val("");//清空父菜单的名字
                $('#userName').val("");
                $('#password').val("");
                $("[name='action']").removeAttr("checked");//取消全选
                $('#cSource_span').html("")

            }

            //删除菜单时,点击li从数据库获取最新的住菜单和子菜单,选择主菜单,然后子菜单对应的显示出来
            if ($liIndex == 1) {
                $('#delParentType').html("")
                $('#delSonType').html("")
                $("#action2").removeAttr("checked");//取消全选
                showDelMenuInfo();
            }

            if($liIndex==2){//移动菜单
                showModMenuInfo();

            }

            if ($liIndex == 3) {
                $('#trParent').html("");
                showMenuInfo();
            }

        });
    }
});
//显示父菜单和子菜单的信息
function showModMenuInfo(){
    $.ajax({
        url: "/toGetMainAndSubMenu",
        type: "post",
        dataType: "json",
        success: function (result) {

            if (result.State == 0) {

                //添加父菜单
                $.each(result.MainMenu, function (n, value) {//这里显示用户的名字

                    var optionNode = " <option value=" + value.Id + ">" + value.Title + "</option>";
                    var $input = $(optionNode);//创建节点
                    $('#modParentType').append($input);
                });

                //添加所有的子菜单
                $.each(result.SubMenu, function (n, value) {//这里显示用户的名字

                    var optionNode = " <option value=" + value.Id + ">" + value.Title + "</option>";
                    var $input = $(optionNode);//创建节点
                    $('#modSonType').append($input);
                });


            }

            if (result.State == 1) {
                alert(result.Message);
                return
            }

        },
        error: function () {
            alert("获取主菜单信息失败");
        }
    });
}

//显示删除菜单时，获取主菜单及其对应的子菜单信息
function showDelMenuInfo() {
    $.ajax({
        url: "/toGetMainAndSubMenu",
        type: "post",
        dataType: "json",
        success: function (result) {

            if (result.State == 0) {
                commonSubMenu = result.SubMenu;

                $.each(result.MainMenu, function (n, value) {//这里显示用户的名字


                    var optionNode = " <option value=" + value.Id + ">" + value.Title + "</option>";
                    var $input = $(optionNode);//创建节点
                    $('#delParentType').append($input);
                });


                //将subMenu追加到子菜单下面
                $.each(result.SubMenu, function (n, value) {//这里显示用户的名字
                    if (value.Pid == result.MainMenu[0].Id) {
                        var optionNode = " <option value=" + value.Id + ">" + value.Title + "</option>";
                        var $input = $(optionNode);//创建节点
                        $('#delSonType').append($input);
                    }

                });

            }

            if (result.State == 1) {
                alert(result.Message);
                return
            }

        },
        error: function () {
            alert("获取主菜单信息失败");
        }
    });
}
//删除菜单时,由父菜单的更改,然后找出子菜单
function changeSubMenu() {

    //清空子菜单
    $('#delSonType').html("")

    //获取父菜单的pid
    var menuId = $('#delParentType').val(); //获取Select选择的Value


    $.each(commonSubMenu, function (n, value) {//这里显示用户的名字
        if (value.Pid == menuId) {
            var optionNode = " <option value=" + value.Id + ">" + value.Title + "</option>";
            var $input = $(optionNode);//创建节点
            $('#delSonType').append($input);
        }

    });

}

function showMenuInfo() {

    $.ajax({
        url: "/toPowerList",
        type: "post",
        dataType: "json",
        success: function (result) {

            if(result.State==0){
                $.each(result.Data, function (n, value) {
                    addForm( value.Pid, value.Title, value.AddTime);
                });
            }else{
                alert(result.Message);
                return
            }


        },
        error: function () {
            alert("添加失败");
        }
    });
}

function addForm(pid,title, addTime) {

    var parent = document.getElementById("trParent")
    var tr1 = document.createElement("tr")
    var td1 = document.createElement("td")
    var td2 = document.createElement("td")
    var td3 = document.createElement("td")
    if (pid == 0) {
        td1.innerHTML = title
        td2.innerHTML = ""

    } else {
        td1.innerHTML = ""
        td2.innerHTML = title
    }
    td3.innerHTML = addTime
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

//单选按钮控制是否要新添加父菜单
function changeElementStatus() {

    /*
     * 判断复选框是否被选中
     * 如果被选中,那么就禁用下拉列表，表示新创建父菜单和子菜单
     * */
    var one = document.getElementsByName("action");
    $('#parentMenu').val("");//清空父菜单的名字
    for (var i = 0; i < one.length; i++) {


        if (one[i].checked) {

            $("#userType").attr({"disabled": "disabled"});
            $("#parentMenu").removeAttr("disabled")
            //清空父菜单


        } else {
            $("#parentMenu").attr({"disabled": "disabled"});
            $("#userType").removeAttr("disabled")
        }

    }


}

//点击复选框，表示删除父菜单
function delParentMenu() {

    //判断复选框是否被选中
    var flag = $('#action2').is(":checked");
    if (flag) {//禁用子菜单
        $('#delSonType').attr({"disabled": "disabled"});
    } else {//启用子菜单
        $('#delSonType').removeAttr("disabled");
    }

}

//点击提交按钮,提交获取到的信息
function del_menu() {
    //判断复选框是否被选中
    var flag = $('#action2').is(":checked");
    var mainId = $('#delParentType').val();
    //如果选中
    if (flag) {//表示只删除父菜单
        //获取主菜单的value也就是主菜单的id

        var arr = {"flag": flag, "mainMenuId": mainId}

    } else {//表示删除主菜单和子菜单

        var subId = $('#delSonType').val();
        var arr = {"flag": flag, "mainMenuId": mainId, "subMenuId": subId};

    }


    //发送http请求
    $.ajax({
        url: "/toDelMenu",
        type: "post",
        data: arr,
        dataType: "json",
        success: function (result) {

            if (result.State == 0) {//删除成功
                if (flag) {//父菜单和子菜单都删除

                    var str = "#delParentType" + " option[value=" + mainId + "]";
                    $(str).remove();


                    $.each(commonSubMenu, function (n, value) {//这里显示用户的名字
                        if (value.Pid == mainId) {

                            var str = "#delSonType" + " option[value=" + value.Id + "]";
                            $(str).remove(); //删除子菜单
                            //更新全局边变量中的子菜单信息
                            getNewArray(value.Id);

                        }
                    });

                    //找到这时候的父菜单的id
                    var newId = $('#delParentType').val();
                    var newText = $('#delParentType').text();

                    alert("newId="+newId+" newText="+newText);

                    //遍历数组,然后追加到字菜单
                    for(var i=0;i<commonSubMenu.length;i++){
                        if(commonSubMenu[i].Pid==newId){
                            var optionNode = " <option value=" + commonSubMenu[i].Id+ ">" + commonSubMenu[i].Title + "</option>";
                            var $input = $(optionNode)//创建节点
                            $('#delSonType').append($input)
                        }
                    }

                    //删除成功以后设置的样式
                    $("#action2").removeAttr("checked");//取消全选
                    $('#delSonType').removeAttr("disabled");
                    alert("删除成功");

                } else {//只删除子菜单

                    //删除下拉表中的子菜单
                    var str = "#delSonType" + " option[value=" + subId + "]";
                    $(str).remove(); //删除Select中Value='3'的Option

                    getNewArray(subId);
                    alert("删除成功");

                }
            } else {
                alert(result.Message);
            }
        },
        error: function () {
            alert("添加失败");
        }
    });

}

//更改全局变量税局中的子菜单的actionId
function getNewArray(subId) {
    //更新全局变量的数组
    var index = 0;
    for (var i = 0; i < commonSubMenu.length; i++) {
        if (commonSubMenu[i].Id == subId) {

            index++;
            continue;
        }
    }

    var tmpArray = new Array(commonSubMenu.length - index);

    var j = 0;
    for (var i = 0; i < commonSubMenu.length; i++) {
        if (commonSubMenu[i].Id != subId) {

            tmpArray[j] = commonSubMenu[i];
            j++;
        }
    }

    commonSubMenu = tmpArray;
}