"use strict";
/* Class definition*/ 
var warning = function () {

    var initPage = function (that) {
    	
    	$('#wx_login').click(function(){
    		$('#wx_login_div').hide();
    		$('#pc_login_div').show();
    		
    		$('#pc_login_form').hide();
    		$('#wx_login_form').show();
    	});
    	
    	$('#pc_login').click(function(){
    		$('#wx_login_div').show();
    		$('#pc_login_div').hide();
    		
    		$('#pc_login_form').show();
    		$('#wx_login_form').hide();
    	});
    	
    	/** 动态生成二维码 **/
    	/*function qrcode(){
    		$.ajax({  
        		type: 'get',  
        		dataType: 'text',  
        		url :  ctx+'/eauth/qrcode', 
        		success : function(arrays){
        			
        		}
        	});
    	}*/
    	
    	var client;
        function initWs(){
        	 if(window.WebSocket) {
      			var url =  "ws://sctel-acs.iguyee.cn:1886/stomp";
      			var url3 =  "ws://192.168.1.213:61614/stomp";
      			client = Stomp.client(url);
      			client.debug = null;
      			client.heartbeat.outgoing = 0; 
      			client.heartbeat.incoming = 10000;
     	        client.connect("","",connectCallback,errorCallback);
             }
        }
        initWs();
        
        function connectCallback (frame) {
        	var src = $('#qrcode').attr('src');
        	var state = src.split("code=")[1];
        	/*var state = $('#qrcode').val(); */
        	var topic = "/topic/qrcode_login_"+state;
			client.subscribe(topic, handleMq);
		};
        
        function errorCallback(){
			setTimeout(function() {
				initWs();
			}, 5000);
		};
		
		function handleMq(message){
        	var parsedWordArray = CryptoJS.enc.Base64.parse(message.body);
        	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
        	var jo=JSON.parse(msg);
        	var openid = jo.openid;
        	var success = jo.success;
        	if(success){
        		$.ajax({  
            		type: 'get',  
            		dataType: 'text',  
            		url :  ctx+'/eauth/qrcode/login?openid='+openid, 
            		success : function(result){
            			var data=JSON.parse(result);
            			if (data.success) {
            				window.location.href=ctx+"/"+data.data;
            				//window.open(ctx +"/"+data.data);/**浏览器会进行重定向的拦截**/
						} else {
							console.info("登录失败："+data.msg);
						}
            		}
            	});
        	}else{
        		console.info("账号未绑定,请输入账号密码登录后进行绑定");
        		
        		/*form_helpers.parsley($('#kt_login_form'));表单验证
        		form_helpers.notify("账号未绑定,请输入账号密码登录后进行绑定", "提示信息", "warning");*/
        		
        		/*$('#pc_login_form').hide();
        		$('#wx_login_form').hide();
        		$('#wx_bind_form').show();
        		
        		//post 方法,输入账号密码,提交到后台,后台完成登录和绑定
        		//页面提示绑定成功
        		$('#wx_bind_openid').val(openid);
        		
				  $('#wxbindform').ajaxForm({
						url : ctx+'/eauth/qrcode',
						dataType : 'json',
						type : 'POST',
						beforeSubmit : function(formData, form, options) {
							form_helpers.blockUI($('#wxbindform'));加载动画
						},
						error : function(data, textStatus, errorThrown) {
							form_helpers.unblockUI($('#wxbindform'));取消加载动画
						},
						success : function(data) {
							if (data.success) {
								form_helpers.unblockUI($('#wxbindform'));
								form_helpers.notify(data.msg, "提示信息", "success");
							} else {
								form_helpers.unblockUI($('#form'));
								form_helpers.info($('#wx_bind_alert'), "warning", "warning", data.msg, 6);
							}
						}
					});	*/
        	}
        	
		}
    	
    };

    return {
        init: function () {
            initPage.apply(this);
        }
    };

}();

jQuery(document).ready(function () {
    warning.init();
});