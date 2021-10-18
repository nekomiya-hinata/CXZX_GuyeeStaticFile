var array_color = [
    '#5ab1ef', '#2ec7c9', '#b6a2de', '#ffb980', '#d87a80',
    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
];
var array_blood = [{id: 'A', text: 'A'}, {id: 'B', text: 'B'}, {id: 'AB', text: 'AB'}, {id: 'O', text: 'O'}];
var array_nation = [{"id": "汉", "text": "汉"}, {"id": "蒙古", "text": "蒙古"}, {"id": "回", "text": "回"},
    {"id": "藏", "text": "藏"}, {"id": "维吾尔", "text": "维吾尔"}, {"id": "苗", "text": "苗"},
    {"id": "彝", "text": "彝"}, {"id": "壮", "text": "壮"}, {"id": "布依", "text": "布依"},
    {"id": "朝鲜", "text": "朝鲜"}, {"id": "满", "text": "满"}, {"id": "侗", "text": "侗"},
    {"id": "瑶", "text": "瑶"}, {"id": "白", "text": "白"}, {"id": "土家", "text": "土家"},
    {"id": "哈尼", "text": "哈尼"}, {"id": "哈萨克", "text": "哈萨克"}, {"id": "傣", "text": "傣"},
    {"id": "黎", "text": "黎"}, {"id": "傈僳", "text": "傈僳"}, {"id": "佤", "text": "佤"},
    {"id": "畲", "text": "畲"}, {"id": "高山", "text": "高山"}, {"id": "拉祜", "text": "拉祜"},
    {"id": "水", "text": "水"}, {"id": "东乡", "text": "东乡"}, {"id": "纳西", "text": "纳西"},
    {"id": "景颇", "text": "景颇"}, {"id": "柯尔克孜", "text": "柯尔克孜"}, {"id": "土", "text": "土"},
    {"id": "达斡尔", "text": "达斡尔"}, {"id": "仫佬", "text": "仫佬"}, {"id": "羌", "text": "羌"},
    {"id": "布朗", "text": "布朗"}, {"id": "撒拉", "text": "撒拉"}, {"id": "毛难", "text": "毛难"},
    {"id": "仡佬", "text": "仡佬"}, {"id": "锡伯", "text": "锡伯"}, {"id": "阿昌", "text": "阿昌"},
    {"id": "普米", "text": "普米"}, {"id": "塔吉克", "text": "塔吉克"}, {"id": "怒", "text": "怒"},
    {"id": "乌孜别克", "text": "乌孜别克"}, {"id": "俄罗斯", "text": "俄罗斯"}, {"id": "鄂温克", "text": "鄂温克"},
    {"id": "崩龙", "text": "崩龙"}, {"id": "保安", "text": "保安"}, {"id": "裕固", "text": "裕固"},
    {"id": "京", "text": "京"}, {"id": "塔塔尔", "text": "塔塔尔"}, {"id": "独龙", "text": "独龙"},
    {"id": "鄂伦春", "text": "鄂伦春"}, {"id": "赫哲", "text": "赫哲"}, {"id": "门巴", "text": "门巴"},
    {"id": "珞巴", "text": "珞巴"}, {"id": "基诺", "text": "基诺"}];

String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function () {
        var val = args[arguments[1]];
        return (!val) ? arguments[0] : val;
    });
};

function numberFormat(num) {
    var str = num.toString();
    if (str.indexOf(".") < 0) {
        return str.replace(/(\d{1,3})(?=(\d{3})+$)/g, '$1,');
    } else
        return str.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}

/**
 * 格式化图片服务器的url
 * 改成 _50x30.jpg 后缀格式
 */
function urlFormat(url, width, height) {
    var suffix = "_" + width + "x" + height;

    var res = url.replace(/\.\w{3}$/, function (word) {
        return suffix + word;
    })
    return res;
}


function logout() {
    window.location.href = ctx + "/logout";
};

function addFavorite(sURL, sTitle) {
    try {
        window.external.addFavorite(sURL, sTitle);
    } catch (e) {
        try {
            window.sidebar.addPanel(sTitle, sURL, "");
        } catch (e) {
            alert("加入收藏失败,请手动添加.");
        }
    }
}


function showPageLoading() {
    KTApp.startPageLoading();
}

function hidePageLoading() {
    KTApp.stopPageLoading();
}

function blockLoading(target) {
    KTApp.blockUI({
        target: target
    });
}

function blockUI(target, msg, iconOnly) {
    KTApp.block(target, {
        message: msg ? msg : '正在处理中...'
    })
}

function unblockUI(target) {
    KTApp.unblock(target);
}

var dialog = {
    info: function (target, type, icon, text, duration) {
        KTApp.alert({
            type: type ? ("alert-solid-" + type) : "alert-solid-warning",
            icon: icon ? icon : "fa fa-info-circle",
            message: text,
            container: target,
            place: 'prepend',
            close: true, // make alert closable
            reset: true, // close all previouse alerts first
            focus: true, // auto scroll to the alert after shown
            closeInSeconds: duration ? duration : 0
        });

    },
    confirm: function (text, callback) {
        swal.fire({
            text: text,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }).then(function (result) {
            callback(result);
        });
    },
    loading: function () {
        KTApp.startPageLoading();
    },
    hideLoading: function () {
        KTApp.stopPageLoading();
    },
    alert: function (text, callback) {
        swal.fire({
            text: text,
            type: 'warning',
            showCancelButton: false,
            confirmButtonText: '确定'
        }).then(function (result) {
            if (callback)
                callback(result);
        });
    },
    notify: function (msg, title, type) {
        notify(msg, title, type);
    },
    prompt: function (text, callback) {
        swal.fire({
            text: text,
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }).then(function (result) {
            if (callback)
                callback(result);
        });
    }
}

toastr.options = {
    "closeButton": true,
    "debug": false,
    "positionClass": "toast-bottom-right",
    "onclick": null,
    "showDuration": "1000",
    "hideDuration": "1000",
    "timeOut": "3000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

// type:warning,info,success,error
function notify(msg, title, type) {
    toastr[type ? type : 'info'](msg, title);
}

function round(value, precision) {
    var value = Math.round(value * Math.pow(10, precision))
        / Math.pow(10, precision);
    return value;
}


function RMBMoney(v) {
    if (v && v != "") {
        v = (Math.round((v - 0) * 10000)) / 10000;
        v = String(v);
        var ps = v.split(".");
        var whole = ps[0];
        var sub = ps[1] ? "." + ps[1] : ".00";
        var r = /(\d+)(\d{3})/;
        while (r.test(whole)) {
            whole = whole.replace(r, "$1" + "," + "$2");
        }
        v = whole + sub;
        if (v.charAt(0) == "-") {
            return "-\uffe5" + v.substr(1);
        }
        return "\uffe5" + v;
    } else {
        return "0";
    }
};

function NumToMoneyNum(v) {
    if (v && v != "") {
        v = (Math.round((v - 0) * 10000)) / 10000;
        v = String(v);
        var ps = v.split(".");
        var whole = ps[0];
        var sub = ps[1] ? "." + ps[1] : ".00";
        var r = /(\d+)(\d{3})/;
        while (r.test(whole)) {
            whole = whole.replace(r, "$1" + "," + "$2");
        }
        v = whole + sub;
        if (v.charAt(0) == "-") {
            return "-" + v.substr(1);
        }
        return v;
    } else {
        return "0";
    }
}

function readBlob(data) {
    var bstr = atob(data), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    var blob = new Blob([u8arr], {type: 'image/png'});
    var blobUrl = URL.createObjectURL(blob);
    return blobUrl;
}


function openBrowse(sUrl) {
    window.open(sUrl, "", "location=0,menubar=0,fullscreen=1,toolbar=0,top=0,left=0,width=" + window.screen.availWidth + ",height=" + window.screen.availHeight);
    //window.open(sUrl);
}

function printWindow(el, title) {
    var ptwindow = window.open('', '_blank', "location=0,menubar=0,fullscreen=1,toolbar=0,top=0,left=0,width=960,height=680");
    var titleHtml = "<h3 style='text-align:center;'>" + title + "</h3>"
    var printHtml = $(el).prop("outerHTML");
    var cssHtml = `<head>
        <title>打印</title> 
         <link href="${ctx}/static/assets/css/style.bundle.css" rel="stylesheet" type="text/css" />       
         <link href="${ctx}/static/assets/plugins/custom/datatables.net-bs4/css/dataTables.bootstrap4.css" rel="stylesheet" type="text/css" />
         <link href="${ctx}/static/css/main.css" rel="stylesheet" type="text/css" />
        </head>
    `;
    var scriptHtml = `<script  type="text/javascript">
            window.document.body.className="page_print";
            var c=document.body.children;
            debugger;
            for (i = 0; i < c.length; i++) {
                c[i].style.width = "100%";
            }
            window.print();
            window.close();
    </script>`;
    ptwindow.document.write(cssHtml + titleHtml + printHtml + scriptHtml);
}

function scrollUp(obj, time,idle) {

	var handler=function(){
		$(obj).css("padding-top","0px");

		var height =$(obj).find(":first").innerHeight();
		$(obj).animate({
			marginTop: -height+'px',
		},time, function () {
			$(this).css({marginTop: "0"}).find(":first").appendTo(this);
		})
	};

	var interv=setInterval(handler,idle?(time+2000):2000);


	$(obj).on('mouseover',function(){
		clearInterval(interv);
		interv=-1;
	});

	$(obj).on('mouseout',function(){
		setTimeout(function(){
			if (interv< 0)
				interv=setInterval(handler,idle?(time+2000):2000);
		},1000);
	});


}

