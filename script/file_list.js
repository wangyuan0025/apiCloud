window.addEventListener('apiready', function() {
    var params = api.pageParam,
        keyWords = '';
    if (params.type == 'policy') { /*政策公开*/
        var url = 'index/mobile/publicPolicy';
    } else {
        var url = 'index/mobile/publicAnnouncement';
    }


    api.setRefreshHeaderInfo({
        visible: true,
        loadingImg: '../image/loading_more.gif',
        bgColor: '#ccc',
        textColor: '#fff',
        textDown: '下拉刷新...',
        textUp: '松开刷新...',
        showTime: true
    }, function(ret, err) {
        getResourceList(url, keyWords);
        setTimeout('api.refreshHeaderLoadDone()', '500');
    });



    getResourceList(url, '');
    // 监听头部搜索按钮点击事件
    api.addEventListener({
        name: 'searchList'
    }, function(ret, err) {
        if (ret) {
            keyWords = ret.value.keywords;
            openLoader();
            getResourceList(url, keyWords);
        } else {
            alert(JSON.stringify(err));
        }
    });
})

function openDownloadedFile(downloaded_id) {
    var downloadManager = api.require('downloadManager');
    downloadManager.openDownloadedFile({
        id: downloaded_id
    }, function(ret, err) {
        if (ret.status) {
            //alert(JSON.stringify(ret));
        } else {
            //alert(JSON.stringify(err));
        }
    });
}

function openManagerView() {
    var downloadManager = api.require('downloadManager');
    downloadManager.openManagerView({
        title: '下载管理'
    }, function(ret, err) {
        if (ret) {
            openDownloadedFile(ret.id);
        } else {
            alert(JSON.stringify(err));
        }
    });
}

function downloadFile(file_id, file_name, icon_name) {
    var downloadUrl = 'index/mobile/download',
        data = {
            values: {
                file_id: file_id
            }
        }
    ajax(downloadUrl, data, 'get', function(ret, err) {
        if (ret) {
          console.log(JSON.stringify(ret))
            file_path = ret.path;

            if (typeof(file_path) == 'undefined' || file_path == null || file_path == "") {
                api.toast({
                    msg: '下载失败,远程文件不存在',
                    duration: 2000,
                    location: 'middle'
                });
                return false;
            }

            var downloadManager = api.require('downloadManager');
            downloadManager.enqueue({
                url: file_path,
                savePath: 'fs://downloadManager/' + file_name,
                cache: true,
                iconPath: "widget://image/" + icon_name,
                allowResume: true,
                title: file_name,
                networkTypes: 'all'
            }, function(ret, err) {
                if (ret) {
                    id = ret.id;
                    //openDownloadedFile(ret.id);
                    openManagerView();
                } else {
                    //alert(JSON.stringify(err));
                }
            });
        } else {
            api.toast({
                msg: '下载失败',
                duration: 2000,
                location: 'middle'
            });
        }
    })

}

function getResourceList(url, keyWords) {
    openLoader();
    // console.log('keyword' + keyWords);

    var data = {
        values: {
            search: keyWords
        }
    }
    ajax(url,data, 'get', function(ret,err) {
        closeLoader();
          // console.log(url)
        console.log(JSON.stringify(ret));
        // console.log(JSON.stringify(err));
        if(ret){
            showData(ret);
        }

    })


}

function showData(data) {
    var tpl_file_list = doT.template($("#tpl-file-list").html());
    $("#file-list").html(tpl_file_list(data));
}
$('body').on('click', '.file-item', function(e) {
    var file_id = $(this).data('id'),
        file_name = $(this).data('name'),
        icon_name = $(this).find('img').attr('src');
    downloadFile(file_id, file_name, icon_name)
})
