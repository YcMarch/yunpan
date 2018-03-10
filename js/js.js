window.onload = function () {

    var body = document.querySelector('body');
    // 给 body 设置高度 为 浏览器可视高度
    body.style.height = document.documentElement.clientHeight + 'px';

    // -----------------封装操作数据的方法------------------

    function getChildsById(id){
        var arr = [];
        for(var attr in data){   //  循环data对象，
            if(data[attr].pid == id){  // 如果data的 key值 下的pid   等于  传进来的 id 值
                arr.push(data[attr])   // 那么就把他的key值 插入到  arr 中
            }
        }
        return arr;  //  把 arr return出去
    }
    var contBoxLeft = document.querySelector('.contBoxLeft');
    var initId = -1; // 初始的id  设置为 -1

    //  生成左侧树形菜单----------------------------------

    function createTreeHtml(id,level) {
        var childs = getChildsById(id);
        var treeHtml = '';
        level++;
            if(childs.length > 0){  //  判断一下 childs 的长度 是否 大于 0
                // 如果大于 0  那么就执行， 生成结构
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

    positionDiv(0); //  执行高亮函数
    //  生成面包屑结构----------------------------------------
    function getParentsById(id){
        var arr = [];
        var currentData = data[id];
        if(currentData){
            arr.push(currentData); // 插入到数组中
            arr = arr.concat(getParentsById(currentData.pid))  //  合并数组
        }
        return arr;
    }

    var crumbs = document.querySelector('.crumbs');
    function createNavHtml(id){
        var navData = getParentsById(id).reverse();  //  颠倒数据
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

        var target = ev.target;
        if(target.classList.contains('TabStyleOne')) return;
        if(target.classList.contains('wjjImg') || target.classList.contains('wjjTit')){
            target = target.parentNode;
        }else if(target.nodeName == 'IMG'){
            target = target.parentNode.parentNode;
        }{
            actNum = 0;
            contBoxRTopInput.classList.remove('act');
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
            return
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
    });

    // 点击全选
    var TabStyleOneTable = document.getElementsByClassName('TabStyleOneTable');
    var contBoxRTopInput = document.querySelector('.contBoxRTopInput');
   t.on(contBoxRTopInput,'click',function (ev) {
       var target = ev.target;

       if(NoCont.style.display == 'block') return;  // 如果没有文件，就让全选按钮 停止

       if(target.classList.contains('act')){
           target.classList.remove('act');
           for(var i =0;i<TabStyleOneTable.length;i++){
               var TabStyleOneTableI = TabStyleOneTable[i].querySelector('i');
               var TabStyleOneTableParent = TabStyleOneTable[i].parentNode;
               TabStyleOneTableI.classList.remove('act');
               TabStyleOneTableParent.classList.remove('act');
           }
           actNum = 0;
       }else {
           target.classList.add('act');
          for(var i =0;i<TabStyleOneTable.length;i++){
              var TabStyleOneTableI = TabStyleOneTable[i].querySelector('i');
              var TabStyleOneTableParent = TabStyleOneTable[i].parentNode;
              TabStyleOneTableI.classList.add('act');
              TabStyleOneTableParent.classList.add('act');
          }
           actNum = TabStyleOneTable.length;
       }
   });

   //  框选功能 ----------------------------------

    t.on(TabStyleOne,'mousedown',function (ev) {

        if(NoCont.style.display == 'block') return;

        var regionDiv = document.createElement('div');
        regionDiv.classList.add('regionDiv');

        var disX = ev.clientX;
        var disY = ev.clientY;
        regionDiv.style.top = disY + 'px';
        regionDiv.style.left = disX + 'px';
        TabStyleOne.isAppend = false;
        //  拖动函数
        function moveFn(ev) {

            var fanwei = (Math.abs(ev.clientX - disX) > 10 || Math.abs(ev.clientY - disY) > 10)
            if( fanwei &&  !TabStyleOne.isAppend){
                console.log('超过了范围');
                document.body.appendChild(regionDiv);
                TabStyleOne.isAppend = true;  // 已经进来了
            }

            regionDiv.style.width = Math.abs(ev.clientX - disX) + 'px';
            regionDiv.style.height = Math.abs(ev.clientY - disY) + 'px';
            regionDiv.style.left = Math.min(ev.clientX,disX) + 'px';
            regionDiv.style.top = Math.min(ev.clientY,disY) + 'px';

            // 判断是否和文件碰上
            if(fanwei){

                for( var i = 0; i < TabStyleOneTable.length; i++ ){
                    console.log(t.isDung(regionDiv,TabStyleOneTable[i]));
                    if(t.isDung(regionDiv,TabStyleOneTable[i])){
                        TabStyleOneTable[i].parentNode.classList.add('act');
                        TabStyleOneTable[i].lastElementChild.classList.add('act')
                        //fileAllI[i].classList.add('checked')
                    }else{
                        TabStyleOneTable[i].parentNode.classList.remove('act');
                        TabStyleOneTable[i].lastElementChild.classList.remove('act')
                    }
                }
                var m = 0;
                var TabStyleOneTableI = TabStyleOne.getElementsByTagName('i');
                for( var i = 0; i < TabStyleOneTableI.length; i++ ){
                    if(TabStyleOneTableI[i].classList.contains('act')){
                        m++;
                    }
                }
                if(m === TabStyleOneTableI.length){
                    contBoxRTopInput.classList.add('act');
                    actNum = TabStyleOneTableI.length;
                }else{
                    contBoxRTopInput.classList.remove('act');
                    actNum = m;   // 统计选中的
                }
            }
        }
        // 抬起函数
        function upFn() {
            t.off(document,'mousemove', moveFn);
            t.off(document,'mouseup', upFn);
            regionDiv.remove();
            TabStyleOne.isAppend = false;
        }
        t.on(document,'mousemove',moveFn);
        t.on(document,'mouseup',upFn);
        ev.preventDefault();  //  取消默认行为
    });

    // 上面一排的功能的交互------------------------
    //  删除功能--------------------------------------------------
    var delBtn = document.querySelector('.delBtn');
    delBtn.onclick = function () {
        contBoxRTopInput.classList.remove('act');
        var lis = document.querySelectorAll('.TabStyleOne li');
        var pidd = 0;
        for(var i =0;i<lis.length;i++){
            if(lis[i].classList.contains('act')){
               var d= lis[i].children[0].dataset.id;
               pidd = data[d].pid;
               delete  data[d];
               if(createFileHtml(pidd) == ''){
                   NoCont.style.display = 'block';
               }else {
                   NoCont.style.display = 'none';
               }
                TabStyleOne.innerHTML = createFileHtml(pidd); // 渲染右侧结构
                crumbs.innerHTML = createNavHtml(pidd);  // 渲染面包屑结构
                contBoxLeft.innerHTML = createTreeHtml(initId,-1); // 生成左侧结构
                positionDiv(pidd);
            }
        }
    }

    //  新建文件夹功能--------------------------------------------

    var newFolderBtn = document.querySelector('.newFolderBtn');



};




