//定义服务器地址

var server = "http://hzzs.demo.lhsoft.net/";
// var server = "http://192.168.0.101/bjzc/public/";

//更改apiready为事件触发
window.apiready = function() {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("apiready", false, false);
    window.dispatchEvent(evt);
    document.dispatchEvent(evt);
}
// 页面滑动到底部请求下一组数据
function scrolltobottom(currentP,callback){
  api.addEventListener({
      name:'scrolltobottom',
      extra:{
          threshold:20
      }
  }, function(ret, err){
      openLoader();
      currentP++;
      callback(currentP);
  });

}
// 打开一个窗口
function openWindow(name,win_url,data) {
    api.openWin({
        name: name,
        url: win_url,
        pageParam: data,
        reload: true,
        delay: 200
    });
}
// 打开一个Frame
function openFrame(name,frameUrl,height,data){
    api.openFrame({
      name: name,
      url: frameUrl,
      rect: {
          x: 0,
          y: height,
          w: 'auto',
          h: 'auto'
      },
      bounces:false,
      pageParam: data
  });
}
//监听apiready事件
window.addEventListener("apiready", function() {
    //解析触摸模式
    api.parseTapmode();
    //修复状态栏
    fixStatusBar();
    // api.setScreenOrientation({
    //     orientation: 'landscape_left'
    // });

});

//打开加载框
function openLoader(text, modal) {
    api.showProgress({
        title: '',
        text: text ? text : '正在加载',
        animationType: 'fade',
        modal: modal ? false : true
    });
}

//关闭加载框
function closeLoader() {
    api.hideProgress();
}

// toast信息
function showToast(msg){
  api.toast({
      msg: msg,
      duration: 2000,
      location: 'bottom'
  });

}

// 封装发送请求方法
function ajax(path, data, type, callback) {
    var url = server + path;
    var type = type || 'post'; //请求类型
    data = data ? data : {};
    console.log(url)
    // console.log(data)
    console.log(JSON.stringify(data))
    api.ajax({
        url: url,
        method: type,
        data: data,
        // headers: headers,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        },
        // dataType: "json"
    }, function(ret, err) {
      if (typeof(callback) == "function") {
          callback(ret,err);
      }
    });
}

//修复APP头部
function fixStatusBar() {
    var header = $("#header");
    if (header.length > 0) {
        var sysType = api.systemType;
        if (sysType == 'ios') {
            var strSV = api.systemVersion;
            var numSV = parseInt(strSV, 10);
            var fullScreen = api.fullScreen;
            var iOS7StatusBarAppearance = api.iOS7StatusBarAppearance;
            if (numSV >= 7 && !fullScreen && iOS7StatusBarAppearance) {
                header.css("padding-top", "20px");
            }
        } else if (sysType == 'android') {
            var ver = api.systemVersion;
            ver = parseFloat(ver);
            if (ver >= 4.4) {
                header.css("padding-top", "25px");
            }
        }
    }
}


/*
 * @description    根据某个字段实现对json数组的排序
 * @param   array  要排序的json数组对象
 * @param   field  排序字段（此参数必须为字符串）
 * @param   reverse 是否倒序（默认为false）
 * @return  array  返回排序后的json数组
 */
function jsonSort(array, field, reverse) {
    //数组长度小于2 或 没有指定排序字段 或 不是json格式数据
    if (array.length < 2 || !field || typeof array[0] !== "object") return array;
    //数字类型排序
    if (typeof array[0][field] === "number") {
        array.sort(function(x, y) {
            return x[field] - y[field]
        });
    }
    //字符串类型排序
    if (typeof array[0][field] === "string") {
        array.sort(function(x, y) {
            return x[field].localeCompare(y[field])
        });
    }
    //倒序
    if (reverse) {
        array.reverse();
    }
    return array;
}








function closeWin(){
  api.closeWin({
      name: ''
  });

}

// 替换图片路径
function replaceImg(data){
  $.each(data,function(index,value){
      value.url = server + value.url.replace('..//', '');
  });
  return data;
}
