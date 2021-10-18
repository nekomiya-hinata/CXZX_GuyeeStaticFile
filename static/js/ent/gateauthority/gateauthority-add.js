var UserAdd = function () {
		initData= function ()  {
			
		},
		initPage= function () {
				
				$("#btn_close").on('click',close);
				$("#btn_reset").on('click',reset);
				
				$('.btn_save').on('click', function() {
					$('#form').submit();
				});
				
				form_helpers.parsley($('#form')); // 表单验证
				
				$('#rytrain').select2({
					placeholder : "根据姓名搜索.........",
					language:'zh-CN',
					allowClear : true,
					minimumInputLength:1,
					multiple :true,
					ajax : {
						url : ctx + "/ent/staff/list",
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
								if(this.idcode==null || this.idcode == ''){
									result.push({
										'id' : this.massid,'text' : this.name
									});
								}else{
									result.push({
										'id' : this.massid,'text' : this.name + "("+ this.idcode.replace(/(\d{3})\d{11}(.{4})/, '$1**********$2') + ")"
									});
								}
							});
							return {
								results : result
							};
						}
					}
				});
				
				function getCommunityAllGate(){
					$.ajax({
						url:ctx+'/ent/gate/list',
						type: "GET",		 
						dataType:'json',
						data:{
						},
						success:function(data, status, xhr){
							    if(data.data){
							    	var template = Handlebars.compile($("#template-manager").html());
									$('#checkbox').append(template(data.data));

						 	     }
						}
					});
				}
				getCommunityAllGate();
				
				$('#form').ajaxForm({
					type : 'post',
					url : ctx + '/ent/gateauthority/saveAuthoritys',
					dataType : 'json',
					async : true,
					beforeSubmit : function(formData, form, options) {
						form_helpers.blockUI(form);
					},
					success : function(data) {
						form_helpers.unblockUI($('#form'));
						if (data.success) {
							form_helpers.info($('#alert'), "success","check", data.msg, 6)
						} else {
							form_helpers.info($('#alert'), "warning","warning", data.msg, 6);
						}
					},
					error : function(data) {
						form_helpers.unblockUI($('#form'));
						form_helpers.notify('数据提交失败，请检查网络是否畅通!', "提示");
					},
					complete : function(XHR, TS) {
						XHR = null
					}
				});

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
    	                url: ctx + "/admin/user/delete",
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
    UserAdd.init();
});