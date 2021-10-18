"use strict";
// Class definition
var DeviceList = function () {

    var initPage = function (that) {

        $('.quickSearch').on('keypress', function (e) {
                if (e.which == 13) {
                    query();
                }
        });

        $('.btn_add').on('click', function () {
        	 window.open(ctx + "/sap/device/add");
        });
        
        $('.btn_search').on('click', function () {
        	query();
        });
      
        $('#type').select2({
			placeholder : "请选择设备类型...",
			language:'zh-CN',
			allowClear : true,
			minimumResultsForSearch: -1,
			ajax : {
				url : ctx + "/sap/device/getEnumDeviceTypeList",
				dataType : 'json',
				method : 'GET',
				delay: 250,
				cache : true,
				processResults : function(data, page) {
					var result = [];
					$.each(data, function(index, val) {
						result.push({
							'id' : this.id,
							'text' : this.name
						});
					});
					return {
						results : result
					};
				}
			}
		})
        

        this.datatable = $('#table').DataTable({
            "serverSide": true,
            responsive: true,
            searchDelay: 500,
            "language": Lang.datatable,
            "ajax": {
                "url": ctx + "/sap/device/quickSearch",
                "type": "GET",
                "data": function (params) {
                    params.search_LIKE_code = $("#param").val();
                	params.search_LIKE_mac = $("#mac").val();
                	params.search_LIKE_producer = $("#producer").val();
                	params.search_EQ_type = $("#type").val();
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
                "data": "code",
                "title": "设备编码",
                "className": " text-center dt-nowrap"
            }, {
                "data": "mac",
                "title": "MAC地址",
                "className": "text-center dt-nowrap"
            }, {
                "data": "producer",
                "title": "设备厂家",
                "className": "text-center dt-nowrap"
            }, {
                "data": "typeName",
                "title": "设备类型",
            }, {
                "data": "venueaddress",
                "title": "设备位置",
                "className": " text-center dt-nowrap"
            },{
                "data": "",
                "className": "text-center dt-nowrap ",
                "width": "80px",
                "title": "操作",
                render: function (data, type, row, meta) {
                    return `
                        <a href="javascript:void(0)" class="btn  btn-clean " title="查看" onclick="DeviceList.view(${row.id})">
                          	查看
                        </a>
                        <span class="dropdown">
                            <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown" aria-expanded="true">
                                <i class="flaticon-more-1"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a class="dropdown-item" href="javascript:void(0)" onclick="DeviceList.edit(${row.id})"><i class="la la-edit"></i> 修改</a>
                            </div>
                        </span>`;
                },
            }]
        });


        function query() {
            DeviceList.refresh();
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
            DeviceList.datatable.ajax.reload();
        },
        del: function (id) {
			form_helpers.confirm('确定删除?', function(result) {
				if (result.value == true) {
					form_helpers.blockUI($(document.body));
					$.ajax({
						type : "POST",
					 	url: ctx + "/sap/device/delete",
						data : {
							'id' : id,
						},
						success : function(data) {
							form_helpers.unblockUI($(document.body));
							if (data.success) {
							 DeviceList.refresh();
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
            window.open(ctx + "/sap/device/edit?id=" + arg);
        },
        view: function (arg) {
            window.open(ctx + "/sap/device/info?id=" + arg
            )
        }
    };

}();

// Class initialization on page load
jQuery(document).ready(function () {
    DeviceList.init();
});