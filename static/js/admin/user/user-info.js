"use strict";
// Class definition
var UserInfo = function () {

    var initPage = function (that) {
        $('.quickSearch').on('keypress', function (e) {
                if (e.which == 13) {
                    query();
                }
        });
        
        $('#btn_edit').on('click', function () {
        	edit();
        });
        
        
        $.extend($.fn.dataTable.defaults, {
			"pageLength": 4,
		});
        
        this.datatable = $('#table').DataTable({
            "serverSide": true,
            responsive: true,
            searchDelay: 500,
            "language": Lang.datatable,
            "ajax": {
                "url": ctx + "/admin/user/role/list",
                "type": "GET",
                "data": function (params) {
                	params.userid = $("#id").val();
                    return params;
                }
            },"fnDrawCallback": function () {
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
	                "data": "rolename",
	                "title": "角色名称",
	                "className": " text-center dt-nowrap"
	            }, {
	                "data": "createdDate",
	                "title": "设定角色时间",
	                "className": " text-center dt-nowrap"
	            }, {
	                "data": "createdBy",
	                "title": "设定角色操作人",
	                "className": " text-center dt-nowrap"
	            },  {
	                "data": "",
	                "className": "text-center dt-nowrap ",
	                "width": "80px",
	                "title": "操作",
	                render: function (data, type, row, meta) {
                    return `
                        <a class="dropdown-item" href="javascript:void(0)" onclick="UserInfo.del(${row.userid},${row.roleid})"><i class="la la-trash"></i> 删除</a>
                        `;
                },
            }]
        });
		
		
		
        function edit(){
        	 window.open(ctx + "/admin/venue/edit?id=" + $("#id").val());
        }
        
        function query() {
            UserInfo.refresh();
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
        	window.location.reload();
        },
        del: function (userid,roleid) {
		form_helpers.confirm('确定删除?', function(result) {
			if (result.value == true) {
	            blockUI($(window.document.body), '正在删除文件...');
	            $.ajax({
	                type: 'POST',
	                url: ctx + "/admin/user/role/delete",
	                dataType: "json",
	                data: {
	                    'userid': userid,
	                    'roleid':roleid
	                },
	                success: function (data) {
	                    unblockUI($(window.document.body));
	                    if (data.success) {
	                        form_helpers.success(data.msg, '提示');
	                        UserInfo.refresh();
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
			}
		});
        },
    };

}();

// Class initialization on page load
jQuery(document).ready(function () {
    UserInfo.init();
});