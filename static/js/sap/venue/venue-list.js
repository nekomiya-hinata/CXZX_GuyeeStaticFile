"use strict";
// Class definition
var DemoList = function () {

    var initPage = function (that) {

        $('.quickSearch').on('keypress', function (e) {
                if (e.which == 13) {
                    query();
                }
        });

        $('.btn_add').on('click', function () {
            //openBrowse(ctx + '/sap/venue/add', '新增');
        	 window.open(ctx + "/sap/venue/add");
        });
        
        $('.btn_search').on('click', function () {
        	query();
        });
        

        this.datatable = $('#table').DataTable({
            "serverSide": true,
            responsive: true,
            searchDelay: 500,
            "language": Lang.datatable,
            "ajax": {
                "url": ctx + "/sap/venue/connectSearch",
                "type": "GET",
                "data": function (params) {
                    params.search_LIKE_name = $("#param").val();
                	params.search_LIKE_shortname = $("#shortname").val();
                	params.search_EQ_code = $("#code").val();
                	params.search_EQ_venuetype = $("#venuetype").val();
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
                "data": "name",
                "title": "标准名称",
                "className": " text-center dt-nowrap"
            }, {
                "data": "shortname",
                "title": "简称",
                "className": "text-center dt-nowrap"
            }, {
                "data": "code",
                "title": "场所编号",
                "className": "text-center dt-nowrap"
            }, {
                "data": "venuetypename",
                "title": "场所类别",
                "className": " text-center dt-nowrap"
            }, {
                "data": "address",
                "title": "地址信息",
                "className": " text-center dt-nowrap"
            }, {
                "data": "management",
                "title": "业主单位",
                "className": " text-center dt-nowrap"
            }, {
                "data": "street",
                "title": "辖区街道/乡镇/村",
                "className": " text-center dt-nowrap"
            }, {
                "data": "police",
                "title": "辖区派出所",
                "className": " text-center dt-nowrap"
            }, {
                "data": "devicequantity",
                "title": "设备数量",
                "className": " text-center dt-nowrap"
            }/*, {
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
                            </div>
                        </span>`;
                },
            }*/]
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
        del: function (id) {
			form_helpers.confirm('确定删除?', function(result) {
				if (result.value == true) {
					form_helpers.blockUI($(document.body));
					$.ajax({
						type : "POST",
					 	url: ctx + "/sap/venue/delete",
						data : {
							'id' : id,
						},
						success : function(data) {
							form_helpers.unblockUI($(document.body));
							if (data.success) {
							 DemoList.refresh();
								form_helpers.notify(data.msg, '提示','success');
							} else {
								form_helpers.notify(data.msg, '提示','error');
							}
						},
						error : function(data) {
							form_helpers.unblockUI($(document.body));
							form_helpers.notify('数据获取失败，请检查网络是否畅通!',"提示", "error");
						},
						complete : function(XHR, TS) {
							XHR = null
						}
					});
				}
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
            window.open(ctx + "/sap/venue/edit?id=" + arg);
        },
        view: function (arg) {
            window.open(ctx + "/sap/venue/info?id=" + arg
            )
        }
    };

}();

// Class initialization on page load
jQuery(document).ready(function () {
    DemoList.init();
});