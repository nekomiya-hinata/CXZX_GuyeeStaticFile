var VenueAdd = function () {
		initData= function ()  {
			
		},
		initPage= function () {

				$("#btn_close").on('click',close);
				$("#btn_reset").on('click',reset);
			      
				form_helpers.parsley($('#form'));// 表单验证
				  $('#form').ajaxForm(
					// 表单提交
					{
						url : ctx + "/admin/guyeecarpassageway/saveWay",
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

				function close() {
		    		window.close();
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
    };
}();

// Class initialization on page load
jQuery(document).ready(function () {
    VenueAdd.init();
});