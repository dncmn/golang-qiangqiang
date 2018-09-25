//这里发送ajax请求
function sendAjaxRequet() {
    sendAjaxContenClear()//发送异步请求时,所要做的清理工作


    var arr = getInfo()
    if (!arr) {
        return
    }

    var partUrl = confirmUrl();
    var url = "/" + partUrl;
    var selectValue = arr[1];

    data = {"selectValue": selectValue};
    var nickArr = new Array();//玩家昵称
    var idsArr = new Array();//玩家id
    var OpArr = new Array();//操作人
    var dateArr = new Array();//操作时间
    var statusArr = new Array();//状态列表


    if (partUrl == "toForbidList") {//查封账户列表


        $.post(url, data, function (res) {
            var tmp = JSON.parse(res);


            $.each(tmp.AccountInfo, function (n, value) {
                nickArr[n] = value.Name;
                idsArr[n] = value.Id;
                OpArr[n] = value.OpName;
                dateArr[n] = value.Time;
                statusArr[n] = value.Status;
                addForm(  value.Name, value.Id,
                    value.OpName, value.Time, value.Status)

            });

        });
    }

    if (partUrl == "toForbidByName") { //查封权限查询

        $.post(url, data, function (res) {
            var tmp = JSON.parse(res)

            if (tmp.State == 1) {//这里是检验玩家是否存在
                alert(tmp.Message);
                return

            }
            $.each(tmp.AccountInfo, function (n, value) {


                nickArr[n] = value.Name;
                idsArr[n] = value.Id;
                OpArr[n] = value.OpName;
                dateArr[n] = value.Time;
                statusArr[n] = value.Status;
                addForm2( n, value.Name, value.Id,
                    value.OpName, value.Time, value.Status)
            });

        });
    }


}
/*
 当是“正常”按钮时
 * 点击，判断是否授权
 * 如果授权
 新创建一个记录
 记录玩家昵称，玩家id，授权人名称，授权时间，状态
 否则
 没有任何操作
 *
 *
 * */

function requestUserPower(nickName, userId, trId, btnId) {



    var isPower = confirm("是否对玩家进行封号");
    //1、给玩家授权
    if (isPower) {

        //获取当前管理员的姓名
        var name = getCookie("user");//当前操作的管理员的名字

        //创建授予权限行的行id
        var grantTrId = "grant" + new Date().getTime();

        //创建特权按钮的id
        var calBtnId = "cal" + parseInt(new Date().getTime())


        //构建新建时间
        var timeStr = getTimeToMinuteStr() + ":" + new Date().getSeconds();
        var nodeInfo = "<tr id='" + grantTrId + "'>" +
            "<td>" + nickName + "</td>" +
            "<td>" + userId + "</td>" +
            "<td>" + name + "</td>" +
            "<td>" + timeStr + "</td><td>" +// ''"+grantTrId+"','"+calBtnId+"','"+nickName+"','"+userId+"'
            "<input type='button' value='特权' id='" + calBtnId + "' onclick='requestCanclePower(\"" + grantTrId + "\",\"" + calBtnId +  "\",\"" + nickName + "\",\"" + userId +"\")'>" +
            "</td></tr>";




        /*
         * 新创建一个节点，这个节点的操作人员是通过共享变量来获取
         * */



        //这里不添加时间了,就是程序获取吧
        var arr = {"userId": userId, "userName": nickName, "opName": name, "status": 2}//0:正常,1:取消,2:特权

        //
        /*
         *
         *
         * 向服务器发送请求，告知这个用户被授权了
         * */
        $.ajax({
            url: "/HandAccountLog",
            type: "post",
            data: arr,
            dataType: "json",
            success: function (result) {
                if (result.State == 1) {
                    alert("授权失败");
                    return
                }
                if (result.State == 0) {//登录成功
                    var $input = $(nodeInfo)//创建节点

                    var insertIndex = '#' + trId;
                    $input.insertBefore($(insertIndex))//插入节点

                    var btnIndex = '#' + btnId;
                    $(btnIndex).attr("disabled", "disabled");
                }


            },
            error: function () {
                alert("操作失败");
                return


            }
        });


    }

}

function requestCanclePower(trId, calBtnId,nickName,userId) {



    var timeStr = getTimeToMinuteStr() + ":" + new Date().getSeconds();
    var isCancleBool = confirm("是否取消特权");
    if (isCancleBool) {


        var name=getCookie("user");

        var calTrId = "tr" + new Date().getTime();
        var normalTrId = "normal" + new Date().getTime();
        var normalBtnId = "norBtn" + new Date().getTime();
        //创建取消节点的行
        var nodeInfo = "<tr id='" + calTrId + "'>" +
            "<td>" + nickName + "</td>" +
            "<td>" + userId + "</td>" +
            "<td>" + name + "</td>" +
            "<td>" + timeStr + "</td>" +
            "<td>" + "取消" + "</td>" +
            "</tr>";


        ////创建正常状态的行
        var normalNodeInfo = "<tr id='" + normalTrId + "'>" +
            "<td>" + nickName + "</td>" +
            "<td>" + userId + "</td>" +
            "<td>" + "" + "</td>" +
            "<td>" + "" + "</td>" +
            "<td>" + "<input type='button' id='" + normalBtnId + "' value='正常' onclick='requestUserPower(\""+nickName+"\",\""+userId+"\",\"" + normalTrId + "\",\"" + normalBtnId + "\")'/>" + "</td>" +
            "</tr>";

        /*
         * 新创建一个节点，这个节点的操作人员是通过共享变量来获取
         * */
        var $input = $(nodeInfo)//创建节点

        var $normal = $(normalNodeInfo)//创建正常节点

        var insertIndex = '#' + trId;


        $input.insertBefore($(insertIndex))//插入节点
        $normal.insertBefore($input)//插入正常节点


        //禁用特权按钮

        var calBtnIndex = '#' + calBtnId

        $(calBtnIndex).attr("disabled", "disabled");

        /*
         * 向服务器发送请求，告诉我进行了哪儿些操作
         * 是否取消特权
         *
         * */

        var arr = {"userId": userId, "userName": nickName, "opName": name, "status": 1}//0:正常,1:取消,2:特权
        $.ajax({
            url: "/CancleForbidAccountLog",
            type: "post",
            data: arr,
            dataType: "json",
            success: function (result) {



            },
            error: function () {
                alert("操作失败");
                return


            }
        });


    }

}

/*
 * 这个操作是按照时间进行倒序排序的
 *
 * */

function addForm2( index, nickArr, idsArr, OpArr, OpTimeNumArr, StatusArr) {


    if (index == 0) { //判断新增加的这一行是否是最新的
        if (StatusArr == 0 || StatusArr == 1) {//代表正常

            var inputNode = document.createElement("input");
            inputNode.setAttribute("type", "button");
            inputNode.setAttribute("value", "正常");

            var btnId = "btn" + parseInt(new Date().getTime())

            inputNode.setAttribute("id", btnId)
            var tr1Id = new Date().getTime();
            var msg = requestUserPower.bind(null, nickArr, idsArr, tr1Id, btnId)
            inputNode.onclick = msg;

        }

        if (StatusArr == 2) {//代表权限
            var inputNode = document.createElement("input");
            inputNode.setAttribute("type", "button");
            inputNode.setAttribute("value", "特权");
            var btnId = "cancle" + parseInt(new Date().getTime())
            inputNode.setAttribute("id", btnId)
            var msg = requestCanclePower.bind(null, tr1Id, btnId,nickArr,idsArr)
            inputNode.onclick = msg;
        }


        var parent = document.getElementById("trParent2")

        //新创建一行,并把当前时间的毫秒值当做id赋值给他
        var tr1 = document.createElement("tr")

        tr1.setAttribute("id", tr1Id);


        var td1 = document.createElement("td")
        var td2 = document.createElement("td")
        var td3 = document.createElement("td")
        var td4 = document.createElement("td")
        var td5 = document.createElement("td")

        td1.innerHTML = nickArr;
        td2.innerHTML = idsArr;
        td3.innerHTML = OpArr;
        td4.innerHTML = OpTimeNumArr;
        td5.appendChild(inputNode);


        tr1.appendChild(td1);
        tr1.appendChild(td2);
        tr1.appendChild(td3);
        tr1.appendChild(td4);
        tr1.appendChild(td5);
        parent.appendChild(tr1);
    } else { //不是第一行的记录


        var parent = document.getElementById("trParent2")

        //新创建一行,并把当前时间的毫秒值当做id赋值给他
        var tr1 = document.createElement("tr")
        var tr1Id = new Date().getTime();
        tr1.setAttribute("id", tr1Id);


        var td1 = document.createElement("td")
        var td2 = document.createElement("td")
        var td3 = document.createElement("td")
        var td4 = document.createElement("td")
        var td5 = document.createElement("td")

        td1.innerHTML = nickArr;
        td2.innerHTML = idsArr;
        td3.innerHTML = OpArr;
        td4.innerHTML = OpTimeNumArr;

        if (StatusArr == 0) {
            td5.innerHTML = "正常"
        } else if (StatusArr == 1) {
            td5.innerHTML = "解除"
        } else {
            td5.innerHTML = "特权"
        }

        tr1.appendChild(td1);
        tr1.appendChild(td2);
        tr1.appendChild(td3);
        tr1.appendChild(td4);
        tr1.appendChild(td5);
        parent.appendChild(tr1);
    }


}

/**/

function requestPower(idsArr, trId,name,id,op_name) {


    var liIndex = getIndex2() + 1;

    var isCancle = confirm("是否解除权限");
    if (isCancle) {

        //点击取消按钮后,这条记录就会被删掉,同时向游戏服务器发送请求
        var tbody = document.getElementById("trParent1")
        var tr = document.getElementById(trId)
        tbody.removeChild(tr);

        /*
         * 包括操作人，操作时间，被操作用户的id
         * 如何获取操作人的信息，就是设置权限以后--改正的
         * */
        //开始向服务器发送请求,说明这个玩家已经被解除权限

        //向服务器发送一条http请求,然后更改该物体的权限
        var arr = {"userId": id, "userName": name, "opName": op_name, "status": 1}//0:正常,1:取消,2:特权
        $.ajax({
            url: "/CancleForbidAccountLog",
            type: "post",
            data: arr,
            dataType: "json",
            success: function (result) {



            },
            error: function () {
                alert("操作失败");
                return


            }
        });


        return
    }

}


/*  向表中添加节点---  这是用在三个表头内容一样的情况下使用的
 *  向表中添加数据-- 根据选中的li来判断 生成的列数
 *
 *  StatusArr:
 *      0:是一个按钮，表示是否要授权
 *      1:是一个状态,代表结束
 *      2:是一个按钮,表示是否取消授权
 *
 * */
function addForm(nickArr, idsArr, OpArr, OpTimeNumArr, StatusArr) {
    var index = getIndex2();

    var tr1Id = idsArr + new Date().getTime();


    //权限列表
    if (index == 0) {
        if (StatusArr == 0) {
            var inputNode = document.createElement("input");
            inputNode.setAttribute("type", "button");
            inputNode.setAttribute("value", "正常");

            inputNode.setAttribute("onClick", "alert('是否授予特权')");

        }

        if (StatusArr == 2) {
            var inputNode = document.createElement("input");
            inputNode.setAttribute("type", "button");
            inputNode.setAttribute("value", "特权");
            inputNode.setAttribute("id", tr1Id);
            inputNode.setAttribute("onClick", "requestPower()");

            var msg = requestPower.bind(null, idsArr, tr1Id,nickArr,idsArr,OpArr)
            inputNode.onclick = msg;
        }


        var parent = document.getElementById("trParent1")
        var tr1 = document.createElement("tr")
        tr1.setAttribute("id", tr1Id);
        var td1 = document.createElement("td")
        var td2 = document.createElement("td")
        var td3 = document.createElement("td")
        var td4 = document.createElement("td")
        var td5 = document.createElement("td")

        td1.innerHTML = nickArr;
        td2.innerHTML = idsArr;
        td3.innerHTML = OpArr;
        td4.innerHTML = OpTimeNumArr;

        if (StatusArr != 1) {
            td5.appendChild(inputNode);
        } else {
            td5.innerHTML = "解除"
        }

        tr1.appendChild(td1);
        tr1.appendChild(td2);
        tr1.appendChild(td3);
        tr1.appendChild(td4);
        tr1.appendChild(td5);
        parent.appendChild(tr1);
    }


}

//确定li的索引对应的url--ajax发送异步请求的时候需要用到
//确定li的索引对应的url--ajax发送异步请求的时候需要用到
function confirmUrl() {

    var urlArray = new Array()
    urlArray[0] = "toForbidList"; //查封列表
    urlArray[1] = "toForbidByName";//根据你玩家昵称或者玩家id查找玩家信息
    return urlArray[getIndex2()]
}


//在发送ajax请求之情做的清理工作
function sendAjaxContenClear() {

    var liIndex = getIndex2() + 1
    //删除表格内容
    var trParentIndex = '#trParent' + liIndex
    $(trParentIndex).html("")
}
/* 清空页面,然后禁用按钮 */
function clearContent() {
    //清空数据和设置按钮禁用属性
    $('#selectTime').val("");
    $('#selectName').val("");
    var liIndex = getIndex2() + 1;
    var trParentIndex = '#trParent' + liIndex;
    $(trParentIndex).html("")
}
$(function () {
    window.onload = function () {


        $li = $('#tab li')
        $li.click(function () {


            $this = $(this); //获取点击获取的对象

            $liIndex = $this.index(); //获取点击的序号

            if ($liIndex == 1) {


                $('#son1').hide();  //不同的表格的显示和隐藏
                $('#son2').show();

                $('#form2').show();
                $('#form1').hide();


            } else {

                $('#son2').hide();
                $('#son1').show();

                $('#form1').show();
                $('#form2').hide();

            }

            for (var i = 0; i < $li.length; i++) {
                $li[i].removeAttribute("class")
            }
            $this.addClass('current')
            clearContent()

        });
    }
});


//确定选中的li的索引
function getIndex2() {

    var ul = document.getElementById("tab");
    var lis = ul.getElementsByTagName("li");

    for (var i = 0; i < lis.length; i++) {
        if (lis[i].hasAttribute("class")) {

            return i
        }

    }

}


/*  获取数据
 0 li的文本值
 1 选择的时间或者输入玩家的昵称或id



 --根据li的索引,判断生成的data数组的长度 */
function getInfo() {

    var liIndex = getIndex2() + 1; //获取选中的li的值

    if (liIndex == 1) {
        var selectValue = document.getElementById("selectTime").value;
    } else {
        var selectValue = document.getElementById("selectName").value;
    }
    var re = new RegExp("^[ ]+$");
    if (selectValue == "" || selectValue == null || re.test(selectValue)) {
        alert("查询条件不能为空");
        return false;
    }


    var data = new Array(2);
    var ul = document.getElementById("tab");
    var lis = ul.getElementsByTagName("li");

    //查看按钮判断是否可以继续向下执行
    for (var i = 0; i < lis.length; i++) {
        if (lis[i].hasAttribute("class")) {

            data[0] = lis[i].innerHTML
            break
        }

    }

    data[1] = selectValue

    return data;


}

