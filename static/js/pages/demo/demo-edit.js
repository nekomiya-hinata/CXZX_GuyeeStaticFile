var DemoEdit = function () {
		initData= function ()  {
			
		},
		initPage= function () {
			  	var $form = $('#form');		
			  	

				$("#btn_close").on('click',close);
				
			  	
			  	form_helpers.parsley($form);
			  	 
				$('#form').ajaxForm({
				    url:ctx+'/demo',
				    dataType:'json',
				    type:'POST',
				    beforeSubmit:function(formData, form, options){
				    	form_helpers.confirm('是否确认删除',function(result){
				    		alert(result);
				    	});
				    	form_helpers.blockUI($(form));
				    },
				    error: function (data, textStatus, errorThrown,form){
				    	form_helpers.unblockUI($("#form"));
						form_helpers.error('数据提交失败，请检查网络是否畅通!', $(form));
				    },
				    success: function(data,status,xhr,form) {
				    	form_helpers.unblockUI($(form));
						if (data.success) {
							form_helpers.success(data.msg,'提示');
						} else {
							form_helpers.error(data.msg, $(this.form));
						}
				    }
				});	
				
				

				function close() {
		    		window.close();
				};
		       

		}

    return {
        init: function () {
            initPage();
            initData();
        }
    };
}();

// Class initialization on page load
jQuery(document).ready(function () {
    DemoEdit.init();
});