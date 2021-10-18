var UserAdd = function() {
	var	initPage = function() {
		$(".btn_reset").on('click',reset);
		$(".btn_close").on('click',close);
		
		/*var url = "";
		if($('#usertypeid').val()==1){//政府用户(大数据展示端)
			url = ctx + "/admin/branch/list";
		}else if($('#usertypeid').val()==2){//社区端 人员审核
			url = ctx + "/admin/branch/list";
		}else{//物业端
			url = ctx + "/admin/community/quickSearch";
		}*/

		var usertypeid = $("#usertypeid").val();
	      if(!isEmpty(usertypeid)){
	    	  $("input[name='usertype.id'][value='"+usertypeid+"']").attr("checked",true); 
	      }
		
		$('#branchid').select2({
			placeholder : "请选择行政区划...",
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
		
		$("#branchid").change(function () {
			//$("#parkid").select2("val", [""]);
			//$("#address").val($("#communityid option:selected").text());
			$("#orgname").val($("#branchid option:selected").text());
		});
		
		$('#placeid').select2({
			placeholder : "请选择场所...",
			language:'zh-CN',
			allowClear : true,
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
						});
					});
					return {
						results : result
					};
				}
			}
		});
		
		$("#placeid").change(function () {
			$("#orgname").val($("#placeid option:selected").text());
		});
		
		/*$("#branchid").blur(function () {
			 if(!isEmpty($("#orgname"))){
				$("#orgname").val($("#name").val());
			 }
		 });*/
		
		
		/*$('#orgid').select2({
			placeholder : "请选择...",
			language:'zh-CN',
			allowClear : true,
			//multiple :true,
			ajax : {
				url : ctx + "/admin/branch/list",
				dataType : 'json',
				method : 'GET',
				data : function(params, page) {
					return {
						param: params.term
					};
				},
				cache : true,
				processResults : function(data, page) {
					var result = [];
					$.each(data.data, function(index, val) {
						result.push({
							'id' : this.id,'text' : this.name 
						});
					});
					return {
						results : result
					};
				}
			}
		});*/
		
		form_helpers.parsley($('#form'));// 表单验证
		$('#form').ajaxForm(
				// 表单提交
				{
					url : ctx + "/admin/user",
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
							form_helpers.notify(data.msg, '提示',
								'success');
						} else {
							form_helpers.info($('#alert'), "warning",
									"warning", data.msg, 6);
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