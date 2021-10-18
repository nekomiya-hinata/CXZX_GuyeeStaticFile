/**
 Page script to handle the theme
 **/
moment.locale('zh_CN');

var Page = function () {
    // Handle Theme Settings
    var handleTheme = function () {

        var panel = $('.theme-panel');

        // handle theme colors
        var setColor = function (color) {
            var color_ = (KTUtil.isRTL() ? color + '-rtl' : color);
            $('#base_color').attr("href", ctx + '/css/skins/header/base/' + color + ".css");
        };

        var setAsideColor = function (color) {
            var color_ = (KTUtil.isRTL() ? color + '-rtl' : color);
            $('#aside_color').attr("href", ctx + '/css/skins/aside/' + color + ".css");
        };


        $('.theme-colors > li', panel).click(function () {
            var color = $(this).attr("data-theme");
            setColor(color);
        });

        $('.aside-colors > li', panel).click(function () {
            var color = $(this).attr("data-theme");
            setAsideColor(color);
        });
    };


    var initDatepicker = function () {

        var arrows;
        if (KTUtil.isRTL()) {
            arrows = {
                leftArrow: '<i class="la la-angle-right"></i>',
                rightArrow: '<i class="la la-angle-left"></i>'
            }
        } else {
            arrows = {
                leftArrow: '<i class="la la-angle-left"></i>',
                rightArrow: '<i class="la la-angle-right"></i>'
            }
        }

        // minimum setup
        $('.kt-datepicker').datepicker({
            rtl: KTUtil.isRTL(),
            language: Lang.datepicker,
            todayHighlight: true,
            format: 'yyyy-mm-dd',
            autoclose: true,
            orientation: "bottom",
            templates: arrows
        });

    }

    var initDatatable = function () {
        $.extend($.fn.dataTable.defaults, {// 初始化datables
            "searching": false,
            "ordering": false,
            "filter": false,
            "info": true,
            "paging": true,
            "lengthChange": false,
            "processing": true,
            "lengthMenu": [10],// 每页条数
        });
    }

    var initTopbar=function(){
        if (!$('.kt-header__topbar').is(":hidden"))
        {
            $('#user_setting').on('click',function(){
                 openBrowse(ctx+'/my/account');
            });
            $('#user_password').on('click',function(){
                openBrowse(ctx+'/my/account/password');
            });


        }

    }


    return {

        //main function to initiate the theme
        init: function () {
            // handles style customer tool

            KTApp.startPageLoading();
            handleTheme();
            initTopbar();
            initDatepicker();
            initDatatable();


            $('.kt-aside-menu li.kt-menu__item > a[data-url$="'+ window.location.pathname +'"]').each(function(i){
                var  target=$(this).parents('li');
                target.addClass('kt-menu__item--active');
                target.parentsUntil('.kt-aside-menu','li.kt-menu__item').addClass('kt-menu__item--open');
            });

            $('.btn_close,#btn_close').on("click",function () {
                window.close();
            });

            KTApp.stopPageLoading();
        }
    };

}();

if (KTUtil.isAngularVersion() === false) {
    jQuery(document).ready(function () {
        Page.init(); // init metronic core componets
    });
}


Lang = {
    datatable: {
        "processing": "<img src='" + ctx + "/static/image/loading-spinner-default.gif'/>",
        "loadingRecords": "数据加载中...",
        "lengthMenu": "每页显示 _MENU_ 条记录",
        "zeroRecords": "没有找到符合条件的数据.",
        "info": "显示_START_ 至 _END_ 条记录   共_TOTAL_条记录",
        "infoEmpty": "没有获取数据",
        "emptyTable": "数据记录为空",
        "infoFiltered": "(从 _MAX_ 条数据中过滤)",
        "infoPostFix": "",
        "search": "查询",
        "paginate": {
            "first": "第一页",
            "previous": "上一页",
            "next": "下一页",
            "last": "最后一页"
        }
    },
    datepicker: 'zh-CN',
    uppy:Uppy.locales.zh_CN
};


