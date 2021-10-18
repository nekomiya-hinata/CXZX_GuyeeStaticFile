"use strict";
// Class definition
var DemoList = function () {

    var initPage = function (that) {

        $('.quickSearch').on('keypress', function (e) {
                if (e.which == 13) {
                    query();
                }
        });

        $('#btn_add').on('click', function () {
            openBrowse(ctx + '/demo/add', '新增');
        });


        $('#btn_export').on('click', function () {
            form_helpers.alert("safsd")
        });

        $('#btn_print').on('click', function () {
            printWindow($('#table'), '列表');
        });

        // begin first table
        this.datatable = $('#table').DataTable({
            "serverSide": true,
            responsive: true,
            searchDelay: 500,
            "language": Lang.datatable,
            "ajax": {
                "url": ctx + "/user/list",
                "type": "GET",
                "data": function (params) {// Ajax提交到服务端的请求数据
                    params.param = $("#param").val();// 默认加载没有任何条件则查询全部，当单击查询按钮时提交条件查询后台数据库
                    console.debug(params);
                    return params;
                }
            },
            "fnDrawCallback": function () {
                this.api().column(0).nodes().each(
                    function (cell, i) {
                        cell.innerHTML = i + 1;
                    });

            },
            "columns": [{
                "data": null,
                "title": "序号",
                "width": "30px",
                "className": "text-center dt-nowrap"
            }, {
                "data": "username",
                "title": "账号",
                "className": " text-center dt-nowrap"
            }, {
                "data": "truename",
                "title": "姓名",
                "className": "text-center dt-nowrap"
            }, {
                "data": "usertypename",
                "title": "用户类型",
                "className": "text-center dt-nowrap"
            }, {
                "data": "orgname",
                "title": "所属单位",
                "className": "text-center dt-nowrap",
                "width": "120px"
            }, {
                "data": "enabled",
                "title": "账号可用",
                "className": " text-center dt-nowrap",
                "render": function (data, type, full, meta) {
                    return data == 1 ? "是" : "否";
                }
            }, {
                "data": "locked",
                "title": "用户锁定",
                "className": " text-center dt-nowrap",
                "render": function (data, type, full, meta) {
                    return data == 1 ? "是" : "否";
                }
            }, {
                "data": "mobile",
                "title": "电话",
                "className": " text-center dt-nowrap"
            }, {
                "data": "lastModifiedBy",
                "title": "修改人",
                "className": " text-center dt-nowrap"
            }, {
                "data": "lastModifiedDate",
                "title": "修改时间",
                "className": " text-center dt-nowrap"
            }, {
                "data": "",
                "className": "text-center dt-nowrap ",
                "width": "80px",
                "title": "操作",
                render: function (data, type, row, meta) {
                    return `
                        <a href="javascript:void(0)" class="btn  btn-clean " title="查看" onclick="DemoList.view(${row.id})">
                          查看
                        </a>
                        <span class="dropdown">
                            <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown" aria-expanded="true">
                                <i class="flaticon-more-1"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a class="dropdown-item" href="javascript:void(0)" onclick="DemoList.edit(${row.id})"><i class="la la-edit"></i> 修改</a>
                                <a class="dropdown-item" href="javascript:void(0)" onclick="DemoList.del(${row.id})"><i class="la la-trash"></i> 删除</a>
                                <a class="dropdown-item" href="javascript:void(0)" onclick="DemoList.check(${row.id})"><i class="la la-check-circle"></i> 审核</a>
                            </div>
                        </span>`;
                },
            }]
        });


        function query() {
            DemoList.refresh();
        }
    };

    var initData = function () {

    }


    return {
        init: function () {
            initPage.apply(this);
            initData.apply(this);
        },
        refresh: function () {
            DemoList.datatable.ajax.reload();
        },
        del: function (arg) {
            blockUI($(window.document.body), '正在删除文件...');
            $.ajax({
                type: 'POST',
                url: ctx + "/demo/delete",
                dataType: "json",
                data: {
                    'id': arg,
                },
                success: function (data) {
                    unblockUI($(window.document.body));
                    if (data.success) {
                        form_helpers.success(data.msg, '提示');
                        DemoList.refresh();
                    } else {
                        form_helpers.error(data.msg, $("#table_content"));
                    }
                },
                error: function (req, status, ex) {
                    unblockUI($(window.document.body));
                    form_helpers.error("网络连接错误!", $("#table_content"));
                },
                timeout: 60000
            });
        },
        check: function (arg) {
            blockUI($(window.document.body), '正在删除文件...');
            $.ajax({
                type: 'POST',
                url: ctx + "/demo",
                dataType: "json",
                data: {
                    'id': arg,
                },
                success: function (data) {
                    unblockUI($(window.document.body));
                    if (data.success) {
                        form_helpers.success(data.msg, '提示');
                        DemoList.refresh();
                    } else {
                        form_helpers.error(data.msg, $("#table_content"));
                    }
                },
                error: function (req, status, ex) {
                    unblockUI($(window.document.body));
                    form_helpers.error("网络连接错误!", $("#table_content"));
                },
                timeout: 60000
            });
        },
        edit: function (arg) {
            window.open(ctx + "/demo/edit?id=" + arg);
        },
        view: function (arg) {
            window.open(ctx + "/demo/info?id=" + arg
            )
        }
    };

}();

// Class initialization on page load
jQuery(document).ready(function () {
    DemoList.init();
});