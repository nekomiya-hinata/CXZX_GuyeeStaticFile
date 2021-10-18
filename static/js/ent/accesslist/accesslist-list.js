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
        
        this.datatable = $('#table').DataTable({
            "serverSide": true,
            responsive: true,
            searchDelay: 500,
            "language": Lang.datatable,
            "ajax": {
            	"url" : ctx + "/ent/accesslist/quickSearch",
                "type": "GET",
                "data": function (params) {
                	params.name=$("#param").val();
                	return params;
                }
            },
            "fnDrawCallback": function () {
                this.api().column(0).nodes().each(
                    function (cell, i) {
                        cell.innerHTML = i + 1;
                    });
            },
            "columns": [{ "data" : null,"title":"序号","width" : "30px","className": "text-center dt-nowrap"},
    			        {"data" : "massname","title":"人员姓名","className" : " text-center dt-nowrap",
				        	"render":function(data,type,row,meta){
			               	 	return "<a style='text-decoration:none;' target='_blank' href='"+ctx+"/ent/staff/get?id="+row.staffid+"'>"+data+"</a>";
				        }},
				        {"data" : "venuename","title":"场所名称","className" : " text-center dt-nowrap","visible":false},
				        {"data" : "typename","title":"识别状态","className" : " text-center dt-nowrap","visible":false},
				        {"data" : "typename","title":"人员类型","className" : " text-center dt-nowrap"},
				        {"data" : "temperature","title":"体温(℃)","className" : " text-center dt-nowrap"},
				        {"data" : "wayname","title":"出入通道","className" : " text-center dt-nowrap"},
				        {"data" : "inoutflag","title":"出入方向","className" : " text-center dt-nowrap",
				        	"render" : function(data,type,row,meta){
								if(data==0)
									return "进";
								if(data==1)
									return "出";
								else
									return "";
							}
				        },
				        {"data" : "passagemode","title":"通行方式","width":"200px","className" : " text-center dt-nowrap"},
				        {"data" : "kqtime","title":"通行时间","width":"200px","className" : " text-center dt-nowrap"},
				        {"data" : "kqurl","title":"通行图片","className" : " text-center dt-nowrap",
				        	"mRender": function ( data, type, row, meta) {
				        		return '<a onclick=AccessList.view(\"'+row.id+'\")><img src='+urlFormat(row.kqurl,60,60)+'> </a>';
							}
				        },
                        {"data": "","className": "text-center dt-nowrap ","width": "160px","title": "操作",
     						render: function (data, type, row, meta) {
     							return `
		                        <a href="javascript:void(0)" class="btn  btn-clean " title="查看" onclick="DemoList.view(\'${row.id}\')">
		                          	查看
		                        </a>
		                        <span class="dropdown">
		                            <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown" aria-expanded="true">
		                                <i class="flaticon-more-1"></i>
		                            </a>
		                            <div class="dropdown-menu dropdown-menu-right">
		                            	<a class="dropdown-item" href="javascript:void(0)" onclick="DemoList.way(\'${row.id}\')"><i class="la la-road"></i> 配置通道</a>
		                                <a class="dropdown-item" href="javascript:void(0)" onclick="DemoList.edit(\'${row.id}\')"><i class="la la-edit"></i> 修改</a>
		                                <a class="dropdown-item" href="javascript:void(0)" onclick="DemoList.del(\'${row.id}\')"><i class="la la-trash"></i> 删除</a>
		                            </div>
		                        </span>`;
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
        	console.log(DemoList.datatable);
            DemoList.datatable.ajax.reload();
        },
        view: function (id) {
            window.open(ctx + "/admin/box/info?id=" + id);
        },
        edit: function (id) {
            window.open(ctx + '/admin/box/edit?id=' + id);
        },
        del: function (id) {
			form_helpers.confirm('确定删除?（删除时会将该设备下的通道与白名单一起删除）', function(result) {
				if (result.value == true) {
					form_helpers.blockUI($(document.body));
					$.ajax({
						type : "POST",
					 	url: ctx + "/admin/box/delete",
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
        way:function(id)
	    {
	    	window.open(ctx.concat("/admin/gate/waylist?boxid=",id));
	    },
	    boxconfig:function(id)
	    {
	    	window.open(ctx.concat("/admin/boxconfig/add?boxid=",id));
	    },
    };

}();

// Class initialization on page load
jQuery(document).ready(function () {
    DemoList.init();
});