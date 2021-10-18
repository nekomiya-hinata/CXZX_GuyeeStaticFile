"use strict";
// Class definition
var UserList = function () {

    var initPage = function (that) {

        $('.quickSearch').on('keypress', function (e) {
                if (e.which == 13) {
                    query();
                }
        });

        $('.btn_add').on('click', function () {
        	 window.open(ctx + "/admin/branch/add");
        });
        
        $('.btn_search').on('click', function () {
        	query();
        });
        
        function formatRepo(repo) {
            var markup = "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository'>" +
            "<div class='select2-result-repository__title'>" + repo.text + "</div>";
            	markup += "<div class='select2-result-repository__statistics'>" +
            "</div>" +
            "</div></div>";
            return markup;
        };
	  
	  function formatRepoSelection(repo) {
		  return repo.name;
      };

        this.datatable = $('#table').DataTable({
            "serverSide": true,
            responsive: true,
            searchDelay: 500,
            "language": Lang.datatable,
            "ajax": {
                "url": ctx + "/admin/branch/quickSearch",
                "type": "GET",
                "data": function (params) {
                    params.search_LIKE_name = $("#param").val();
                    params.search_EQ_fparentid = $("#fparentid").val();
                    params.search_LIKE_code = $("#code").val();
                    
                    /*params["search_EQ_usertype.id"] = $("#usertypeid").val();*/
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
	            },{
					"data" : "id",
					"title" : "行政标识",
					"className" : " text-center dt-nowrap"
				},  {
					"data" : "name",
					"title" : "行政名称",
					"className" : " text-center dt-nowrap"
				}, {
					"data" : "code",
					"title" : "行政编码",
					"className" : " text-center dt-nowrap"
				},{
					"data" : "branchclassname",
					"title" : "行政类型",
					"className" : " text-center dt-nowrap"
				},{
					"data" : "fparentid",
					"title" : "上级行政标识",
					"className" : " text-center dt-nowrap"
				},{
					"data" : "fparentname",
					"title" : "上级行政名称",
					"className" : " text-center dt-nowrap"
				}, {
					"data" : "signinuse",
					"title" : "是否可用",
					"className" : " text-center dt-nowrap",
					"render" : function(data, type, full, meta) {
						return data == 1 ? "是" : "否";
					}
				},{
					"data" : "signinuse",
					"title" : "是否可用",
					"className" : " text-center dt-nowrap",
					"render" : function(data, type, full, meta) {
						return data == 1 ? "是" : "否";
					}
				},{
					"data" : "longitude",
					"title" : "经度",
					"className" : " text-center dt-nowrap"
				},{
					"data" : "latitude",
					"title" : "纬度",
					"className" : " text-center dt-nowrap"
				},{
					"data" : "bpaddress",
					"title" : "边界地址",
					"className" : " text-center dt-nowrap"
				},{
					"data" : "plate",
					"title" : "当地车牌",
					"className" : " text-center dt-nowrap"
				}, {
	                "data": "",
	                "className": "text-center dt-nowrap ",
	                "width": "80px",
	                "title": "操作",
	                render: function (data, type, row, meta) {
                    return `
                        <a href="javascript:void(0)" class="btn  btn-clean " title="修改" onclick="UserList.edit(${row.id})">
                          	修改
                        </a>
                        <span class="dropdown">
                            <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown" aria-expanded="true">
                                <i class="flaticon-more-1"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a class="dropdown-item" href="javascript:void(0)" onclick="UserList.del(${row.id})"><i class="la la-trash"></i> 删除</a>
                            </div>
                        </span>`;
                },
            }]
        });

        function query() {
            UserList.refresh();
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
            UserList.datatable.ajax.reload();
        },
        del: function (id) {
			form_helpers.confirm('确定删除?', function(result) {
				if (result.value == true) {
					form_helpers.blockUI($(document.body));
					$.ajax({
						type : "POST",
					 	url: ctx + "/admin/branch/delete",
						data : {
							'id' : id,
						},
						success : function(data) {
							form_helpers.unblockUI($(document.body));
							if (data.success) {
								UserList.refresh();
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
            window.open(ctx + "/admin/branch/edit?id=" + arg);
        }
    };

}();

// Class initialization on page load
jQuery(document).ready(function () {
    UserList.init();
});