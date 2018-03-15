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
    //var currentId = 0;
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
    function positionDiv(id,parent){
        parent = parent || contBoxLeft;
        // 记录上次
        if(parent.targetSpan){
            parent.targetSpan.classList.remove('divAct')
        }
        var treeTargetSpan = parent.querySelector(`div[data-id="${id}"]`);
        treeTargetSpan.classList.add('divAct');

        // 在这个元素上自定义一个属性，用来存已经加active的span
        parent.targetSpan = treeTargetSpan;
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
                            <input type="text" class="wjjInput">
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
        fileID = id
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
            fileID = id
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
        }
        if(target.nodeName == 'I'){
            target = ev.target;
            var targetParent = target.parentNode.parentNode;

            if(targetParent.classList.contains('act')){

                actNum--;
                target.classList.remove('act');
                targetParent.classList.remove('act');
                contBoxRTopInput.classList.remove('act');
            }else {
                actNum++;
                target.classList.add('act');
                targetParent.classList.add('act');
                if(actNum==TabStyleOneTable.length){
                    contBoxRTopInput.classList.add('act');
                }
            }
            return
        }
        if(target.nodeName == 'INPUT'){
            return
        }
        contBoxRTopInput.classList.remove('act')
        var id = target.dataset.id;
        crumbs.innerHTML = createNavHtml(id);
        positionDiv(id);
        fileID = id
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
        if(rechristenBtn.isRelFile){
            return;
        }

        var regionDiv = document.createElement('div');
        regionDiv.classList.add('regionDiv');

        var disX = ev.clientX;
        var disY = ev.clientY;
        regionDiv.style.top = disY + 'px';
        regionDiv.style.left = disX + 'px';
        TabStyleOne.isAppend = false;
        function moveFn(ev) {

            var fanwei = (Math.abs(ev.clientX - disX) > 10 || Math.abs(ev.clientY - disY) > 10)
            if( fanwei &&  !TabStyleOne.isAppend){
                document.body.appendChild(regionDiv);
                TabStyleOne.isAppend = true;
            }

            regionDiv.style.width = Math.abs(ev.clientX - disX) + 'px';
            regionDiv.style.height = Math.abs(ev.clientY - disY) + 'px';
            regionDiv.style.left = Math.min(ev.clientX,disX) + 'px';
            regionDiv.style.top = Math.min(ev.clientY,disY) + 'px';

            // 判断一下是否和文件碰上
            if(fanwei){

                for( var i = 0; i < TabStyleOneTable.length; i++ ){
                    console.log(t.isDung(regionDiv,TabStyleOneTable[i]));
                    if(t.isDung(regionDiv,TabStyleOneTable[i])){
                        TabStyleOneTable[i].parentNode.classList.add('act');
                        TabStyleOneTable[i].lastElementChild.classList.add('act')
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
                    actNum = m;
                }
            }
        }
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

    // 找指定id所有的子孙数据
    function getChildsAllById(id){
        //data[id]
        // 哪一个pid等于id，就是子级
        var arr = [];
        for(var attr in data){
            if(data[attr].pid == id){
                arr.push(data[attr]);
                arr = arr.concat(getChildsAllById(attr))
            }
        }
        return arr;
    }
    function getChildsAllByIdAndSelf(id){
        // [].concat(1,[2,3,4,5])
        return [].concat(data[id],getChildsAllById(id));
    }

    //  删除功能--------------------------------------------------

    var delBtn = document.querySelector('.delBtn');
    var isDel = document.querySelector('.isDel');
    delBtn.onclick = function () {
        var lisAct = document.querySelectorAll('.TabStyleOne li.act');
        if(lisAct.length == 0){
            hintSelectFile.style.opacity = '1';
            hintSelectFile.style.top = '16px';
            RelFile.style.opacity = '0';
            RelFile.style.top = '0';
            return;
        }

        isDel.style.display = 'block';
    };

    var idDelOk = document.querySelector('.idDelOk');
    var idDelNo = document.querySelector('.idDelNo');
    var SLTopCloseDel = document.querySelector('.isDel .SL-TopClose');

    idDelOk.onclick = function () {
        contBoxRTopInput.classList.remove('act');
        var lis = document.querySelectorAll('.TabStyleOne li');
        var pidd = 0;
        for(var i =0;i<lis.length;i++){
            if(lis[i].classList.contains('act')){
                var d= lis[i].children[0].dataset.id;
                pidd = data[d].pid;
                delete  data[d];
                var arr = getChildsAllById(d);

                for(var j = 0;j<arr.length;j++){
                    delete data[arr[j].id]
                }
                if(createFileHtml(pidd) == ''){
                    NoCont.style.display = 'block';
                }else {
                    NoCont.style.display = 'none';
                }
                TabStyleOne.innerHTML = createFileHtml(pidd); // 渲染右侧结构
                crumbs.innerHTML = createNavHtml(pidd);  // 渲染面包屑结构
                contBoxLeft.innerHTML = createTreeHtml(initId,-1); // 生成左侧结构
                positionDiv(pidd);
                actNum = 0;
                fileID = d
            }
        }
        isDel.style.display = 'none';
    };

    t.on(idDelNo,'click',function () {
        isDel.style.display = 'none';
    });
    t.on(SLTopCloseDel,'click',function () {
        isDel.style.display = 'none';
    });
    //  新建文件夹功能--------------------------------------------

    var newFolderBtn = document.querySelector('.newFolderBtn');
    t.on(newFolderBtn,'mouseup',function () {
        NoCont.style.display = 'none';
        var NewLiFile = document.createElement('li'); //  新建节点
        //  给节点中插入内容
        NewLiFile.innerHTML = `<div class="TabStyleOneTable">
                            <div class="wjjImg"><img src="images/wjjimg_03.png"></div>
                            <div class="wjjTit"></div>
                            <input type="text" class="wjjInput" value="">
                            <i></i>
                        </div>`;
        TabStyleOne.insertBefore(NewLiFile,TabStyleOne.firstElementChild);
        var NewLiFileWjjTit = NewLiFile.querySelector('.wjjTit'); // 找到新建 li 中的 文件名
        var NewLiFileWjjInput = NewLiFile.querySelector('.wjjInput'); //  找到新建li 中的 输入框
        NewLiFileWjjTit.style.display = 'none';// 让文件夹的名称隐藏
        NewLiFileWjjInput.style.display = 'block'; //  让新建文件夹的输入框显示
        NewLiFileWjjInput.focus();   //  自动获取新建文件夹输入框的焦点
        newFolderBtn.isNewLiFile = true; //  添加一个标识，代表正在新建文件夹中

    });

    function isCunzaiNameById(id,name){
        var childs = getChildsById(id);
        for( var i = 0; i < childs.length; i++ ){
            if(childs[i].title === name){
                return true;
            }
        }
        return false;
    }
    function NewFileFn(ev) {
        if(newFolderBtn.isNewLiFile){
            var NewLiFile = TabStyleOne.firstElementChild;
            var NewLiFileWjjTit = NewLiFile.querySelector('.wjjTit');
            var NewLiFileWjjInput = NewLiFile.querySelector('.wjjInput');
            var value = NewLiFileWjjInput.value.trim();
            if(!value){
                NewLiFile.remove();
                var lis = TabStyleOne.querySelectorAll('li');
               if(lis.length == 0){
                   NoCont.style.display = 'block';
               }
            }else if(isCunzaiNameById(fileID,value)){
                NewLiFile.remove();
            }else{
                NewLiFileWjjTit.style.display = 'block';
                NewLiFileWjjInput.style.display = 'none';
                NewLiFileWjjTit.innerHTML = value;
                // 添加在data中
                var id = Date.now();
                var obj = {
                    id:id,
                    pid:fileID,
                    title: value
                };
                data[id] = obj;
                contBoxLeft.innerHTML = createTreeHtml(-1,-1);
                positionDiv(fileID);
                NewLiFile.firstElementChild.setAttribute('data-id',id)
            }
            newFolderBtn.isNewLiFile = false;
        }
    }
    t.on(document,'mousedown',NewFileFn);
    t.on(document,'keydown',function (ev){
        if(ev.keyCode === 13){
            NewFileFn(ev);
        }
    });
    //  重命名------------------------------------------
    var rechristenBtn = document.querySelector('.rechristenBtn');
    var hintSelectFile = document.querySelector('.hintSelectFile');
    var RelFile = document.querySelector('.RelFile');

    t.on(rechristenBtn,'mouseup',function (ev) {
       var lis = TabStyleOne.querySelectorAll('li.act');
        if(lis.length == 0){
            hintSelectFile.style.opacity = '1';
            hintSelectFile.style.top = '16px';
            RelFile.style.opacity = '0';
            RelFile.style.top = '0';
        }else if(lis.length >= 2){
            hintSelectFile.style.opacity = '0';
            hintSelectFile.style.top = '0';
            RelFile.style.opacity = '1';
            RelFile.style.top = '16px';
        }else {
            hintSelectFile.style.opacity = '0';
            hintSelectFile.style.top = '0';
            RelFile.style.opacity = '0';
            RelFile.style.top = '0';
            //  选中了一项
            var wjjTit = TabStyleOne.querySelector('li.act .wjjTit');
            var wjjInput = TabStyleOne.querySelector('li.act .wjjInput');
            wjjTit.style.display = 'none';
            wjjInput.style.display = 'block';
            wjjInput.value = wjjTit.innerHTML;
            //wjjInput.focus();
            wjjInput.select();
            rechristenBtn.isRelFile = true;
        }
    });
    t.on(document,'mousedown',function (ev) {

        var target = ev.target;

        if(target.nodeName == 'INPUT'){
            return;
        }

        hintSelectFile.style.opacity = '0';
        hintSelectFile.style.top = '0';
        RelFile.style.opacity = '0';
        RelFile.style.top = '0';

        if(rechristenBtn.isRelFile){
            var wjjTit = TabStyleOne.querySelector('li.act .wjjTit');
            var wjjInput = TabStyleOne.querySelector('li.act .wjjInput');
            var value = wjjInput.value.trim();
            var liact = TabStyleOne.querySelector('li.act');
            var id = liact.firstElementChild.dataset.id;
            if(!value){
                wjjTit.style.display = 'block';
                wjjInput.style.display = 'none';
            }else if(isCunzaiNameById(fileID,value)){
                wjjTit.style.display = 'block';
                wjjInput.style.display = 'none';
            }
            wjjTit.style.display = 'block';
            wjjInput.style.display = 'none';
            wjjTit.innerHTML = wjjInput.value;
            var title = value;
            data[id].title = title;
            contBoxLeft.innerHTML = createTreeHtml(initId,-1);
            rechristenBtn.isRelFile = false;
        }
        return
    });

    //  移动到 -----------------------------------------------------

    var moveBtn = document.querySelector('.moveBtn');
    var storageLocation = document.querySelector('.storageLocation');
    var SLCont = document.querySelector('.SL-cont');
    var qxBtn = document.querySelector('.qxBtn');
    var SLTopClose = document.querySelector('.SL-TopClose');
    var okBtn = document.querySelector('.okBtn');

    t.on(moveBtn,'mouseup',function (ev) {
        var lis = TabStyleOne.querySelectorAll('li.act');
        if(!lis.length>0){
                hintSelectFile.style.opacity = '1';
                hintSelectFile.style.top = '16px';
                RelFile.style.opacity = '0';
                RelFile.style.top = '0';
        }else {
            SLCont.innerHTML = createTreeHtml(initId,-1);
            storageLocation.style.display = 'block';
            positionDiv(0,SLCont);
        }
    });

    //给SLCont 添加点击事件

    t.on(SLCont,'click',function (ev) {

        var target = ev.target;

        if(ev.target.nodeName == 'SPAN'){
            target = ev.target.parentNode;
        }else if(ev.target.nodeName == 'EM'){
            target = ev.target.parentNode.parentNode;
        }

        var id = target.dataset.id;
        var lis = TabStyleOne.querySelectorAll('li.act');  // 选中的文件
        positionDiv(id,SLCont);

        var isParent = false;
        for(var i = 0;i<lis.length;i++){
            var fileId = lis[i].firstElementChild.dataset.id;

            if(data[fileId].pid== id){
                alert('文件已经在父级下了，不用移动');
                isParent = true;
                break;
            }
            var childs = getChildsAllByIdAndSelf(fileId);
            var len = childs.filter(function (item){
                return item.id == id;
            }).length;
            if(len){
                alert('不能将文件移动到自身或其子文件夹下');
                isParent = true;
                break;
            }
        }
        if(!SLCont.isClick){
            SLCont.isClick = true;
            t.on(okBtn,'click',function (ev) {

                if(!isParent){
                    var pidd = ''
                    for(var i = 0;i<lis.length;i++){
                        var fileId = lis[i].firstElementChild.dataset.id;
                        pidd = data[fileId].pid;
                        data[fileId].pid = id;

                    }

                    contBoxLeft.innerHTML = createTreeHtml(-1,-1);
                    TabStyleOne.innerHTML = createFileHtml(pidd);
                    storageLocation.style.display = 'none';
                    actNum = 0;
                    positionDiv(pidd);
                    contBoxRTopInput.classList.remove('act');
                    var limove = TabStyleOne.querySelectorAll('li');

                    if(limove.length == 0){
                        NoCont.style.display = 'block';
                    }
                }
                SLCont.isClick = false;
            })
        }
    });

    //  关闭掉
    function closeSLFn() { // 关闭存储到的函数
        storageLocation.style.display = 'none';
    }
    t.on(qxBtn,'click',closeSLFn);
    t.on(SLTopClose,'click',closeSLFn)
};