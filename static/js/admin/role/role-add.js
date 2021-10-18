var RoleAdd = function () {
		initData= function ()  {
			
		},
		initPage= function () {
			  	var $form = $('#form');		

				$("#btn_close").on('click',close);
				$("#btn_reset").on('click',reset);
				
		        $('#usertype').select2({
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
									'desc':this.desc
								});
							});
							return {
								results : result
							};
						}
					}
				})
				
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
			      
			      form_helpers.parsley($('#form'));// 表单验证
				  $('#form').ajaxForm(
					// 表单提交
					{
						url : ctx+'/admin/role',
						dataType : 'json',
						type : 'POST',
						beforeSubmit : function(formData, form, options) {
							form_helpers.blockUI($('#form'));// 加载动画
						},
						error : function(data, textStatus, errorThrown) {
							form_helpers.unblockUI($('#form'));// 取消加载动画

						},
						success : function(data) {
							if (data.success) {
								form_helpers.unblockUI($('#form'));
								form_helpers.notify(data.msg, "提示信息", "success");
							} else {
								form_helpers.unblockUI($('#form'));
								form_helpers.info($('#alert'), "warning", "warning", data.msg, 6);
							}

						}
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

				function close() {
		    		window.close();
				};
				
				function refresh() {
					location.reload();
				};
				
				function reset() {
		    		$('#form')[0].reset();
				};
		}

    return {
        init: function () {
            initPage();
            initData();
        },
        del: function (arg) {
    		form_helpers.confirm('确定删除?', function(result) {
    			if (result.value == true) {
    	            blockUI($(window.document.body), '正在删除文件...');
    	            $.ajax({
    	                type: 'POST',
    	                url: ctx + "/admin/role/delete",
    	                dataType: "json",
    	                data: {
    	                    'id': arg,
    	                },
    	                success: function (data) {
    	                    unblockUI($(window.document.body));
    	                    if (data.success) {
    	                        form_helpers.success(data.msg, '提示');
    	                        location.reload() 
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
    RoleAdd.init();
});