//1����ȡѡ�е�li
window.onload = function () {
    $li = $('#parent li')
    $li.click(function () {
        //��ȡ������Ķ���
        $this = $(this)

        //�ҵ�������������
        $index = $this.index()

        //ȥ������li��class����
        for (var i = 0; i < $li.length; i++) {
            $li[i].removeAttribute("class") //jqueryɾ������

        }
        //��ѡ�е�li������������
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
    * tr�������ɷ��ص����ݵ����鳤����ȷ��
    * td��������thead��th������������
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
