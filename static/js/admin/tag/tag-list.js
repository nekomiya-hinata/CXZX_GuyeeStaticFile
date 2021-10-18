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
        	 window.open(ctx + "/admin/tag/add");
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
                "url": ctx + "/admin/tag/quickSearch",
                "type": "GET",
                "data": function (params) {
                    params.search_LIKE_templatename = $("#param").val();
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
                "data": "tag",
                "title": "标签名称",
                "className": "text-center dt-nowrap"
            },{
                "data": "typename",
                "title": "标签类型",
                "width": "150px",
                "visible":true,
                "className": "text-center dt-nowrap"
            },{
                "data": "usequantity",
                "title": "使用人数(当用户选择标签后+1,取消标签后-1)",
                "visible":true,
                "className": "text-center dt-nowrap"
            },  {
                "data": "description",
                "title": "标签说明",
                "visible":true,
            },  {
                "data": "",
                "className": "text-center dt-nowrap ",
                "width": "120px",
                "title": "操作",
                render: function (data, type, row, meta) {
                    return `
                        <a href="javascript:void(0)" class="btn  btn-clean " title="修改" onclick="DemoList.edit(${row.id})">
                          	修改
                        </a>
                        <a href="javascript:void(0)" class="btn  btn-clean " title="删除" onclick="DemoList.del(${row.id})">
                          	删除
                        </a>`;
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
        	console.log(DemoList.datatable);
            DemoList.datatable.ajax.reload();
        },
        del: function (id) {
			form_helpers.confirm('确定删除?', function(result) {
				if (result.value == true) {
					form_helpers.blockUI($(document.body));
					$.ajax({
						type : "POST",
					 	url: ctx + "/admin/tag/delete",
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
            window.open(ctx + "/admin/tag/edit?id=" + arg);
        },
        view: function (arg) {
            window.open(ctx + "/admin/tag/info?id=" + arg);
        }
    };

}();

// Class initialization on page load
jQuery(document).ready(function () {
    DemoList.init();
});