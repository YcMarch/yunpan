window.onload = function () {

    var body = document.querySelector('body');
    // 给 body 设置高度 为 浏览器可视高度
    body.style.height = document.documentElement.clientHeight + 'px';


    var contBoxLeft = document.querySelector('.contBoxLeft');

    /*function render(data, id) {
        var html = '<ul class="treeBox">';
        for (var attr in data) {
            if (data[attr].pid == id) {
                //取得id
                var dataId = data[attr].id;
                var html2 = '<li>';
                html2 += '<span><em>' + data[attr].title + '</em></span>';
                html2 += render(data, dataId);
                html += html2;
                html += '</li>';
            }
        }
        html += '</ul>';
        return html;
    }*/

    var html = '';
    function render(item,id){
        for(var i in item){
            if(item[i].pid === id){
                html += `<ul class="treeBox">
                    <li>
                    <span><em>${item[i].title}</em></span>`;

                render(item,item[i].id);
                html += `</li></ul>`;
            }
        }
        return html;
    }

    contBoxLeft.innerHTML = render(data, -1);

    var spans = document.querySelectorAll('span');

    for (var i = 0; i < spans.length; i++) {
        if (spans[i].nextElementSibling) {
            spans[i].className = 'wjjtyou';
        } else {
            spans[i].className = '';
        }
    }

};




