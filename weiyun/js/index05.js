;
(function() {
    //找到id所在的对象
    function getObjectById(id) {

        for (var i = 0; i < arr.length; i++) {
            if (arr[i].id == id) {
                return arr[i];
            }
        }
        return null;
    };

    //找到id的所有子级
    function getChildByPid(id) {
        var list = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].pid == id) {
                list.push(arr[i]);
            };
        };
        return list;
    };


    // 根据id删除数据
    function delectItemById(id) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].id == id) {
                data.splice(i, 1);
                break;
            }
        }
    }

    // 批量删除，传入一个数组 [1,2,3,4]
    function delectItemByIds(delectIds) {
        for (var i = 0; i < delectIds.length; i++) {
            delectItemById(delectIds[i])
        }
    }
    // 用来给指定的元素加上样式的
    function addStyleBgById(id) {
        treeMenu.find('div').css('background', '')
        treeMenu.find('div[custom-id="' + id + '"]').css('background', 'red')
    }
    // 指定一个id，找到这个id中所有的子级中是否包含传入的value,true false
    function isExistChildsNameById(id, value) {
        var childs = getChildByPid(id);
        for (var i = 0; i < childs.length; i++) {
            if (childs[i].title === value) {
                return true; //有相同的名字
            }
        }
        return false;
    }
    //根据传入的id，生成这个id下的这一级的ul结构
    function createTreeHtml(id, n) {
        var childs = getChildByPid(id); //所有的子级；
        var html = '';
        if (childs.length) {
            html += '<ul>';
            for (var i = 0; i < childs.length; i++) {
                var childHtml = createTreeHtml(childs[i].id, n); // 下一级返回的结构
                var cls = childHtml ? 'tree-ico' : '';
                html += '<li customId="' + childs[i].id + '">\
                <div  class="tree-title ' + cls + ' close">\
                    <span><i></i>' + childs[i].title + '</span>\
                </div>';
                html += childHtml;
                html += '</li>';
            }
            html += '</ul>';
        }
        return html;
    }
    var treeMenu = document.querySelector('.tree-menu');
    treeMenu.innerHTML = createTreeHtml('-1');
    //根据传入的id生成这个id下弹窗
    function tanchuang(id, n) {
        var childs = getChildByPid(id); //所有的子级；
        console.log(childs);
        var html = '';
        if (childs.length) {
            html += '<div><ul>';
            for (var i = 0; i < childs.length; i++) {
                var childHtml = createTreeHtml(childs[i].id, n); // 下一级返回的结构
                var cls = childHtml ? 'tree-ico' : '';
                html += '<li customId="' + childs[i].id + '">\
                <div  class="tree-title ' + cls + ' close">\
                    <span><i></i>' + childs[i].title + '</span>\
                </div>';
                html += childHtml;
                html += '</li>';
            }
            html += '</ul></div>\
            <button>确定</button><button>取消</button>';
        }
        return html;
    }


    //找到指定id所有的父级

    function getParentAllById(id) {
        var arr = [];
        var item = getObjectById(id); //先找到这个id所在的项
        if (item) {
            arr.push(item);
            // getParentAllById(item.pid);
            arr = arr.concat(getParentAllById(item.pid));
        }
        return arr;
    }
    console.log(getParentAllById('01'))
    var parentsAll = getParentAllById('03');
    console.log(parentsAll);

    //生成导航结构
    function createPathHtml(id) {
        var parents = getParentAllById(id).reverse();
        var spans = '';
        if (parents.length) {
            for (var i = 0; i < parents.length - 1; i++) {
                spans += '<a spanId="' + parents[i].id + '"href="javascript:;" style="color: #55addd">' + parents[i].title + '</a>'
            }
            spans += '<span spanId="' + parents[parents.length - 1].id + '">' + parents[parents.length - 1].title + '</span>'

        }
        return spans;
    }
    var breadNav = document.querySelector('.bread-nav');
    breadNav.innerHTML = createPathHtml('1');
    //改变导航当前状态颜色
    function textColor(id) {
        $('.bread-nav a').css('color', '');
        $('.bread-nav span[spanid="' + id + '"]').css('color', '#55addd');
    }
    textColor('1');
    //文件区域结构代码
    function folderSingleHTML(object) {
        return '<div  class="file-item">\
                <img imgId="' + object.id + '" src="img/folder-b.png" alt="" />\
                <span class="folder-name">' + object.title + '</span>\
                <input type="text" class="editor" />\
                <i class=""></i>\
            </div>'
    }
    // 渲染文件区域的
    function createFileHtml(id) {
        var childs = getChildByPid(id);
        var filesHtml = '';
        if (childs.length) {
            for (var i = 0; i < childs.length; i++) {
                filesHtml += folderSingleHTML(childs[i])
            }
        }
        return filesHtml;
    }
    console.log(createFileHtml('1'))
    var folders = document.querySelector('.folders');
    folders.innerHTML = createFileHtml('1');
    $('.checkedAll').removeClass('checked');
    $('.tree-menu li[customId="1"]>.tree-title').css('background', '#9fd5f2');


    //交互
    //树状结构
    $('.tree-menu').on('click', '.tree-title', function() {
            var id = $(this).parent().attr('customId');
            console.log(id);
            breadNav.innerHTML = createPathHtml(id)
            folders.innerHTML = createFileHtml(id);
            textColor(id);
            $('.tree-menu li>.tree-title').css('background', '');
            $('.tree-menu li[customId="' + id + '"]>.tree-title').css('background', '#9fd5f2');
            var childs = getChildByPid(id)
            $('.checkedAll').removeClass('checked');
            if (childs.length) {
                console.log(childs)

                $('.f-empty').css('display', 'none');
            } else {
                $('.f-empty').css({ 'display': 'block', 'position': 'absolute' });

            }

        })
        //导航交互
    $('.bread-nav').on('click', 'a', function() {
            var id = $(this).attr('spanId');
            folders.innerHTML = createFileHtml(id);
            $('.tree-menu li>.tree-title').css('background', '');
            $('.tree-menu li[customId="' + id + '"]>.tree-title').css('background', '#9fd5f2');
            breadNav.innerHTML = createPathHtml(id);
            textColor(id);
            var childs = getChildByPid(id)
            $('.checkedAll').removeClass('checked');
            if (childs.length) {
                console.log(childs)

                $('.f-empty').css('display', 'none');
            } else {
                $('.f-empty').css({ 'display': 'block', 'position': 'absolute' });

            }
        })
        // 文档区域交互 多选框交互
    $('.folders').on('click', '.file-item', function(e) {
            if (e.target.nodeName == 'I') { //e.target.is('i')
                $(e.target).toggleClass('checked');
                $(e.target).parent().toggleClass('active');
                var bl = $('.file-item i').length === $('.file-item i.checked').length ? true : false;
                if (bl) {
                    $('.checkedAll').addClass('checked');
                } else {
                    $('.checkedAll').removeClass('checked');
                    console.log(1)
                }
                $(document).off('mousemove');

                return;
            }

            if (e.target.nodeName == 'IMG') {
                var id = $(e.target).attr('imgId');
                console.log(id);
                var childs = getChildByPid(id);
                if (childs.length) {
                    console.log(childs)

                    $('.f-empty').css('display', 'none');
                } else {
                    $('.f-empty').css({ 'display': 'block', 'position': 'absolute' });

                }
                folders.innerHTML = createFileHtml(id);

                breadNav.innerHTML = createPathHtml(id)
                $('.tree-menu li>.tree-title').css('background', '');
                $('.tree-menu li[customId="' + id + '"]>.tree-title').css('background', '#9fd5f2');
                textColor(id);
                $('.checkedAll').removeClass('checked');

                return;
            }
            $(document).off('mousemove mouseup');
            e.preventDefault();

        })
        //单选
    $('.checkedAll').click(function() {
            console.log($(this).toggleClass('checked'))
            $(this).toggleClass('checked');
            var bl = $(this).toggleClass('checked').is('.checked');
            console.log(bl)
            if (bl) {
                console.log(1)
                $('.file-item i').addClass('checked'); //jq获取是静态的
                $('.file-item').addClass('active'); //jq获取是静态的

            } else {
                console.log(1)
                $('.file-item i').removeClass('checked');
                $('.file-item').removeClass('active');
            }
        })
        //框选
    $('.folders').on('mousedown', function(e) {
        if (!$(e.target).is('.folders')) {
            return;
        }
        var kuangxuan = document.createElement('div');
        kuangxuan.classList.add('kuangxuan');
        var disX = e.clientX;
        var disY = e.clientY;
        kuangxuan.style.left = disX + 'px';
        kuangxuan.style.top = disY + 'px';
        $(kuangxuan).data('isAppend', false); // 记录是否放到body中了
        $(document).on('mousemove', function(e) {
            if (e.target.nodeName !== 'I') {
                if ((Math.abs(e.clientX - disX) > 10 || Math.abs(e.clientY - disY) > 10)) {
                    if (!$(kuangxuan).data('isAppend')) {
                        document.body.appendChild(kuangxuan);
                        $(kuangxuan).data('isAppend', true); // 记录已经插入
                    }
                } else {
                    return;
                }
                kuangxuan.style.width = Math.abs(e.clientX - disX) + 'px';
                kuangxuan.style.height = Math.abs(e.clientY - disY) + 'px';
                kuangxuan.style.left = Math.min(e.clientX, disX) + 'px';
                kuangxuan.style.top = Math.min(e.clientY, disY) + 'px';
                //选框和当前所有的元素进行碰撞
                var fileItem = document.querySelectorAll('.file-item');
                var folders = document.querySelectorAll('.folders')[0];
                for (var i = 0; i < fileItem.length; i++) {
                    if (collision(kuangxuan, fileItem[i])) {
                        fileItem[i].lastElementChild.classList.add('checked');
                        fileItem[i].classList.add('active');
                        console.log(1);
                    } else {
                        fileItem[i].lastElementChild.classList.remove('checked');
                        fileItem[i].classList.remove('active');
                    }
                };
                var bl = $('.file-item i').length === $('.file-item i.checked').length ? true : false;
                if (bl) {
                    $('.checkedAll').addClass('checked');
                } else {
                    $('.checkedAll').removeClass('checked');
                }
            }
            $(document).on('mouseup', function(e) {
                $(document).off('mousemove mouseup');
                kuangxuan.remove();
            })
        })
        e.preventDefault();
    })

    //碰撞交互
    function getRect(el) {
        return el.getBoundingClientRect();
    }

    function collision(darg, hitted) { //拖拽元素碰撞函数
        var dragRect = getRect(darg);
        var hitedRect = getRect(hitted);
        if (
            dragRect.right < hitedRect.left ||
            dragRect.bottom < hitedRect.top ||
            dragRect.left > hitedRect.right ||
            dragRect.top > hitedRect.bottom
        ) {
            return false //没有撞上；
        };
        return true;
    }
    //删除一个id之后，连同这个id所有的子孙级全删除

    var del = $('#del');
    console.log(arr.length)
        // 找到指定id所有的子孙节点
    function getChildsAllById(id) {
        // 先找子级
        var list = [];

        for (var i = 0; i < arr.length; i++) {
            if (arr[i].pid == id) {
                list.push(arr[i]);
                list = list.concat(getChildsAllById(arr[i].id))
            }
        }

        return list;
    }
    //找到当前id所有的子孙节点包括或不包括自身对象
    function getChildsAllByIds(ids, isSelf) {
        // 先找子级
        var arr = [];

        for (var i = 0; i < ids.length; i++) {
            // 如果包含自身,把自身找到，放在数组中
            if (isSelf) {
                arr.push(getObjectById(ids[i]))
            }
            arr = arr.concat(getChildsAllById(ids[i]))
        }
        return arr;
    }
    var WARN = 'warn';
    var OK = 'ok';

    del.click(function() {

        //清除数据
        var iChecked = $('.file-item .checked')
        if (iChecked.length > 0) {
            var fileItems = iChecked.parent();
            console.log(fileItems);
            var list = [];
            fileItems.each(function(index, item) {
                list.push($(item).find('img').attr('imgid'));
            })
            console.log(list);

            list = getChildsAllByIds(list, true); //找到当前id所有的子孙节点包括自身对象

            for (var i = 0; i < list.length; i++) {
                for (var j = 0; j < arr.length; j++) {
                    if (arr[j] == list[i]) {
                        arr.splice(j, 1);
                    }
                }
            }
            console.log(arr);
            treeMenu.innerHTML = createTreeHtml('-1');
            var id = $('.file-item .checked').parents('.file-item').find('img').attr('imgid') //当前id
                // breadNav.innerHTML = createPathHtml(id);
            var spanId = $('.bread-nav').find('span').attr('spanid');
            folders.innerHTML = createFileHtml(spanId);
            $('.tree-menu li>.tree-title').css('background', '');
            $('.tree-menu li[customId="' + spanId + '"]>.tree-title').css('background', '#9fd5f2');
            $('.checkall i').removeClass('checked');
            console.log(arr)
            tip(OK, '删除成功');
            var childs = getChildByPid(spanId);
            if (childs.length) {
                console.log(childs)

                $('.f-empty').css('display', 'none');
            } else {
                $('.f-empty').css({ 'display': 'block', 'position': 'absolute' });

            }


        } else {
            tip(WARN, '没有选中');
        }
    })

    //重命名
    function isExist(id, title) { //根据这个id找到它下面所有的子级，判断是否存在同名的name。
        //如果返回值为true说明没有同名，返回false 说明有同名
        var childs = getChildByPid(id);
        for (var i = 0; i < childs.length; i++) {
            if (childs[i].title === title) { //有同名的
                return false;
            }
        }
        return true; //没有同名的              
    }
    var rename = $('#rename');
    rename.click(function() {
        var folders = $('.folders');
        console.log(folders)
        var selectI = folders.find('.checked');
        console.log(selectI)
        if (selectI.length > 1) {
            tip(WARN, '不能选中多个进行重命名');
            return;
        }
        if (selectI.length == 0) {
            tip(WARN, '没有指定的文件重命名');
            return;
        }
        if (selectI.length == 1) {
            var editor = selectI.prev() //input
            var spanName = editor.prev(); //span
            console.log(editor)
            spanName.css('display', 'none');
            editor.css('display', 'block').focus().val(spanName.text().trim()).select();
            var value = editor.val();
            // 正在重命名
            rename.data('isRename', true)

        }
    });
    // 指定id找所有的兄弟
    function getBrothersById(id) {
        var self = getObjectById(id) //找到自己
        console.log(self);
        var list = []
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].pid == self.pid) {
                list.push(arr[i]);
            }
        }
        return list;
    }
    //给定一个id，和这个id所有的弟兄对比，是否存在某个名字
    function isExistBrotherNameById(id, title) {
        var brothersIds = getBrothersById(id).filter(function(item) {
            return item.id != id;
        });
        console.log(brothersIds);
        for (var i = 0; i < brothersIds.length; i++) {
            if (brothersIds[i].title == title) {
                return true; //判断有同名
            }
        }
        return false //没有同名
    }
    isExistBrotherNameById(1234, '之心');

    //处理重名的
    $(document).mousedown(function(e) {
        //判断一下是否在重命名
        if (!rename.data('isRename')) {
            return; //状态为false时不重命名；
        }
        if ($(e.target).is('input')) {
            return;
        }
        console.log('要重命名了');
        var folders = $('.folders');
        console.log(folders)
        var selectI = folders.find('.checked');

        var editor = selectI.prev() //input
        var spanName = editor.prev(); //span
        var value = editor.val();
        console.log(value);
        var id = selectI.parent().find('img').attr('imgid');
        var spanId = $('.bread-nav').find('span').attr('spanid');
        console.log(id);
        if (value == '') {
            tip(WARN, '名字不能为空');
            spanName.show();
            editor.hide();
            rename.data('isRename', false);

        } else if (isExistBrotherNameById(id, value)) {
            tip(WARN, '有重名');
            spanName.hide();
            editor.val(value.trim());

        } else {
            spanName.show().text(value);
            editor.hide();
            console.log('修改成功');
            var self = getObjectById(id);
            self.title = value;
            // console.log($('.tree-menu').find('li[customid="' + id + '"]>div').find('span'))
            // $('.tree-menu').find('li[customid="' + id + '"]>div').find('span').html('<i><i>' + value)
            treeMenu.innerHTML = createTreeHtml('-1');
            $('.tree-menu li>.tree-title').css('background', '');
            $('.tree-menu li[customId="' + spanId + '"]>.tree-title').css('background', '#9fd5f2');
            tip(OK, '命名成功');
            rename.data('isRename', false);
        }
        $(document).off('mousemove mouseup');
    })

    //新建文件
    var create = $('#create');
    create.click(function() {
        var html = $(folderSingleHTML({ title: '', id: '' }));
        console.log($(folders));
        $(folders).prepend(html);
        var spanCreate = $('.file-item:first').find('.folder-name');
        var editorCreate = $('.file-item:first').find('.editor');
        spanCreate.hide();
        editorCreate.css('display', 'block').focus();
        create.data('newCreate', true);
    })
    $(document).mousedown(function(e) {
        if (!create.data('newCreate')) {
            return;
        }
        if ($(e.target).is('input')) {
            return;
        }
        var spanCreate = $('.file-item:first').find('.folder-name');
        var editorCreate = $('.file-item:first').find('.editor');
        var value = editorCreate.val();
        var spanId = $('.bread-nav').find('span').attr('spanid'); //新建文件夹所在父级

        console.log(value)
        if (value == '') {
            tip(WARN, '不能为空');
            $('.file-item:first').remove();
        } else if (isExistChildsNameById(spanId, value)) {
            tip(WARN, '已经有同名的文件夹了');
        } else { //新建成功了添加数据
            var o = {
                id: Date.now(),
                title: value,
                pid: spanId
            }
            arr.unshift(o);
            console.log(arr)
            $('.file-item:first').attr('imgId', o.id); //给新建文件设置id
            spanCreate.css('display', 'block').text(value);
            editorCreate.hide();
            treeMenu.innerHTML = createTreeHtml(-1);
            folders.innerHTML = createFileHtml(spanId);
            $('.tree-menu li>.tree-title').css('background', '');
            $('.tree-menu li[customId="' + spanId + '"]>.tree-title').css('background', '#9fd5f2');
            tip(OK, '新建成功');
            $('.f-empty').css('display', 'none'); //只要新建就不显示为空
        }
        create.data('newCreate', false)
        $(document).off('mousemove mouseup');
    })

    //提醒框
    var fullTipBox = $('.full-tip-box');
    var tipText = fullTipBox.find('.tip-text')
    var timer = null;

    function tip(cls, value) {
        fullTipBox.css('top', -32);
        fullTipBox[0].style.transition = 'none';
        tipText.text(value);
        fullTipBox.removeClass(WARN + ' ' + OK).addClass(cls);
        setTimeout(function() {
            fullTipBox.css('top', 0);
            fullTipBox[0].style.transition = '.3s';

        })
        clearTimeout(timer)
        timer = setTimeout(function() {
            fullTipBox.css('top', -32);
        }, 2000)
    }



    function addModalStyleBgById(id) {
        $('.tankuang-box li>.tree-title').css('background', '');
        $('.tankuang-box li[customId="' + id + '"]>.tree-title').css('background', '#9fd5f2');
    }
    //移动文件夹

    var remove = $('#remove');

    var moveTargetId = 1; // 默认移动的目标父级的id;

    //移动事件
    remove.click(function() {
            var checkedI = $('.file-item').find('i.checked');
            var spanId = $('.bread-nav').find('span').attr('spanid');

            console.log(checkedI.length)
            if (checkedI.length) {
                $('.tankuang').css('display', 'block');
                $('.tankuang-box').html(createTreeHtml('-1'));
                addModalStyleBgById(1);
                //点击移动目标
                //判断移动的和选中的目标的父级的id是否相同
                //如果相同不能移动，不相同可以移动
                console.log($('.bread-nav').find('span').attr('spanid'))
                if (spanId == +moveTargetId) {
                    $('.tankuang .tip').data('isMove', false) //不能移动
                    $('.tankuang .tip').text('不能移动')
                } else {
                    $('.tankuang .tip').data('isMove', true) //可以移动
                    $('.tankuang .tip').text('可以移动')
                }
            } else {
                tip(WARN, '请选中要移动的文件')
            }
        })
        //移动弹框事件
    var tankuang = $('.tankuang');
    tankuang.on('click', '.tree-title', function(e) {
            var id = $(this).parent().attr('customid'); //移动目标的id
            var spanId = $('.bread-nav').find('span').attr('spanid');
            moveTargetId = id;
            addModalStyleBgById(id);
            // 找到选中id的父级和它的所有子孙及自己
            // 1、 找到选中的所有的id
            var ids = [];
            var checkedI = $('.file-item').find('i.checked');
            checkedI.each(function(index, item) {
                ids.push($(item).parent().find('img').attr('imgid'));
            });
            // getChildsAllByIds(list) //找到id下所有的子孙数据
            // getObjectById(moveTargetId); //找到id所在的父级
            console.log(getObjectById(spanId))
            var allArr = getChildsAllByIds(ids).concat(getObjectById(spanId));
            console.log(allArr);
            // 目标父级id在不在allArr中 在的话不能移动 不在 可以移动
            var zai = false; // 不在
            for (var i = 0; i < allArr.length; i++) {
                if (allArr[i].id == id) {
                    console.log('不可以移动')
                    zai = true
                    break;
                }
            }
            if (zai) {
                //
                $('.tankuang .tip').data('isMove', false)
                $('.tankuang .tip').text('在自身子孙父级中，不能移动')

            } else {
                $('.tankuang .tip').data('isMove', true)
                $('.tankuang .tip').text('在自身子孙父级中，可以移动')
            }
        })
        // 点击确定就是把要移动的文件的pid改成目标父级的id

    $('.btns .ok').click(function() {
        var spanId = $('.bread-nav').find('span').attr('spanid');

        if (!$('.tankuang .tip').data('isMove')) {
            return;
        }
        var onOff = false //不重名
        var checkedI = $('.file-item').find('i.checked'); //要移动的文件
        checkedI.each(function(index, item) {
            var id = $(item).parent().find('img').attr('imgid');
            console.log(id);
            var self = getObjectById(id);
            if (!isExistChildsNameById(moveTargetId, self.title)) { //和目标id的子级不同名
                self.pid = +moveTargetId;
            } else {
                onOff = true;
                self.pid = +moveTargetId;
                self.title = self.title + Math.random();
            }
        })
        console.log(arr);
        treeMenu.innerHTML = createTreeHtml('-1');
        folders.innerHTML = createFileHtml(spanId);
        $('.tree-menu li>.tree-title').css('background', '');
        $('.tree-menu li[customId="' + spanId + '"]>.tree-title').css('background', '#9fd5f2');
        $('.tankuang').css('display', 'none');
    })
    $('.btns .cancle').click(function() {
        $('.tankuang').css('display', 'none');
    })
})();