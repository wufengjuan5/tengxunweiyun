window.onload = function() {
    // function creatHtml(data) {
    //     var html = '<ul>';
    //     for (var i = 0; i < data.length; i++) {
    //         html += '<li>\
    //                 <div class="tree-title tree-ico close">\
    //                     <span><i></i>' + data[i].title + '</span>\
    //                 </div>'
    //         if (data[i].children) {
    //             html += creatHtml(data[i].children)
    //         }
    //         html += '</li>';
    //     }
    //     html += '</ul>';
    //     return html;

    // };
    // var treeMenu = document.querySelector('.tree-menu');

    // treeMenu.innerHTML = creatHtml(list);

    function getObjectById(id) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].id == id) {
                return arr[i];
            }
        }
        return null;
    };
    console.log(getObjectById(1));
    var initID = 1; //通过id找到对象;
    var item = getObjectById(initID);

    //通过一个id找到所有的子级

    function getChildByPid(id) {
        var list = [];

        for (var i = 0; i < arr.length; i++) {
            if (arr[i].pid == id) {
                list.push(arr[i]);
            };
        };
        return list;
    };
    console.log(getChildByPid(1));
    var lists = getChildByPid(1);
    var html = '<ul>'
    html += '<li>\
                <div class="tree-title tree-ico close">\
                                        <span><i></i>' + item.title + '</span>\
                                    </div>';
    html += '<ul>';
    for (var i = 0; i < lists.length; i++) {
        html += '<li>\
                                <div class="tree-title tree-ico close">\
                                    <span><i></i>' + lists[i].title + '</span>\
                                </div>\
                                </li>'

    };
    html += '</ul>';
    html += '</li>';
    html += '</ul>';
    var treeMenu = document.querySelector('.tree-menu');
    treeMenu.innerHTML = html;
}