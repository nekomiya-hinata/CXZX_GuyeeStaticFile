var VenueAdd = function () {
		initData= function ()  {
			
		},
		initPage= function () {

				$("#btn_close").on('click',close);
				$("#btn_reset").on('click',reset);
				
				var dataflag = $("#rfidreader").val();
				if(dataflag=="guyeeAccessDefaultFaceControlImplService"){
					$("#inoutflagdiv").show();
					$("#inoutflag1").attr("name","inoutflag");
					$("#inoutflag2").attr("name","inoutflag");
				}else{
					$("#inoutflagdiv").hide();
					$("#inoutflag1").attr("name","");
					$("#inoutflag2").attr("name","");
				}
				
				$('#rfidreader').select2({
					placeholder : "请选择现场标签类型...",
					language:'zh-CN',
					allowClear : true,
					templateResult: formatRepo,
					minimumInputLength:0,
					//multiple :true,
					escapeMarkup: function(markup) {
			           return markup;
			        },
					ajax : {
						url : ctx + "/admin/box/cardType",
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
							$.each(data, function(index, val) {
								result.push({
									'id' : this.id,
									'text' : this.text,
									'desc' : this.desc
								});
							});
							return {
								results : result
							};
						}
					}
				}).on("select2:select",function(){
					var data = $(this).val();
					if(data=="guyeeAccessDefaultFaceControlImplService"){
						$("#inoutflagdiv").show();
						$("#inoutflag1").attr("name","inoutflag");
						$("#inoutflag2").attr("name","inoutflag");
					}else{
						$("#inoutflagdiv").hide();
						$("#inoutflag1").attr("name","");
						$("#inoutflag2").attr("name","");
					}
				}); 
				
				function formatRepo(object) {
		            var markup = "<div class='select2-result-repository clearfix'>" +
	                "<div class='select2-result-repository'>" +
	                "<div class='select2-result-repository__title'>" + object.text + "</div>";
		            	markup += "<div class='select2-result-repository__statistics'>" +
	                "<div class='select2-result-repository__forks'>备注: </span> " + object.desc + " </div>" +
	                "</div>" +
	                "</div></div>";
		            return markup;
		        };
			      
				form_helpers.parsley($('#form'));// 表单验证
				  $('#form').ajaxForm(
					// 表单提交
					{
						url : ctx + "/admin/gate/saveWay",
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
		    		$("#rfidreader").select2("val", [""]);
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