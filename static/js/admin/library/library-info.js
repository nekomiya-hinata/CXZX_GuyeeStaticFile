"use strict";
// Class definition
var VenueInfo = function () {

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
        
      //注册handlebars模板
		var template = Handlebars.compile($("#template-manager").html());
		this.datatable = $('#table').dataTable({
				"serverSide" : true,
				"language" : {"url" : ctx+ "/static/resource/dataTables.zh_CN.txt"},
				"ajax" : {
					"url" : ctx + "/admin/rawdata/quickSearch",
					"type" : "GET",
					"data" : function(params) {
						params.search_EQ_venueid = $("#id").val();
						return params;
					}
				},
				"createdRow":function(row,data,index){
	                if (data.status==1 ) {//历史住户
	                	$('td',row).css('color','red');
	                }
	           },
	           "fnDrawCallback" : function() {
					this.api().column(0).nodes().each(
							function(cell, i) {
								cell.innerHTML = i + 1;
					});
					
					//将数据封装成json对象
					 var array=[];
					 this.api().data().each( function (d) {
				  		array.push(d);
				  	  });
					 //将json对象用刚刚注册的Handlebars模板封装，得到最终的html，插入到table中。
				    $('#managerlist').html(template(array));
					$('#table').parent().hide();
					$('#table').parent().prev().hide();
					
				},
				"columns" : [{
					"data" : null,
					"title" : "序号",
					"width" : "30px",
					"className" : "text-center dt-nowrap"
				}]
			});
		
		Handlebars.registerHelper('dataType', function(object) { 
			if (object == 1){
				 return '人脸识别(图片)';
			}else if(object == 2){
				return '陌生人脸(图片)';
			}else{
				 return '车牌识别(图片)';
			}
		});
		
		Handlebars.registerHelper('lookpicture', function(object) { 
			window.open(object);
		});
		
		
        function edit(){
        	 window.open(ctx + "/admin/venue/edit?id=" + $("#id").val());
        }
        
        function query() {
            VenueInfo.refresh();
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
        del: function (arg) {
		form_helpers.confirm('确定删除?', function(result) {
			if (result.value == true) {
	            blockUI($(window.document.body), '正在删除文件...');
	            $.ajax({
	                type: 'POST',
	                url: ctx + "/admin/linkman/delete",
	                dataType: "json",
	                data: {
	                    'id': arg,
	                },
	                success: function (data) {
	                    unblockUI($(window.document.body));
	                    if (data.success) {
	                        form_helpers.success(data.msg, '提示');
	                        VenueInfo.refresh();
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
    VenueInfo.init();
});