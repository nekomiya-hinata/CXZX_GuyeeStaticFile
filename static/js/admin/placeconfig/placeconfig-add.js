var UserAdd = function() {
	var	initPage = function() {
		$(".btn_reset").on('click',reset);
		$(".btn_close").on('click',close);
		
		function formatRepo(repo) {
            var markup = "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository'>" +
            "<div class='select2-result-repository__title'>" + repo.text + "</div>";
            	markup += "<div class='select2-result-repository__statistics'>" +
            "<div class='select2-result-repository__forks'>" + repo.desc + "</span></div>" +
            "</div>" +
            "</div></div>";
            return markup;
        };
        
        function formatRepoSelection(repo) {
        	return repo.name;
        };
        
        $('#templateid').select2({
			placeholder : "请选择插件...",
			language:'zh-CN',
			allowClear : true,
			templateResult: formatRepo,
			escapeMarkup: function(markup) {
	                return markup;
	        },
			ajax : {
				url : ctx + "/admin/basetemplate/list",
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
							'text' : this.templatename,
							'desc':this.description
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
			url : ctx + "/admin/placeconfig",
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