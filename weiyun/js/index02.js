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
    //根据传入的id，生成这个id下的这一级的ul结构
    function createTreeHtml(id, n) {
        var childs = getChildByPid(id); //所有的子级；
        console.log(childs);
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
    console.log(createTreeHtml("-1"));
    var treeMenu = document.querySelector('.tree-menu');
    treeMenu.innerHTML = createTreeHtml('-1');



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
    textColor('1')
        // 渲染文件区域的
    function createFileHtml(id) {
        var childs = getChildByPid(id);
        var filesHtml = '';
        if (childs.length) {
            for (var i = 0; i < childs.length; i++) {
                filesHtml += '<div  class="file-item">\
                <img imgId="' + childs[i].id + '" src="img/folder-b.png" alt="" />\
                <span class="folder-name">' + childs[i].title + '</span>\
                <input type="text" class="editor" />\
                <i class=""></i>\
            </div>'
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

        })
        //导航交互
    $('.bread-nav').on('click', 'a', function() {
            var id = $(this).attr('spanId');
            folders.innerHTML = createFileHtml(id);
            $('.tree-menu li>.tree-title').css('background', '');
            $('.tree-menu li[customId="' + id + '"]>.tree-title').css('background', '#9fd5f2');
            breadNav.innerHTML = createPathHtml(id);
            textColor(id);

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
                var childs = getChildByPid(id);
                if (childs.length) {
                    console.log(childs)

                    $('.f-empty').css('display', '');
                    folders.innerHTML = createFileHtml(id);
                } else {
                    $('.f-empty').css('display', 'block');
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
    var onOff = true;
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
            if (onOff) {
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
                    var folders = document.querySelectorAll('.folders');
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
                        console.log(1)
                    }
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


    del.click(function() {

        //清除数据
        var fileItems = $('.file-item .checked').parent();
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
        folders.innerHTML = createFileHtml('1');
        var id = $('.file-item .checked').parents('.file-item').find('img').attr('imgid') //当前id
            // breadNav.innerHTML = createPathHtml(id);
        $('.checkall i').removeClass('checked');
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
            if ($('.file-item .checked').length == 1) {
                $('.file-item .checked').parents('.file-item').find('.folder-name').css('display', 'none');
                $('.file-item .checked').prev().css('display', 'block').focus();
                $(document).on('mousedown', function(e) {
                    onOff = false;
                    var val = $('.file-item .checked').prev().val();
                    if (val) {
                        var id = $('.file-item .checked').parents('.file-item').find('img').attr('imgid') //当前id
                        console.log(getParentAllById(id)[1]);
                        var pid = getParentAllById(id)[1].id; //找到id所在的父级
                        if (isExist(pid, val)) {
                            for (var i = 0; i < arr.length; i++) { //给数据同名id改变下title
                                if (arr[i].id == id) {
                                    arr[i].title = val;
                                    break;
                                }
                            }
                            console.log(arr);
                            $('.file-item .checked').parents('.file-item').find('.folder-name').css('display', 'block').text(val);
                            $('.file-item .checked').prev().css('display', 'none');
                            treeMenu.innerHTML = createTreeHtml(-1);
                            onOff = true;

                        } else {
                            alert('在同一目录下不能重名');
                        }

                        //判断id
                    } else {
                        alert('不能为空');
                        $('.file-item .checked').parents('.file-item').find('.folder-name').css('display', 'block');
                        $('.file-item .checked').prev().css('display', 'none');

                    }
                    // $(document).off('mousemove mouseup');
                })
            } else {
                alert('不能选中多个重命名')
            }
        })
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

    })