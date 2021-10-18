var UIConfig = function() {
	return {
		initData : function() {
		},
		initPage : function() {
		
			$(".btn_close").on('click',close);
			
			$(".btn_down").on('click',down);
			
			form_helpers.parsley($('#form'));// 表单验证
			$('#form').ajaxForm(
					// 表单提交
					{
						url : ctx + "/admin/gate/saveUIConfig",
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
			
			
			function down(){
				form_helpers.confirm('确认下发?', function(result) {
					if (result.value == true) {
						form_helpers.blockUI($(document.body));
						$.ajax({
							type : "post",
							url : ctx + '/admin/gate/busiConfig',
							data : {
								'boxid' : $("#boxid").val()
							},
							success : function(data) {
								form_helpers.unblockUI($(document.body));
								if (data.success) {
									form_helpers.notify(data.msg, '提示',
											'success');
								} else {
									form_helpers.notify(data.msg, '提示',
											'error');
								}
							},
							error : function(data) {
								form_helpers.unblockUI($(document.body));
								form_helpers.notify('数据获取失败，请检查网络是否畅通!',
										"提示", "error");
							},
							complete : function(XHR, TS) {
								XHR = null
							}
						});
					}
				});
			};
			
			
			function close() {
	    		window.close();
			};
			
			
		}
	}

}();                                                    