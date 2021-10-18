"use strict";
// Class definition
var DemoList = function () {

    var initPage = function (that) {
        $('.quickSearch').on('keypress', function (e) {
             if (e.which == 13) {query();}
        });
        $('.btn_add').on('click', function () {
        	var boxid=$("#boxid").val();
			window.open(ctx.concat("/admin/gate/wayadd?boxid="+boxid));
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
                "url": ctx + "/admin/gate/quickSearch",
                "type": "GET",
                "data": function (params) {
                	 params.search_LIKE_name=$("#param").val();
	            	 params.search_LIKE_accessdevsn=$("#accessdevsn").val();
	            	 params.search_EQ_boxid=$("#boxid").val();
		      		 return params;
                }
            },
            "fnDrawCallback": function () {
                this.api().column(0).nodes().each(
                    function (cell, i) {
                        cell.innerHTML = i + 1;
                    });
            },
            "columns": [{"data": null, "title": "序号","width": "30px","className": "text-center dt-nowrap"}, 
                        { "data": "boxid","title" :"设备ID","className": " text-center dt-nowrap"},
                        { "data": "name","title" :"通道名称","className": " text-center dt-nowrap"},
     					{ "data": "rfidreadername","title" :"现场标签类型" ,"className": "text-center dt-nowrap"},
     					{ "data": "inoutflag","title" :"进出方向" ,"className": "text-center dt-nowrap",
     						"render" : function(data, type, full, meta) {
     							if(data == "1"){
     								return "进"
     							}else if(data=="-1"){
     								return "出";
     							}else{
     								return "未知";
     							}
         				}},
                        { "data": "accessdevsn","title" :"道闸控制卡编号","className": " text-center dt-nowrap"},
                        { "data": "ip","title" :"设备IP地址" ,"className": "text-center dt-nowrap"},
     					{ "data": "gateway","title" :"设备网关" ,"className": "text-center dt-nowrap"},
     					{ "data": "serviceip","title" :"服务器地址" ,"className": "text-center dt-nowrap"},
     					{ "data": "inuse","title" :"是否在用" ,"className": "text-center dt-nowrap",
     						"render" : function(data, type, full, meta) {
							return data == "1" ? "是" : "否";
     						}
     					},
                        {"data": "","className": "text-center dt-nowrap ","width": "160px","title": "操作",
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
		                    
                }}]
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
        	window.open(ctx.concat("/admin/gate/info?id=",id));
        },
        edit: function (id) {
        	window.open(ctx + '/admin/gate/wayedit?id=' + id);
        },
        del: function (id) {
			form_helpers.confirm('确定删除?（删除时会将该通道下的白名单一起删除）', function(result) {
				if (result.value == true) {
					form_helpers.blockUI($(document.body));
					$.ajax({
						type : "POST",
						url : ctx + '/admin/gate/delete',
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