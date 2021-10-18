var VenueAdd = function () {
		initData= function ()  {
			
		},
		initPage= function () {
			  	var $form = $('#form');		

				$("#btn_close").on('click',close);
				$("#btn_reset").on('click',reset);
				
				 $("#files").change(function(){
					    $("#dispimg").attr("src",URL.createObjectURL($(this)[0].files[0]));
					});
				
				var type = $("#type").val();
			      if(!isEmpty(type)){
			    	  $("input[name='type'][value='"+type+"']").attr("checked",true); 
			      }
				
				 function formatRepo(repo) {
			            var markup = "<div class='select2-result-repository clearfix'>" +
		                "<div class='select2-result-repository'>" +
		                "<div class='select2-result-repository__title'>" + repo.text + "</div>";
			            	markup += "<div class='select2-result-repository__statistics'>" +
		                "<div class='select2-result-repository__forks'></span></div>" +
		                "</div>" +
		                "</div></div>";
			            return markup;
			        };
				  
				 
				  function formatRepoSelection(repo) {
					  return repo.name;
			      };
			      
			      $('#branchid').select2({
						placeholder : "请选择行政区划...",
						language:'zh-CN',
						allowClear : true,
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
			      
			      $('#pkid').select2({
						placeholder : "请选择公共重点人员库...",
						language:'zh-CN',
						allowClear : true,
						templateResult: formatRepo,
						escapeMarkup: function(markup) {
				                return markup;
				        },
						ajax : {
							url : ctx + "/admin/library/list?search_EQ_type=2&search_ISNULL_placeid=0",
							dataType : 'json',
							method : 'GET',
							delay: 250,
							cache : true,
							data : function(params){
			                    return {
			                    	search_LIKE_name : params.term,
			                    }
			                },
							processResults : function(data, page) {
								var result = [];
								$.each(data.data, function(index, val) {
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
					});
			      
			      $('#psid').select2({
						placeholder : "请选择聚类人员库...",
						language:'zh-CN',
						allowClear : true,
						templateResult: formatRepo,
						escapeMarkup: function(markup) {
				                return markup;
				        },
						ajax : {
							url : ctx + "/admin/library/list?search_EQ_type=8&search_ISNULL_placeid=0",
							dataType : 'json',
							method : 'GET',
							delay: 250,
							cache : true,
							data : function(params){
			                    return {
			                    	search_LIKE_name : params.term,
			                    }
			                },
							processResults : function(data, page) {
								var result = [];
								$.each(data.data, function(index, val) {
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
					});
			      
			      $('#tempid').select2({
						placeholder : "请选择临控人员库...",
						language:'zh-CN',
						allowClear : true,
						templateResult: formatRepo,
						escapeMarkup: function(markup) {
				                return markup;
				        },
						ajax : {
							url : ctx + "/admin/library/list?search_EQ_type=1&search_ISNULL_placeid=0",
							dataType : 'json',
							method : 'GET',
							delay: 250,
							cache : true,
							data : function(params){
			                    return {
			                    	search_LIKE_name : params.term,
			                    }
			                },
							processResults : function(data, page) {
								var result = [];
								$.each(data.data, function(index, val) {
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
					});
			      
			      $('#csid').select2({
						placeholder : "请选择场所人员库...",
						language:'zh-CN',
						allowClear : true,
						templateResult: formatRepo,
						escapeMarkup: function(markup) {
				                return markup;
				        },
						ajax : {
							url : ctx + "/admin/library/list?search_EQ_type=4&search_ISNOTNULL_placeid=0",
							dataType : 'json',
							method : 'GET',
							delay: 250,
							cache : true,
							data : function(params){
			                    return {
			                    	search_LIKE_name : params.term,
			                    }
			                },
							processResults : function(data, page) {
								var result = [];
								$.each(data.data, function(index, val) {
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
					});
			      
			      $('#prkid').select2({
						placeholder : "请选择私有重点人员库...",
						language:'zh-CN',
						allowClear : true,
						templateResult: formatRepo,
						escapeMarkup: function(markup) {
				                return markup;
				        },
						ajax : {
							url : ctx + "/admin/library/list?search_EQ_type=2&search_ISNOTNULL_placeid=0",
							dataType : 'json',
							method : 'GET',
							delay: 250,
							cache : true,
							data : function(params){
			                    return {
			                    	search_LIKE_name : params.term,
			                    }
			                },
							processResults : function(data, page) {
								var result = [];
								$.each(data.data, function(index, val) {
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
					});
			      
			      
			      
				form_helpers.parsley($('#form'));// 表单验证
				  $('#form').ajaxForm(
					// 表单提交
					{
						url : ctx+'/admin/place',
						dataType : 'json',
						type : 'POST',
						/*contentType:"multipart/form-data;charset=utf-8",*/
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