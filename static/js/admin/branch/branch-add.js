var UserAdd = function() {
	var	initPage = function() {
		$(".btn_reset").on('click',reset);
		$(".btn_close").on('click',close);

		var branchclass = $("#branchclass").val();
	      if(!isEmpty(branchclass)){
	    	  $("input[name='branchclass'][value='"+branchclass+"']").attr("checked",true); 
	      }
		
	      $('#fparentid').select2({
				placeholder : "请选择上级行政区划...",
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
		
		form_helpers.parsley($('#form'));// 表单验证
		$('#form').ajaxForm({// 表单提交
			url : ctx + "/admin/branch",
			dataType : 'json',
			type : 'POST',
			beforeSubmit : function(formData, form, options) {
				form_helpers.blockUI($('#form'));// 加载动画
			},
			error : function(data, textStatus, errorThrown) {
				form_helpers.unblockUI($('#form'));// 取消加载动画
			},
			success : function(data) {
				form_helpers.unblockUI($('#form'));
				if (data.success) {
					form_helpers.notify(data.msg, '提示','success');
				} else {
					form_helpers.info($('#alert'), "warning","warning", data.msg, 6);
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
		
		function reset() {
    		$('#form')[0].reset();
		};
		
		function close() {
    		window.close();
		};
	};
	return{
		init:function(){
			initPage.apply(this);
		}
	}

}();
jQuery(document).ready(function () {
	UserAdd.init();
})