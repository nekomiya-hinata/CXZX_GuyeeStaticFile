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
        	 window.open(ctx + "/admin/place/add");
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
      
        $('#type').select2({
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
				url : ctx + "/admin/place/enumPlaceType",
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
                "url": ctx + "/admin/place/quickSearch",
                "type": "GET",
                "data": function (params) {
                    params.search_LIKE_name = $("#param").val();
                	params.search_LIKE_clientPlaceid = $("#clientPlaceid").val();
                	params.search_EQ_address = $("#address").val();
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
            },{
                "data": "id",
                "title": "唯一标识",
                "className": " text-center dt-nowrap"
            }, {
                "data": "name",
                "title": "场所名称",
                "className": " text-center dt-nowrap"
            }, {
                "data": "photourl",
                "title": "图片",
                "className": " text-center dt-nowrap",
                "mRender": function ( data, type, row, meta) {
                	 if(!isEmpty(row.photourl)){
                		return '<img src='+urlFormat(row.photourl,60,60)+'>';
                	}else{
                		return '';
                	}
	        		
				}
            },{
                "data": "clientPlaceid",
                "title": "关联场所ID",
                "className": "text-center dt-nowrap"
            },  {
                "data": "placetypename",
                "title": "场所类型",
                "className": "text-center dt-nowrap"
            }, {
                "data": "branchname",
                "title": "行政区划",
                "className": "text-center dt-nowrap"
            }, {
                "data": "useflagname",
                "title": "是否启用",
                "className": "text-center dt-nowrap"
            }, {
                "data": "address",
                "title": "地址",
                "className": "text-center dt-nowrap"
            },  {
                "data": "createdDate",
                "title": "创建时间",
                "className": " text-center dt-nowrap"
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
                            	<a class="dropdown-item" href="javascript:void(0)" onclick="DemoList.rawdata(${row.id})"><i class="la la-list-alt"></i> 查看场所设备</a>
                                <a class="dropdown-item" href="javascript:void(0)" onclick="DemoList.edit(${row.id})"><i class="la la-edit"></i> 修改</a>
                                <a class="dropdown-item" href="javascript:void(0)" onclick="DemoList.del(${row.id})"><i class="la la-trash"></i> 删除</a>
                                <a class="dropdown-item" href="javascript:void(0)" onclick="DemoList.config(${row.id})"><i class="la la-list-alt"></i> 配置场所插件</a>
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
					 	url: ctx + "/admin/place/delete",
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
            window.open(ctx + "/admin/place/edit?id=" + arg);
        },
        view: function (arg) {
            window.open(ctx + "/admin/place/info?id=" + arg);
        },
        rawdata : function (arg) {
        	 window.open(ctx + "/admin/place/venuerawdata?id=" + arg);
        },
        config : function (arg) {
       	 window.open(ctx + "/admin/placeconfig?placeid=" + arg);
       }
    };

}();

// Class initialization on page load
jQuery(document).ready(function () {
    DemoList.init();
});