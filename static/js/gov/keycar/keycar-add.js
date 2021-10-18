var keycar = function () {
		initPage= function () {
			  	var $form = $('#form');		

				$("#btn_close").on('click',close);
				$("#btn_reset").on('click',reset);
				
				/*function loadTag(){
					$.ajax({
						type : "GET",
						url : ctx + "/gov/tag/list",
						success : function(data) {
							var parsedWordArray = CryptoJS.enc.Base64.parse(data.data);
		                	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
		                	var st=JSON.parse(msg);
							
							var tag_template = Handlebars.compile($("#tag_template").html());
				    		var tag_html=tag_template(st);
			    			$('#taglist').append(tag_html);
			    			
			    			var initTags = $("#tags").val().split(",");
			    			if(!isEmpty(initTags)){
			    				$.each(initTags, function (index, item) {
				    				$('#'+item).attr("checked","checked");
		    					});
			    			}
						},
						error : function(data) {
						},
						complete : function(XHR, TS) {
							XHR = null;
						}
					});
				}
				loadTag();*/
				
				if(!isEmpty($("#plate"))){
					 var words = CryptoJS.enc.Utf8.parse($("#plate").val());
	                 var hidden_plate = CryptoJS.enc.Base64.stringify(words);
					$("#hidden_plate").val(hidden_plate);
				 }
				
				$("#plate").blur(function () {
					 if(!isEmpty($("#plate"))){
						 var words = CryptoJS.enc.Utf8.parse($("#plate").val());
		                 var hidden_plate = CryptoJS.enc.Base64.stringify(words);
						$("#hidden_plate").val(hidden_plate);
					 }
				 });
				
				if(!isEmpty($("#memo"))){
					 var words = CryptoJS.enc.Utf8.parse($("#memo").val());
	                 var hidden_memo = CryptoJS.enc.Base64.stringify(words);
					$("#hidden_memo").val(hidden_memo);
				 }
				
				$("#memo").blur(function () {
					 if(!isEmpty($("#memo"))){
						 var words = CryptoJS.enc.Utf8.parse($("#memo").val());
		                 var hidden_memo = CryptoJS.enc.Base64.stringify(words);
						$("#hidden_memo").val(hidden_memo);
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
				};
			      
				form_helpers.parsley($('#form'));/*表单验证*/
				  $('#form').ajaxForm(
					{
						url : ctx+'/gov/keycar',
						dataType : 'json',
						type : 'POST',
						beforeSubmit : function(formData, form, options) {
							form_helpers.blockUI($('#form'));/*加载动画*/
						},
						error : function(data, textStatus, errorThrown) {
							form_helpers.unblockUI($('#form'));/*取消加载动画*/
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
		    		/*$("#dispimg1").attr("src",ctx+"/static/image/noimg.jpg");
		    		$("#dispimg2").attr("src",ctx+"/static/image/noimg.jpg");
		    		$("#dispimg3").attr("src",ctx+"/static/image/noimg.jpg");*/
				};
		}

    return {
        init: function () {
            initPage();
        }
    };
}();
jQuery(document).ready(function () {
    keycar.init();
});