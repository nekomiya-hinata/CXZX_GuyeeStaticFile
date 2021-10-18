var VenueAdd = function () {
		initData= function ()  {
			
		},
		initPage= function () {
			  	var $form = $('#form');		

				$("#btn_close").on('click',close);
				$("#btn_reset").on('click',reset);
				  
				var type = $("#type").val();
			      if(!isEmpty(type)){
			    	  $("input[name='type'][value='"+type+"']").attr("checked",true); 
			      }
			      
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
			      
		        $('#branchid').select2({
					placeholder : "请选择监管单位...",
					language:'zh-CN',
					allowClear : true,
					/*minimumInputLength:1,*/
					ajax : {
						url : ctx + "/admin/branch/quickSearch",
						dataType : 'json',
						method : 'GET',
						delay: 250,
						data : function(params){
		                    return {
		                    	search_LIKE_name : params.term,
		                    }
		                },
						cache : true,
						processResults : function(data, page) {
							var result = [];
							$.each(data.data, function(index, val) {
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
				});
		        
		        /*$('#xmid').select2({
					placeholder : "请选择场所...",
					language:'zh-CN',
					allowClear : true,
					templateResult: formatRepo,
					escapeMarkup: function(markup) {
			                return markup;
			        },
					ajax : {
						url : ctx + "/admin/place/quickSearch",
						dataType : 'json',
						method : 'GET',
						delay: 250,
						data : function(params){
		                    return {
		                    	search_LIKE_name : params.term,
		                    }
		                },
						cache : true,
						processResults : function(data, page) {
							var result = [];
							$.each(data.data, function(index, val) {
								result.push({
									'id' : this.id,
									'text' : this.name,
									'desc' : this.address==null?"":this.address
								});
							});
							return {
								results : result
							};
						}
					}
				});*/
			      
				form_helpers.parsley($('#form'));// 表单验证
				  $('#form').ajaxForm(
					// 表单提交
					{
						url : ctx+'/admin/library',
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
				  
			  $("#name").blur(function () {
					 if(!isEmpty($("#name"))){
						$("#shortname").val($("#name").val());
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
    	                url: ctx + "/admin/linkman/delete",
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
    VenueAdd.init();
});