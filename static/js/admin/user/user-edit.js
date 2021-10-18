var UserEdit = function () {
		initData= function ()  {
			
		},
		initPage= function () {
			  	var $form = $('#form');		

				$("#btn_close").on('click',close);
			      
			      form_helpers.parsley($('#form'));// 表单验证
				  $('#form').ajaxForm(
					// 表单提交
					{
						url : ctx+'/admin/user',
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
				  
					$('input[type="radio"]').iCheck({
						radioClass : 'iradio_minimal',
						increaseArea : '20%' // optional
					});
				  
				  

				function close() {
		    		window.close();
				};
				
				function refresh() {
					location.reload();
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
    UserEdit.init();
});