var VenueAdd = function () {
		initData= function ()  {
			
		},
		initPage= function () {

				$("#btn_close").on('click',close);
				$("#btn_reset").on('click',reset);
				
				/*var dataflag = $("#rfidreader").val();
				if(dataflag=="guyeeAccessDefaultFaceControlImplService"){
					$("#inoutflagdiv").show();
					$("#inoutflag1").attr("name","inoutflag");
					$("#inoutflag2").attr("name","inoutflag");
				}else{
					$("#inoutflagdiv").hide();
					$("#inoutflag1").attr("name","");
					$("#inoutflag2").attr("name","");
				}*/
				
				/*var dataprotocal = $("#parkdiv").val();
				if(dataprotocal=="7" || dataprotocal=="70"){
					$("#parkdiv").show();
					$("#parkid").attr("name","parkid");
				}else{
					$("#parkdiv").hide();
					$("#parkid").attr("name","");
				}*/
				
				 $('#protocal').select2({
			        	placeholder : "请选择设备类型...",
						language:'zh-CN',
						allowClear : true,
						minimumResultsForSearch: -1,
						ajax : {
							url : ctx + "/admin/box/guyeeProtocalEnum",
							dataType : 'json',
							method : 'GET',
							cache : true,
							processResults : function(data, page) {
								var result = [];
								$.each(data, function(index, val) {
									result.push({
										'id' : this.id,
										'text' : this.text 
									});
								});
								return {
									results : result
								};
							}
						}
					})/*.on("select2:select",function(){
						var data = $(this).val();
						if(data=="7" || data=="70"){
							//$("#parkdiv").show();
							$("#parkid").attr("name","parkid");
						}else{
							//$("#parkdiv").hide();
							$("#parkid").attr("name","");
							$("#parkid").select2("val", [""]);
						}
					})*/;
				 
		        $('#xmid').select2({
					placeholder : "请选择安装场所...",
					language:'zh-CN',
					allowClear : true,
					templateResult: formatRepo,
					//multiple :true,
					escapeMarkup: function(markup) {
			                return markup;
			        },
			        //templateSelection: formatRepoSelection,
					ajax : {
						url : ctx + "/admin/place/quickSearch",
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
									'desc' : this.address==null?"":this.address
								});
							});
							return {
								results : result
							};
						}
					}
				});
		        
		        $("#xmid").change(function () {
					//$("#parkid").select2("val", [""]);
					//$("#address").val($("#communityid option:selected").text());
				});

				/*$('#parkid').select2({
					placeholder : "请选择停车场...",
					language:'zh-CN',
					allowClear : true,
					minimumResultsForSearch: -1,
					ajax : {
						url : ctx + "/admin/parkinglot/list",
						dataType : 'json',
						method : 'GET',
						cache : true,
						data : function(params, page) {
							return {
								param : params.term,
								communityid : $('#xmid').val()
							};
						},
						processResults : function(data, page) {
							var result = [];
							$.each(data.data, function(index, val) {
								result.push({
									'id' : this.id,
									'text' : this.parkname
								});
							});
							return {
								results : result
							};
						}
					}
				});*/
				
				 function formatRepo(object) {
			            var markup = "<div class='select2-result-repository clearfix'>" +
		                "<div class='select2-result-repository'>" +
		                "<div class='select2-result-repository__title'>" + object.text + "</div>";
			            	markup += "<div class='select2-result-repository__statistics'>" +
		                "<div class='select2-result-repository__forks'>地址: </span> " + object.desc + " </div>" +
		                "</div>" +
		                "</div></div>";
			            return markup;
			        };
			        
			        function formatRepo2(object) {
			            var markup = "<div class='select2-result-repository clearfix'>" +
		                "<div class='select2-result-repository'>" +
		                "<div class='select2-result-repository__title'>" + object.text + "</div>";
			            	markup += "<div class='select2-result-repository__statistics'>" +
			            	"<div class='select2-result-repository__forks'>描述: </span> " + object.desc + " </div>" +
		                "</div>" +
		                "</div></div>";
			            return markup;
			        };
				  
				  function formatRepoSelection(repo) {
					  return repo.name;
			      };
			      
			      /*$('#rfidreader').select2({
				        placeholder : "请选择现场标签类型...",
						language:'zh-CN',
						allowClear : true,
						templateResult: formatRepo2,
						minimumResultsForSearch: -1,
						escapeMarkup: function(markup) {
				                return markup;
				        },
						ajax : {
							url : ctx + "/admin/box/cardType",
							dataType : 'json',
							method : 'GET',
							delay: 250,
							cache : true,
							processResults : function(data, page) {
								var result = data;
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
					}); */
			      
				form_helpers.parsley($('#form'));// 表单验证
				  $('#form').ajaxForm(
					// 表单提交
					{
						url : ctx+'/admin/box',
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
				  
				  /*$("#name").blur(function () {
					 if(!isEmpty($("#name"))){
						$("#shortname").val($("#name").val());
					 }
				 });*/
				  
				  
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

				function close() {
		    		window.close();
				};
				
				function refresh() {
					location.reload();
				};
				
				function reset() {
		    		$('#form')[0].reset();
		    		$('#xmid').val(null).trigger("change");
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