"use strict";
// Class definition
var DemoList = function () {

    var initPage = function (that) {

        $('.quickSearch').on('keypress', function (e) {
            if (e.which == 13) {query();}
        });
        $('.btn_search').on('click', function () {
        	query();
        });

        $('.btn_add').on('click', function () {
        	 window.open(ctx + "/admin/library/add");
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
                "url": ctx + "/admin/library/quickSearch",
                "type": "GET",
                "data": function (params) {
                    params.search_LIKE_name = $("#param").val();
                	params.search_LIKE_token = $("#token").val();
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
                "title": "底库名称",
                "className": " text-center dt-nowrap"
            }, {
                "data": "branchname",
                "title": "关联行政区划",
                "className": " text-center dt-nowrap"
            },  {
                "data": "placename",
                "title": "关联场所",
                "className": " text-center dt-nowrap"
            },{
                "data": "token",
                "title": "底库编码",
                "className": "text-center dt-nowrap"
            }, {
                "data": "createdBy",
                "title": "创建人",
                "className": " text-center dt-nowrap"
            }, {
                "data": "createdDate",
                "title": "创建时间",
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
                            	 <a class="dropdown-item" href="javascript:void(0)" onclick="DemoList.relation(${row.id})"><i class="la la-trash"></i> 关系库管理</a>
                                <a class="dropdown-item" href="javascript:void(0)" onclick="DemoList.edit(${row.id})"><i class="la la-edit"></i> 修改</a>
                                <a class="dropdown-item" href="javascript:void(0)" onclick="DemoList.del(${row.id})"><i class="la la-trash"></i> 删除</a>
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
        del: function (id) {
			form_helpers.confirm('确定删除?', function(result) {
				if (result.value == true) {
					form_helpers.blockUI($(document.body));
					$.ajax({
						type : "POST",
					 	url: ctx + "/admin/library/delete",
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
        edit: function (arg) {
            window.open(ctx + "/admin/library/edit?id=" + arg);
        },
        view: function (arg) {
            window.open(ctx + "/admin/library/info?id=" + arg);
        },
        relation:function (arg) {
            window.open(ctx + "/admin/libraryrelation?libraryid=" + arg);
        },
    };

}();

// Class initialization on page load
jQuery(document).ready(function () {
    DemoList.init();
});