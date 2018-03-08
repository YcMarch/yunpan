window.onload = function () {

    var body = document.querySelector('body');
    // 给 body 设置高度 为 浏览器可视高度
    body.style.height = document.documentElement.clientHeight + 'px';

    // -----------------封装操作数据的方法------------------

    function getChildsById(id){
        var arr = [];
        for(var attr in data){
            if(data[attr].pid == id){
                arr.push(data[attr])
            }
        }
        return arr;
    }
    var contBoxLeft = document.querySelector('.contBoxLeft');
    var initId = -1;

    //  生成左侧树形菜单----------------------------------

    function createTreeHtml(id,level) {
        var childs = getChildsById(id);
        var treeHtml = '';
        level++;
            if(childs.length > 0){
                treeHtml += '<ul class="treeBox">';
                for( var i = 0; i < childs.length; i++ ){
                    var childsHtml = createTreeHtml(childs[i].id,level);
                    var classTreeIco = childsHtml == '' ? '' : 'wjjtyou';
                    treeHtml += `<li><div  data-id="${childs[i].id}"  style="padding-left: ${level*30}px;" class="${classTreeIco}"><span><em>${childs[i].title}</em></span></div>${childsHtml}</li>`
                }
                treeHtml += '</ul>';
            }
        return treeHtml;
    }
    contBoxLeft.innerHTML = createTreeHtml(initId,-1);



    //  给左侧菜单加高亮----------------------

    function positionDiv(id){
        // 记录上次
        if(contBoxLeft.targetSpan){

            contBoxLeft.targetSpan.classList.remove('divAct')
        }
        var treeTargetSpan = contBoxLeft.querySelector(`div[data-id="${id}"]`);
        treeTargetSpan.classList.add('divAct');

        // 在这个元素上自定义一个属性，用来存已经加active的span
        contBoxLeft.targetSpan = treeTargetSpan;
    }

    positionDiv(0);


    //  生成面包屑结构----------------------------------------
    function getParentsById(id){
        var arr = [];
        var currentData = data[id];
        if(currentData){
            arr.push(currentData);
            arr = arr.concat(getParentsById(currentData.pid))
        }
        return arr;
    }

    var crumbs = document.querySelector('.crumbs');
    function createNavHtml(id){
        var navData = getParentsById(id).reverse();
        var navHtml = '';
        for( var i = 0; i < navData.length - 1; i++ ){
            navHtml += `<a data-id = '${navData[i].id}' href="javascript:;">${navData[i].title}</a><i></i>`
        }
        navHtml += `<a class="crumbsEnd" href="javascript:;">${navData[navData.length - 1].title}</a>`;
        return navHtml;  //  将导出 导航的结构
    }
    crumbs.innerHTML = createNavHtml(0);

    //  生成右侧内容结构-------------------------------

    var fileID = 0;
    var TabStyleOne = document.querySelector('.TabStyleOne');
    var NoCont = document.querySelector('.NoCont');

    function createFileHtml(id) {
        var childensId = getChildsById(id);
        var TabStyleOneHtml = '';
        for(var i = 0;i<childensId.length;i++){
            TabStyleOneHtml += `
                    <li>
                        <div data-id = '${childensId[i].id}' class="TabStyleOneTable">
                            <div class="wjjImg"><img src="images/wjjimg_03.png"></div>
                            <div class="wjjTit">${childensId[i].title}</div>
                            <i></i>
                        </div>
                    </li>
        `
        }
        return TabStyleOneHtml;
    }

    TabStyleOne.innerHTML = createFileHtml(fileID);

   //   交互生成面包屑导航

    var contBoxLeft = document.querySelector('.contBoxLeft');

    t.on(contBoxLeft,'click',function (ev){
        contBoxRTopInput.classList.remove('act');
        actNum = 0;
        var target = ev.target;
        if(target.nodeName === 'UL') return;
        if(target.nodeName === 'EM'){
            target = target.parentNode.parentNode
        }else if (target.nodeName === 'SPAN') {
            target = target.parentNode
        }else if (target.nodeName === 'LI') {
            target = target.firstElementChild
        }
        var id = target.dataset.id;
        crumbs.innerHTML = createNavHtml(id);

        var FileHtml = createFileHtml(id);

        if(FileHtml == ''){
            NoCont.style.display = 'block';
            TabStyleOne.innerHTML = '';
        }else {
            NoCont.style.display = 'none';
            TabStyleOne.innerHTML = FileHtml;
        }
        positionDiv(id);
    });

    //  面包屑的交互--------------------------------

    t.on(crumbs,'click',function (ev) {
        actNum = 0;
        contBoxRTopInput.classList.remove('act');
        var target = ev.target;

        if(ev.target.nodeName == 'A'){
            var id = ev.target.dataset.id;
            crumbs.innerHTML = createNavHtml(id);
            var FileHtml = createFileHtml(id);
            if(FileHtml == ''){
                NoCont.style.display = 'block';
                TabStyleOne.innerHTML = '';
            }else {
                NoCont.style.display = 'none';
                TabStyleOne.innerHTML = FileHtml;
            }
            positionDiv(id)
        }
    });

    //  文件区域交互
    var actNum = 0;
    t.on(TabStyleOne,'click',function (ev) {
        contBoxRTopInput.classList.remove('act');
        var target = ev.target;

        if(target.classList.contains('TabStyleOne')) return;

        if(target.classList.contains('wjjImg') || target.classList.contains('wjjTit')){
            target = target.parentNode;
        }else if(target.nodeName == 'IMG'){
            target = target.parentNode.parentNode;
        }

        if(target.nodeName == 'I'){

            target = ev.target;
            var targetParent = target.parentNode.parentNode;

            if(targetParent.classList.contains('act')){
                actNum--;
                if(actNum<0){
                    actNum = 0;
                }
                target.classList.remove('act');
                targetParent.classList.remove('act');
                contBoxRTopInput.classList.remove('act');

            }else {

                target.classList.add('act');
                targetParent.classList.add('act');
                actNum++;
                if(actNum==TabStyleOneTable.length){
                    contBoxRTopInput.classList.add('act');
                }
            }
            return false
        }


        var id = target.dataset.id;
        crumbs.innerHTML = createNavHtml(id);
        positionDiv(id);
        var FileHtml = createFileHtml(id);

       if(FileHtml == ''){
           NoCont.style.display = 'block';
           TabStyleOne.innerHTML = '';
       }else {
           NoCont.style.display = 'none';
           TabStyleOne.innerHTML = FileHtml;
       }
    })

    // 点击全选
    var TabStyleOneTable = document.getElementsByClassName('TabStyleOneTable');

    var contBoxRTopInput = document.querySelector('.contBoxRTopInput');

   t.on(contBoxRTopInput,'click',function (ev) {
       var target = ev.target;

       if(target.classList.contains('act')){
           target.classList.remove('act');
           for(var i =0;i<TabStyleOneTable.length;i++){
               var TabStyleOneTableI = TabStyleOneTable[i].querySelector('i');
               var TabStyleOneTableParent = TabStyleOneTable[i].parentNode;
               TabStyleOneTableI.classList.remove('act');
               TabStyleOneTableParent.classList.remove('act');
           }
       }else {
           target.classList.add('act');
          for(var i =0;i<TabStyleOneTable.length;i++){
              var TabStyleOneTableI = TabStyleOneTable[i].querySelector('i');
              var TabStyleOneTableParent = TabStyleOneTable[i].parentNode;
              TabStyleOneTableI.classList.add('act');
              TabStyleOneTableParent.classList.add('act');
          }
       }
   })

    // 上面一排的功能的交互

    var delBtn = document.querySelector('.delBtn');

    delBtn.onclick = function () {
        contBoxRTopInput.classList.remove('act');
        var lis = document.querySelectorAll('.TabStyleOne li');

        var pidd = 0;
        for(var i =0;i<lis.length;i++){
            /*if(lis[i].classList.contains('act')){
                lis[i].remove();
            }*/

            if(lis[i].classList.contains('act')){
               var d= lis[i].children[0].dataset.id;
               pidd = data[d].pid;

               delete  data[d];

               TabStyleOne.innerHTML = createFileHtml(pidd); // 渲染右侧结构
                crumbs.innerHTML = createNavHtml(pidd);  // 渲染面包屑结构
                contBoxLeft.innerHTML = createTreeHtml(initId,-1); // 生成左侧结构

            }
        }
    }

};




