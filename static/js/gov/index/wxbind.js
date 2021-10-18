"use strict";
var track = function () {

    var initPage = function (that) {
        
        $('#user_wx').click(function(){
        	var html = ""/*<p style='color: red;font-size: 18px;'>打开微信扫一扫</p>*/
			+"<img src='"+ctx+"/eauth/qrcode?code=register_"+$('#qrcode').val()+"'> ";
			Swal.fire({
				title:"绑定微信",
				html:html,
				background:"#fff",/*背景框颜色*/
				timer:120e3,/*自动关闭对话框的定时器，单位毫秒。*/
				showConfirmButton: false,
				showCancelButton: true,
				cancelButtonColor: "#DD6B55",
				cancelButtonText: "取消",
			}).then(function(e){
				if(e.value){
					Swal.fire({
						title:"处理结果",
						text:"预警信息已通过短信形式通知到相关责任人",
						type:"success",
						confirmButtonText:"确定",
						closeOnConfirm:false
					});
				}else{
					"timer"===e.dismiss&&console.log("I was closed by the timer");
				};
			});
    	});
        
        var wxclient;
        function initwxWs(){
        	 if(window.WebSocket) {
      			var url =  "wss://small.nekomiya-sama.top:1886/stomp";
      			var url3 =  "ws://192.168.1.213:61614/stomp";
      			wxclient = Stomp.client(url);
      			wxclient.debug = null;
      			wxclient.heartbeat.outgoing = 0; 
      			wxclient.heartbeat.incoming = 10000;
      			wxclient.connect("","",wxconnectCallback,wxerrorCallback);
             }
        }
        initwxWs();
        
        function wxconnectCallback (frame) {
        	var state = $('#qrcode').val();
        	var topic = "/topic/qrcode_login_register_"+state;
        	wxclient.subscribe(topic, wxhandleMq);
		};
        
        function wxerrorCallback(){
			setTimeout(function() {
				initwxWs();
			}, 5000);
		};
		
		function wxhandleMq(message){
        	var parsedWordArray = CryptoJS.enc.Base64.parse(message.body);
        	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
        	var jo=JSON.parse(msg);
        	var openid = jo.openid;
        	var success = jo.success;
        	
        	$.ajax({  
        		type: 'get',  
        		dataType: 'text',  
        		url :  ctx+'/eauth/qrcode/bindsave?openid='+openid, 
        		success : function(result){
        			var data=JSON.parse(result);
        			if (data.success) {
        				Swal.fire({
    						title:"绑定结果",
    						text:"当前账号已成功绑定微信",
    						type:"success",
    						confirmButtonText:"确定",
    						closeOnConfirm:false
    					});
					} else {
						Swal.fire({
							title:"绑定结果",
							text:data.data,
							type:"warning",
							confirmButtonText:"确定",
							closeOnConfirm:false
						});
					}
        		}
        	});
        	
		}
    	
    };

    return {
        init: function () {
            initPage.apply(this);
        }
    };
}();

jQuery(document).ready(function () {
    track.init();
});
