var MyLog = function () {
    var initData = function () {

    };
    var initPage = function () {

        $('.quickSearch').on('keypress', function (e) {
            if (e.which == 13) {
                query();
            }
        });

        this.datatable = $('#table').DataTable({
            "serverSide": true,
            "language": Lang.datatable,
            "ajax": {
                "url": ctx + "/my/mylog?username=" + $('#username').val(),
                "type": "GET",
                "data": function (params) {// Ajax提交到服务端的请求数据
                	params.param=$('#param').val();
                    return params;
                }
            },
            "fnDrawCallback": function () {
                this.api().column(0).nodes().each(function (cell, i) {
                    cell.innerHTML = i + 1;
                });

            },
            "columns": [{
                "data": null,
                "title": "序号",
                "width": "30px",
                "className": "text-center dt-nowrap"
            }, {
                "data": "level",
                "width": "80px",
                "title": "级别",
                "className": " text-center dt-nowrap"
            }, {
                "data": "event",
                "title": "事件",
                "width": "80px",
                "className": " text-center dt-nowrap"
            }, {
                "data": "logtime",
                "width": "100px",
                "title": "时间",
                "className": "text-center dt-nowrap"
            }, {
                "data": "content",
                "title": "日志内容",
                "className": " text-center dt-nowrap",

            }]
        });

        function query() {
			MyLog.datatable.ajax.reload();
        }

    }


    return {
        init: function () {
			initPage.apply(this);
			initData.apply(this);
        }
    }
}();


$(function () {
    MyLog.init();
});