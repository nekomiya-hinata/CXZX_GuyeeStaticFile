var VenueAdd = function () {
		initData= function ()  {
			
		},
		initPage= function () {
			  	var $form = $('#form');		

				$("#btn_close").on('click',close);
				$("#btn_reset").on('click',reset);
		        
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
				
		        $('#libraryidd').select2({
					placeholder : "请选择子重点人员库...",
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
			      
				form_helpers.parsley($('#form'));// 表单验证
				  $('#form').ajaxForm(
					// 表单提交
					{
						url : ctx+'/admin/libraryrelation',
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