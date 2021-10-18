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
            //openBrowse(ctx + '/admin/user/add', '新增');
        	 window.open(ctx + "/admin/user/add");
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
      
		
        $('#usertypeid').select2({
			placeholder : "请选择用户类型...",
			language:'zh-CN',
			allowClear : true,
			templateResult: formatRepo,
			//multiple :true,
			escapeMarkup: function(markup) {
	                return markup;
	        },
	        //templateSelection: formatRepoSelection,
			ajax : {
				url : ctx + "/admin/user/type",
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
                "url": ctx + "/admin/user/quickSearch",
                "type": "GET",
                "data": function (params) {
                    params.search_LIKE_truename = $("#param").val();
                    params["search_EQ_usertype.id"] = $("#usertypeid").val();
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
					"data" : "truename",
					"title" : "姓名",
					"className" : " text-center dt-nowrap"
				}, {
					"data" : "username",
					"title" : "账号",
					"className" : " text-center dt-nowrap"
				},{
					"data" : "password",
					"title" : "密码",
					"className" : " text-center dt-nowrap"
				},{
					"data" : "orgid",
					"title" : "关联(行政/场所)标识",
					"className" : " text-center dt-nowrap"
				},{
					"data" : "orgname",
					"title" : "关联(行政/场所)名称",
					"className" : " text-center dt-nowrap"
				},{
					"data" : "usertypename",
					"title" : "用户类型",
					"className" : " text-center dt-nowrap"
				},{
					"data" : "enabled",
					"title" : "是否可用",
					"className" : " text-center dt-nowrap",
					"render" : function(data, type, full, meta) {
						return data == 1 ? "是" : "否";
					}
				}, {
					"data" : "locked",
					"title" : "是否锁定",
					"className" : " text-center dt-nowrap",
					"render" : function(data, type, full, meta) {
						return data == 1 ? "是" : "否";
					}
				}, {
	                "data": "",
	                "className": "text-center dt-nowrap ",
	                "width": "80px",
	                "title": "操作",
	                render: function (data, type, row, meta) {
                    return `
                        <a href="javascript:void(0)" class="btn  btn-clean " title="查看" onclick="UserList.view(${row.id})">
                          	查看
                        </a>
                        <span class="dropdown">
                            <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown" aria-expanded="true">
                                <i class="flaticon-more-1"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a class="dropdown-item" href="javascript:void(0)" onclick="UserList.edit(${row.id})"><i class="la la-edit"></i> 修改</a>
                                <a class="dropdown-item" href="javascript:void(0)" onclick="UserList.del(${row.id})"><i class="la la-trash"></i> 删除</a>
                                <a class="dropdown-item" href="javascript:void(0)" onclick="UserList.setPsd('${row.username}')"><i class="la la-key"></i> 设置密码</a>
                    			<a class="dropdown-item" href="javascript:void(0)" onclick="UserList.setRole(${row.id},${row.usertypeid},'${row.username}')"><i class="la la-user-secret"></i> 设置角色</a>
                            </div>
                        </span>`;
                },
            }]
        });
//        <a class="dropdown-item" href="javascript:void(0)" data-toggle="modal" data-target="#kt_select_modal"><i class="la la-user-secret"></i> 设置角色</a>

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
					 	url: ctx + "/admin/user/delete",
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
        check: function (arg) {
            blockUI($(window.document.body), '正在删除文件...');
            $.ajax({
                type: 'POST',
                url: ctx + "/demo",
                dataType: "json",
                data: {
                    'id': arg,
                },
                success: function (data) {
                    unblockUI($(window.document.body));
                    if (data.success) {
                        form_helpers.success(data.msg, '提示');
                        UserList.refresh();
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
        },
        edit: function (arg) {
            window.open(ctx + "/admin/user/edit?id=" + arg);
        },
        view: function (arg) {
            window.open(ctx + "/admin/user/info?id=" + arg
            )
        },
        setPsd:function(name) {
			var $modal = $('#ajax-modal-psd');
			$modal.on("hidden.bs.modal", function(e) {
				$(this).removeData();
			});
			$modal.load(ctx + "/admin/user/password", '', function() {
				$modal.modal();
				$modal.find('#username').val(name);
			});
        },
        setRole:function(id,type,name) {
			var $modal = $('#ajax-modal-role');
			$modal.on("hidden.bs.modal", function(e) {
				$(this).removeData();
			});
			
			$modal.load(ctx + "/admin/user/role?userid="+id+"&usertype="+type, '', function() {
				$modal.modal();
				$modal.find('#userid').val(id);
				$modal.find('#usertype').val(type);
				$modal.find('#username').val(name);
			});
	}
    };

}();

// Class initialization on page load
jQuery(document).ready(function () {
    UserList.init();
});