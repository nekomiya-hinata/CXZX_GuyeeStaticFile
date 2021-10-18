"use strict";
// Class definition
var RoleList = function () {

    var initPage = function (that) {
    	
    	$("#btn_resource").on('click',resource);
    	
        $('.quickSearch').on('keypress', function (e) {
                if (e.which == 13) {
                    query();
                }
        });

        $('.btn_add').on('click', function () {
            //openBrowse(ctx + '/admin/role/add', '新增');
        	 window.open(ctx + "/admin/role/add");
        });
        
        $('.btn_search').on('click', function () {
        	query();
        });
        
        function formatRepo(repo) {
            var markup = "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository'>" +
            "<div class='select2-result-repository__title'>" + repo.text + "</div>";
            	markup += "<div class='select2-result-repository__statistics'>" +
            "<div class='select2-result-repository__forks'>描述: </span> " + repo.desc + " </div>" +
            "</div>" +
            "</div></div>";
            return markup;
        };
	  
	  function formatRepoSelection(repo) {
		  return repo.name;
      };
      
        $('#roletype').select2({
			placeholder : "请选择场所类型...",
			language:'zh-CN',
			allowClear : true,
			templateResult: formatRepo,
			//multiple :true,
			escapeMarkup: function(markup) {
	                return markup;
	        },
	        //templateSelection: formatRepoSelection,
			ajax : {
				url : ctx + "/admin/role/enumroleList",
				dataType : 'json',
				method : 'GET',
				delay: 250,
				cache : true,
				processResults : function(data, page) {
					var result = [];
					$.each(data, function(index, val) {
						result.push({
							'id' : this.id,
							'text' : this.name,
							'desc':this.desc
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
                "url": ctx + "/admin/role/quickSearch",
                "type": "GET",
                "data": function (params) {
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
                "data": "rolename",
                "title": "角色名称",
                "className": " text-center dt-nowrap"
            }, {
                "data": "createdDate",
                "title": "创建时间",
                "className": " text-center dt-nowrap"
            }, {
                "data": "createdBy",
                "title": "创建操作人",
                "className": " text-center dt-nowrap"
            }, {
                "data": "usertypename",
                "title": "用户类型",
                "className": " text-center dt-nowrap"
            }, {
                "data": "",
                "className": "text-center dt-nowrap ",
                "width": "80px",
                "title": "操作",
                render: function (data, type, row, meta) {
                    return `
                        <a href="javascript:void(0)" class="btn  btn-clean " title="查看" onclick="RoleList.view(${row.id})">
                          	查看
                        </a>
                        <span class="dropdown">
                            <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown" aria-expanded="true">
                                <i class="flaticon-more-1"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a class="dropdown-item" href="javascript:void(0)" onclick="RoleList.edit(${row.id})"><i class="la la-edit"></i> 修改</a>
                                <a class="dropdown-item" href="javascript:void(0)" onclick="RoleList.del(${row.id})"><i class="la la-trash"></i> 删除</a>
                            </div>
                        </span>`;
                },
            }]
        });


        function query() {
            RoleList.refresh();
        }
        
        function resource() {
        	 window.open(ctx + "/admin/role/resource");
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
            RoleList.datatable.ajax.reload();
        },
        del: function (id) {
			form_helpers.confirm('确定删除?', function(result) {
				if (result.value == true) {
					form_helpers.blockUI($(document.body));
					$.ajax({
						type : "POST",
					 	url: ctx + "/admin/role/delete",
						data : {
							'id' : id,
						},
						success : function(data) {
							form_helpers.unblockUI($(document.body));
							if (data.success) {
							 RoleList.refresh();
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
            window.open(ctx + "/admin/role/edit?id=" + arg);
        },
        view: function (arg) {
            window.open(ctx + "/admin/role/info?id=" + arg
            )
        }
    };

}();

// Class initialization on page load
jQuery(document).ready(function () {
    RoleList.init();
});