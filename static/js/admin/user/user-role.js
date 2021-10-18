var UserRole = function () {
	initData= function ()  {
		
	},
	initPage= function () {
		      form_helpers.parsley($('#form'));// 表单验证
			  $('#form').ajaxForm(
				// 表单提交
				{
					url : ctx+'/admin/user/role',
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
	}

return {
    init: function () {
        initPage();
        initData();
    },
};
}();

//Class initialization on page load
jQuery(document).ready(function () {
UserRole.init();
});