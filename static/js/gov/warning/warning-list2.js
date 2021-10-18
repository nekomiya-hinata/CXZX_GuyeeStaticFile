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
        
        $('.btn_search').on('click', function () {
        	query();
        });

        this.datatable = $('#table').DataTable({
            "serverSide": true,
            responsive: true,
            searchDelay: 500,
            "language": Lang.datatable,
            "ajax": {
                "url": ctx + "/gov/warning/quickSearch",
                "type": "GET",
                "data": function (params) {
                	params.search_LIKE_massname = $("#param").val();
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
                "visible": false,
                "width": "30px",
                "className": "text-center dt-nowrap"
            },{"data" : "snaphoto","title":"抓拍图像","className" : " text-center dt-nowrap",
	        	"mRender": function ( data, type, row, meta) {
	        		return '<img src='+urlFormat(row.snapphoto,60,60)+'>';
				}
	        },/*{"data" : "photo","title":"入库图像","className" : " text-center dt-nowrap",
	        	"mRender": function ( data, type, row, meta) {
	        		return '<img src='+urlFormat(row.photo,60,60)+'>';
				}
	        },*/{
                "data": "similar",
                "title": "相似度",
                "className": " text-center dt-nowrap"
            },{
                "data": "massname",
                "title": "姓名",
                "className": " text-center dt-nowrap"
            },{
                "data": "boxtypename",
                "title": "抓拍设备",
                "className": " text-center dt-nowrap"
            },
            {
                "data": "venuename",
                "title": "发现地点",
                "className": " text-center dt-nowrap"
            }, {
                "data": "warningtime",
                "title": "预警时间",
                "className": " text-center dt-nowrap",
                render: function (data, type, row, meta) {
                   if(data=="" ||data==null){
                	   return "";
                   }else{
                	   return data;
                   }
                }
            }, {
                "data": "kqtime",
                "title": "抓拍时间",
                "className": "text-center dt-nowrap"
            },{
                "data": "content",
                "title": "预警内容",
                "className": "text-center dt-nowrap"
            },/*, {
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
        	console.log(DemoList.datatable);
            DemoList.datatable.ajax.reload();
        },
        del: function (id) {
			form_helpers.confirm('确定删除?', function(result) {
				if (result.value == true) {
					form_helpers.blockUI($(document.body));
					$.ajax({
						type : "POST",
					 	url: ctx + "/gov/librarystaff/delete",
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
            window.open(ctx + "/gov/librarystaff/edit?id=" + arg);
        },
        view: function (arg) {
            window.open(ctx + "/gov/librarystaff/info?id=" + arg);
        }
    };

}();

// Class initialization on page load
jQuery(document).ready(function () {
    DemoList.init();
});