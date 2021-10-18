"use strict";
/* Class definition*/ 
var warning = function () {

    var initPage = function (that) {
        
        /*if (!!window.WebSocket && window.WebSocket.prototype.send){
        	alert("您的浏览器支持Websocket通信协议");
        }else{
        	alert("您的浏览器不支持Websocket通信协议，请使用Chrome或者Firefox浏览器！")
        }*/
    	
    	/*<!--  
	        The transport connectors expose ActiveMQ over a given protocol to  
	        clients and other brokers. For more information, see:  
	
	        http://activemq.apache.org/configuring-transports.html  
	    -->  
	    <transportConnectors>  
	        <!-- Create a TCP transport that is advertised on via an IP multicast  
	          group named default. -->  
	        <transportConnector name="openwire" uri="tcp://localhost:61616" discoveryUri="multicast://default"/>  
	        <!-- Create a SSL transport. Make sure to configure the SSL options  
	          via the system properties or the sslContext element. -->  
	        <transportConnector name="ssl" uri="ssl://localhost:61617"/>  
	        <!-- Create a STOMP transport for STOMP clients. -->  
	        <transportConnector name="stomp" uri="stomp://localhost:61613"/>  
	        <!-- Create a Websocket transport for the websocket dmeo -->  
	        <transportConnector name="ws" uri="ws://localhost:61614/" />  
	    </transportConnectors> */ 
        
        var client;
        function initWs(){
        	 if(window.WebSocket) {
             	var host=window.location.hostname;
      			var port=61613;
      			var url = "ws://"+host+":"+port;
      			var url2 =  "wss://small.nekomiya-sama.top:1886/stomp";
      			var url3 =  "ws://localhost:61614/stomp";
      			client = Stomp.client(url2);
      			client.debug = null;
      			client.heartbeat.outgoing = 0; /* 客户端不发送*/ 
      			client.heartbeat.incoming = 10000;     /* 客户端每10s接收一次数据从服务器*/ 
     	        client.connect("","",connectCallback,errorCallback);
             }
        };
        initWs();
        
        /*链接成功订阅*/
        function connectCallback (frame) {  /*连接成功时的回调函数*/
        	var topic = "/topic/accesslist_warning_branch_"+$('#orgid').val();
        	/*var topic = "/topic/topic_person_kq";*/
			 client.subscribe(topic, handleMq);
			 
			 var topic2 = "/topic/caraccesslist_warning_branch_"+$('#orgid').val();
			 client.subscribe(topic2, carhandleMq);
			 
		};
        
        /*间隔5秒重连*/
        function errorCallback(){/* 连接失败时的回调函数，此函数重新调用连接方法，形成循环，直到连接成功*/
			setTimeout(function() {
				initWs
			}, 5000);
		};
		
		function carhandleMq(message){
        	var parsedWordArray = CryptoJS.enc.Base64.parse(message.body);
        	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
        	var jo=JSON.parse(msg);
        	var content = jo.content;
        	var fullurl = jo.fullurl;
        	var smallurl = jo.smallurl;
        	var branchid = jo.branchid;
        	var orgid = $("#orgid").val();
        	if(branchid==orgid){
        		var html = "<p style='color: red;font-size: 18px;'>"+content+"</p>"
				+"<img src='"+urlFormat(smallurl,200,200)+"'> "
				+"<img src='"+urlFormat(fullurl,200,200)+"'>";
				Swal.fire({
					title:"预警信息",
					html:html,
					background:"#fff",/*背景框颜色*/
					timer:120e3,/*自动关闭对话框的定时器，单位毫秒。*/
					confirmButtonText:'处理'
				}).then(function(e){
					if(e.value){
						ct();
					}else{
						"timer"===e.dismiss&&console.log("I was closed by the timer");
					};
				});
        	};
        };
        
        function handleMq(message){
        	var parsedWordArray = CryptoJS.enc.Base64.parse(message.body);
        	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
        	var jo=JSON.parse(msg);
        	var content = jo.content;
        	var fullurl = jo.fullurl;
        	var smallurl = jo.smallurl;
        	var branchid = jo.branchid;
        	var orgid = $("#orgid").val();
        	if(branchid==orgid){
        		var html = "<p style='color: red;font-size: 18px;'>"+content+"</p>"
				+"<img src='"+urlFormat(smallurl,200,200)+"'> "
				+"<img src='"+urlFormat(fullurl,200,200)+"'>";
			        /*+ "<table class='table table-striped table-hover mytable'>"
			        + "<tr>"
			        + "     <th class='js_tr_data'> 时间</th> <th>名称</th> <th>密码</th>"
			        + "</tr>"
			        + "</table>";*/
				Swal.fire({
					title:"预警信息",
					//type:'warning',
					/*imageHeight:200,
					imageWidth:200,
					imageUrl:imageUrl,
					text:msg,*/
					html:html,
					background:"#fff",/*背景框颜色*/
					timer:120e3,/*自动关闭对话框的定时器，单位毫秒。*/
					confirmButtonText:'处理'
				}).then(function(e){
					if(e.value){
						/*window.open(ctx + "/gov/warning");
						Swal.fire("成功", "点击了确定", "success");*/
						ct();
					}else{
						"timer"===e.dismiss&&console.log("I was closed by the timer");
					};
				});
        	};
        };
        
        function ct(){
        	Swal.fire({
				title:"处理结果",
				text:"预警信息已通过短信形式通知到相关责任人",
				type:"success",
				confirmButtonText:"确定",
				closeOnConfirm:false
			});
        };
        
       /* $(window).unload(function(message){
			 client.disconnect();
		});*/
        /*$('#m_sweetalert_demo_10').on('click', function(){
        	Swal.fire(
      			  'Good job!',
      			  'You clicked the button!',
      			  'success'
      			)
        	Swal.fire({
        		title:"我是预警窗口!",
        		text:"我是预警内容",
        		imageUrl:"https://unsplash.it/400/200",
        		imageWidth:400,
        		imageHeight:200,
        		imageAlt:"Custom image",
        		animation:!1
        	});
        });
        $("#m_sweetalert_demo_10").click(function(e){
        	Swal.fire({
    			title:"Auto close alert!",
    			imageUrl:"https://unsplash.it/400/200",
    			text:"I will close in 5 seconds.",
    			timer:5e3,
    			onOpen:function(){
    				Swal.showLoading()
    			}
    		}).then(function(e){
    			"timer"===e.dismiss&&console.log("I was closed by the timer")
    		})
        });*/
        
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