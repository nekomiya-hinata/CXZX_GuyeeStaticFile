"use strict";
// Class definition
var DemoList = function () {

    var initPage = function (that) {
        $('.quickSearch').on('keypress', function (e) {
             if (e.which == 13) {query();}
        });
        $('.btn_add').on('click', function () {
        	 window.open(ctx + "/admin/box/add");
        });
        $('.btn_search').on('click', function () {
        	query();
        });
        
        $('.date-picker').datepicker({
			language : 'zh-CN',
			autoclose : true,
			todayBtn : true,
			format : 'yyyy-mm-dd',
			orientation:'bottom'
		});
        
        this.datatable = $('#table').DataTable({
            "serverSide": true,
            responsive: true,
            searchDelay: 500,
            "language": Lang.datatable,
            "ajax": {
            	"url": ctx+"/admin/boxlog/quickSearch",
                "type": "GET",
                "data": function (params) {
                	 params.search_LIKE_boxid = $("#search_LIKE_boxid").val();
	            	 params.search_LIKE_xmname = $("#search_LIKE_xmname").val();
	            	 params.search_GE_ddate = $("#search_GE_ddate").val();
					 params.search_LT_ddate = $("#search_LT_ddate").val()==""?"":$("#search_LT_ddate").val()+" 23:59:59"; 
					 params.search_LIKE_zy = $("#search_LIKE_zy").val();
		      		 return params;
                }
            },
            "fnDrawCallback": function () {
                this.api().column(0).nodes().each(
                    function (cell, i) {
                        cell.innerHTML = i + 1;
                    });
            },
            "columns": [{ "data" : null,"title" :"序号", "width" : "30px","className": "text-center dt-nowrap"},
     					{ "data": "boxid","title" :"设备ID" ,"className": "text-center dt-nowrap"},
     					{ "data": "xmname","title" :"项目名称" ,"className": "text-center dt-nowrap"},
     					{ "data": "ddate","title" :"时间" ,"className": "text-center dt-nowrap"},
     					{ "data": "zy","title" :"摘要" ,"className": "text-center dt-nowrap"},
     					{ "data": "ipaddress","title" :"IP地址","className": " text-center dt-nowrap"},
                        {"data": "","className": "text-center dt-nowrap ","width": "160px","title": "操作",
     						render: function (data, type, row, meta) {
     							return `
		                        <a href="javascript:void(0)" class="btn  btn-clean " title="详情" onclick="DemoList.view(\'${row.id}\')">
		                          	详情
		                        </a> |
		                        <a href="javascript:void(0)" class="btn  btn-clean " title="删除" onclick="DemoList.del(\'${row.id}\')">
		                          	删除
		                        </a>`;
		                    
                },
            }]
        });
        function query() {
            DemoList.refresh();
        }
    };

    return {
        init: function () {
            initPage.apply(this);
        },
        refresh: function () {
            DemoList.datatable.ajax.reload();
        },
        view: function (id) {
        	window.open(ctx.concat("/admin/boxlog/info?id=",id));
        },
        del: function (id) {
			form_helpers.confirm('确定删除?', function(result) {
				if (result.value == true) {
					form_helpers.blockUI($(document.body));
					$.ajax({
						type : "POST",
						url : ctx + '/admin/boxlog/delete',
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
    };

}();

// Class initialization on page load
jQuery(document).ready(function () {
    DemoList.init();
});