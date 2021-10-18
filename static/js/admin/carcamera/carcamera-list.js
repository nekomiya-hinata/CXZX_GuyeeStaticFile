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
        	 window.open(ctx + "/admin/carcamera/add");
        });
        
        $('.btn_search').on('click', function () {
        	query();
        });
        
		 function isEmpty(value){
		    if(value == null || value == "" || value == "undefined" || value == undefined || value == "null"){
		        return true;
		    }
		    else{
		        if(value == ""){
		            return true;
		        }
		        return false;
		    }
		}
		
        this.datatable = $('#table').DataTable({
            "serverSide": true,
            responsive: true,
            searchDelay: 500,
            "language": Lang.datatable,
            "ajax": {
                "url": ctx + "/admin/carcamera/quickSearch",
                "type": "GET",
                "data": function (params) {
                    params.search_LIKE_cameraname = $("#param").val();
                	params.search_LIKE_address = $("#address").val();
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
            },{"data": "status","title" :"设备状态","className": " text-center dt-nowrap",
				"render" : function(data, type, full, meta) {
					if(data == "1"){
						return "<img src='"+ctx+"/static/image/bullet_green.png'>";
					}else{
						return "<img src='"+ctx+"/static/image/bullet_red.png'>";
					}
				}
			}, {
                "data": "placeid",
                "title": "场所标识",
                "className": " text-center dt-nowrap"
            }, {
                "data": "placename",
                "title": "场所名称",
                "className": " text-center dt-nowrap"
            }, {
                "data": "address",
                "title": "安装地点",
                "className": " text-center dt-nowrap"
            },{
                "data": "longitude",
                "title": "经度",
                "className": "text-center dt-nowrap"
            }, {
                "data": "latitude",
                "title": "纬度",
                "className": "text-center dt-nowrap"
            },{
                "data": "cameratypename",
                "title": "摄像头品牌名称",
                "className": "text-center dt-nowrap"
            },{
                "data": "mac",
                "title": "MAC地址",
                "className": "text-center dt-nowrap"
            },{
                "data": "serialno",
                "title": "设备序列码",
                "className": "text-center dt-nowrap"
            },{
                "data": "lasthearttime",
                "title": "设备最近心跳时间",
                "className": "text-center dt-nowrap"
            },{
                "data": "ip",
                "title": "IP",
                "className": "text-center dt-nowrap"
            },{
                "data": "gateway",
                "title": "设备网关",
                "className": "text-center dt-nowrap"
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
        	console.log(DemoList.datatable);
            DemoList.datatable.ajax.reload();
        },
        del: function (id) {
			form_helpers.confirm('确定删除?', function(result) {
				if (result.value == true) {
					form_helpers.blockUI($(document.body));
					$.ajax({
						type : "POST",
					 	url: ctx + "/admin/carcamera/delete",
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
            window.open(ctx + "/admin/carcamera/edit?carcameraid=" + arg);
        },
        view: function (arg) {
            window.open(ctx + "/admin/carcamera/info?id=" + arg);
        }
    };

}();

// Class initialization on page load
jQuery(document).ready(function () {
    DemoList.init();
});