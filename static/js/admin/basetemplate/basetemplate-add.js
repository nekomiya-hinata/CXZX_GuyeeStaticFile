var VenueAdd = function () {
		initData= function ()  {
			
		},
		initPage= function () {
			  	var $form = $('#form');		

				$("#btn_close").on('click',close);
				$("#btn_reset").on('click',reset);
				
				var templatetype = $("#templatetype").val();
			      if(!isEmpty(templatetype)){
			    	  $("input[name='templatetype'][value='"+templatetype+"']").attr("checked",true); 
			      }
			      
				form_helpers.parsley($('#form'));// 表单验证
				  $('#form').ajaxForm(
					// 表单提交
					{
						url : ctx+'/admin/basetemplate',
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
				
				function refresh() {
					location.reload();
				};
				
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
				
				function reset() {
		    		$('#form')[0].reset();
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
    VenueAdd.init();
});