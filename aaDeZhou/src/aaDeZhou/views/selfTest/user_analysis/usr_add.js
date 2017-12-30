//1、获取选中的li
window.onload = function () {
    $li = $('#parent li')
    $li.click(function () {
        //获取到点击的对象
        $this = $(this)

        //找到点击对象的索引
        $index = $this.index()

        //去掉所有li的class属性
        for (var i = 0; i < $li.length; i++) {
            $li[i].removeAttribute("class") //jquery删除属性

        }
        //给选中的li添加上这个属性
        $this.addClass("current")

    });
}

function getInfo() {
    var ul = document.getElementById("parent")
    var lis = ul.getElementsByTagName("li")

    for (var i = 0; i < lis.length; i++) {
        if (lis[i].hasAttribute("class")) {

            var msg = '#son' + i;
            $(msg).show()
            $(msg).siblings().hide()
//                    alert(lis[i].innerHTML)
//                    return i
        }

    }
}


function getString() {
    //   '#son1'
    var i = 2
    var msg = '#son' + i
    alert(msg)
}


function createEle() {
    var trParent = document.getElementById("trParent0")
    var tdCounts = document.getElementById("thHead1").children.length;
    /*
    *
    * tr的数量由返回的数据的数组长度来确定
    * td的数量由thead的th的数量来决定
    * */
    var tr = document.createElement("tr")
    var td1 = document.createElement("td")
    var td2 = document.createElement("td")
    var td3 = document.createElement("td")

    td1.innerHTML = "003"
    td2.innerHTML = "2017-07-02"
    td3.innerHTML = "8000"

    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)

    trParent.appendChild(tr)

}
