"use strict";
/* Class definition*/ 
var DemoList = function () {

    var initPage = function (that) {
    	var fastNodeid=null;
    	$("#kt_tree_4").jstree({
            "core" : {
                "themes" : {"responsive": true}, 
                "check_callback" : function (operation, node, parent, position, more) {
                	if(operation === "rename_node") {
                        if(parent.id === "#") {
                          return false;
                        }
                     }
                     return true;
                },
                'data' : function (obj, callback) {
                    var jsonstr="[]";
                    var jsonarray = eval('('+jsonstr+')');
                    $.ajax({
                        type: "GET",
                        url:ctx + '/skynet/facial/getJsonTree',
                        dataType:"text",
                        async: false,
                        success:function(result) {
                        	var parsedWordArray = CryptoJS.enc.Base64.parse(result);
                        	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
                        	var arrays=JSON.parse(msg);
                            /*var arrays= result;*/
                            for(var i=0 ; i<arrays.length; i++){
                                var arr = {
                                        "id":arrays[i].id,
                                        "parent":arrays[i].pid=="root"?"#":arrays[i].pid,
                                        "text":arrays[i].name,
                                        "icon":arrays[i].icon,
                                        "data":arrays[i].type,
                                        "opened":arrays[i].opened,
                                        "url": arrays[i].hls
                                };
                                jsonarray.push(arr);
                            };
                            fastNodeid=arrays[0].id;
                         
                        }
                    });
                    callback.call(this, jsonarray);
                }
            },
            "plugins" : [ "contextmenu","changed", "state", "types" ],/*"dnd",拖拽 "contextmenu",节点菜单*/
            "types":{
            	"default":{"icon":"fa fa-folder icon-state-warning icon-lg"},
                "file":{"icon":"fa fa-file icon-state-warning icon-lg"}
            },
            "state": {"opened":true},
            "contextmenu":{
            	select_node:false,
    	    	show_at_node:true,
    	    	items: function (node){
    	    		var menu = {};
                    return menu;
    	    	}
            }
        }).on('changed.jstree', function (e, data) {
        	console.log('00000000000')
        
        	/*$('#iframedom').attr("src",'http://192.168.137.207:8080/#/videoPlayer?name=名字&url=hfjdshjfhdsjsdkf'); */
        	var dataid = data.instance.get_node(data.selected[0]).id;
        	var datatype = data.instance.get_node(data.selected[0]).data;
        	$("#selectid").val(dataid);
        	$("#datatype").val(datatype);
			/*if($('#subflag').val() === 1) {
				var d = data.instance.get_node(data.selected[0]);
				if (d) {
					var type = d.original.type;
					if (type == 2){
						$('#branchid').val(dataid);
					}
				}
			}*/
        });
        console.log('添加节点了====')
        /* 注册handlebars模板*/
        var template = Handlebars.compile($("#template-stranger").html());

		Handlebars.registerHelper('urlFormat', function(photo) { 
			return urlFormat(photo,130,120);
		});
        
        Handlebars.registerHelper('showfull', function(fullurl) { 
        	$("#fullurl").attr("src",fullurl);
		});
        
        var client;
        function initWs(){
        	 if(window.WebSocket) {
				var url =  "wss://small.nekomiya-sama.top:1886/stomp";
      			var url2 =  "ws://sctel-acs.iguyee.cn:1886/stomp";
      			var url3 =  "ws://192.168.1.213:61614/stomp";
      			client = Stomp.client(url);
      			client.debug = null;
      			client.heartbeat.outgoing = 0; /*客户端不发送*/ 
      			client.heartbeat.incoming = 10000;     /*客户端每10s接收一次数据从服务器*/ 
     	        client.connect("","",connectCallback,errorCallback);
             }
        }
        
        initWs();
        
        /**为避免空白画面 进来之后首先获取早先10条数据*/
        $.ajax({  
    		type: 'get',  
    		dataType: 'text',  
    		url :  ctx+'/gov/accesslist/getAccesslistOnlineData', 
    		success : function(arrays){ 
    			if(arrays!=null && arrays!='' && arrays!="null"){
    				//var parsedWordArray = CryptoJS.enc.Base64.parse(arrays);
                	//var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
                	var result=arrays;//JSON.parse(msg);
                	let index = 0;
                	let Interval =setInterval(function(){
                		if(index<result.length){
                			handleMq2(result[index]);
                    		index++;
                		}else{
                			clearInterval(Interval);
                		}
                	}, 1000);
    			}
    		}
    	});
        
        /*链接成功订阅*/
        function connectCallback (frame) {/*连接成功时的回调函数*/
        	if($('#subflag').val() == 1) {//中江县
				$.ajax({
					type: 'get',
					dataType: 'text',
					url :  ctx+'/gov/getSubTopic',
					success : function(arrays){
						if(arrays!=null && arrays!='' && arrays!="null"){
							var parsedWordArray = CryptoJS.enc.Base64.parse(arrays);
							var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
							var result=JSON.parse(msg);

							$.each(result, function(index, val) {
								var branchid = this.id;
								var topic = "/topic/accesslist_online_branch_"+branchid;//$('#orgid').val();
								//var topic = "/topic/boxsnap_online"
								/*var topic = "/topic/topic_person_kq";*/
								client.subscribe(topic, handleMq);
							});
						}
					}
				});
			}else{
				var topic = "/topic/accesslist_online_branch_"+$('#orgid').val();
				/*var topic = "/topic/topic_person_kq";*/
				client.subscribe(topic, handleMq);
			}
		};
        
        /*间隔5秒重连*/
        function errorCallback(){/*连接失败时的回调函数，此函数重新调用连接方法，形成循环，直到连接成功*/
			setTimeout(function() {
				initWs();
			}, 5000);
		};
        
        var kqdata=[];
        
        function handleMq2(jo){
        	/*增加抓拍数据*/
        	/*抓拍数据画面实时展示*/
        	/*var olddata = $('#todaySnapTotoal').html(); 
        	var data = parseInt(olddata);
        	new CountUp("todaySnapTotoal", olddata, data+1, 0, 3, options).start();*/
        	/*var msg = decodeURIComponent(atob(message.body));*/
        	var kqid = jo.id;
        	var kqtime = jo.kqtime;
        	var fullurl = jo.fullurl;
        	var smallurl = jo.smallurl;
        	var branchid = jo.branchid;
        	var placeid = jo.placeid;
        	var placename = jo.placename;
        	var boxid = jo.boxid;
        	var snapaddress = jo.snapaddress;
        	var facequality = jo.facequality;
        	var memo = jo.memo;
        	var similar = jo.similar;
        	var name = jo.name;
        	var source = jo.source;
        	var faceurl = jo.faceurl;
        	
        	var cbranchid = $('#orgid').val();
        	var datatype = $("#datatype").val()==""?1:$("#datatype").val();
        	var selectid = $("#selectid").val()==""?"":$("#selectid").val();
        	var flag = false;
        	if(branchid == cbranchid){
        		if(datatype==1){
        			flag = true;
        		}else if(datatype==2){
        			if(selectid==placeid){
        				flag = true;
        			}
        		}else if(datatype==3){
        			if(selectid==boxid){
        				flag = true;
        			}
        		};
        	};
        	if(flag){
        		kqdata.unshift(jo);/*unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度。*/
    			while (kqdata.length>24)
    			{
    				kqdata.pop();/*pop() 方法用于删除并返回数组的最后一个元素。*/
    			};
    			
    			if(kqdata.length>0){
    				var data=kqdata[0];/*当前抓拍对象*/
    			};
    			$("#fullurl").attr("src",fullurl);
				$("#smallurl").attr("src",smallurl);
				$("#snap_address").html(snapaddress);
    			$("#snap_kqtime").html(kqtime);
    			$("#snap_facequality").html(facequality);
    			$("#snap_memo").html(memo);
				
    			
    			$("#facequalitydiv").show();
    			
				if(similar!=null && similar>0.0){
					$("#cd1").show();
    				$("#cd2").show();
    				$("#cd4").hide();
					if(similar<99.99){
						$("#idvs").attr("src",ctx+"/static/image/vs.png");
						$("#faceurl").attr("src",faceurl);
						$("#snap_similar").html(similar);
					}else{
						$("#idvs").attr("src",ctx+"/static/image/inlibrary.png");
						$("#faceurl").attr("src",ctx+"/static/image/library.png");
						$("#snap_similar").html("");
					}
	    			$("#snap_sgryname").html(name);
	    			$("#snap_source").html(source);
				}else{
					$("#cd1").hide();
    				$("#cd2").hide();
    				$("#cd4").show();
    				
					$("#idvs").attr("src",ctx+"/static/image/vs.png");
					$("#faceurl").attr("src",ctx+"/static/image/faceurl.png");
	    			$("#snap_similar").html("");
	    			$("#snap_sgryname").html("");
	    			$("#snap_source").html("");
				};
            	$('#accesslist').html(template(kqdata));
        	};
        };
		
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

        function handleMq(message){
        	/*增加抓拍数据*/
        	/*抓拍数据画面实时展示*/
        	/*var olddata = $('#todaySnapTotoal').html(); 
        	var data = parseInt(olddata);
        	new CountUp("todaySnapTotoal", olddata, data+1, 0, 3, options).start();*/
        	/*var msg = decodeURIComponent(atob(message.body));*/
        	var parsedWordArray = CryptoJS.enc.Base64.parse(message.body);
        	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
        	var jo=JSON.parse(msg);
        	var kqid = jo.id;
        	var kqtime = jo.kqtime;
        	var fullurl = jo.fullurl;
        	var smallurl = jo.smallurl;
        	var branchid = jo.branchid;
        	var placeid = jo.placeid;
        	var placename = jo.placename;
        	var boxid = jo.boxid;
        	var snapaddress = jo.snapaddress;
        	var facequality = jo.facequality;
        	var memo = jo.memo;
        	var similar = jo.similar;
        	var name = jo.name;
        	var source = jo.source;
        	var faceurl = jo.faceurl;
        	
        	var cbranchid = $('#orgid').val();
        	var datatype = $("#datatype").val()==""?1:$("#datatype").val();
        	var selectid = $("#selectid").val()==""?"":$("#selectid").val();
        	var flag = false;
        	/*if(branchid == cbranchid){
        		if(datatype==1){
        			flag = true;
        		}else if(datatype==2){
        			if(selectid==placeid){
        				flag = true;
        			}
        		}else if(datatype==3){
        			if(selectid==boxid){
        				flag = true;
        			}
        		};
        	};*/
        	if(datatype==1){
        		flag = true;
    		}else if(datatype==2){
    			if(selectid==placeid){
    				flag = true;
    			}
    		}else if(datatype==3){
    			if(selectid==boxid){
    				flag = true;
    			}
    		};
        	if ($('#subflag').val() == 1){//中江县
				if(datatype==1){
					flag = true;
				}else if(datatype==2){
					if(selectid==branchid){
						flag = true;
					}
				}else if(datatype==3){
					if(selectid==placeid){
						flag = true;
					}
				}else if(datatype==4){
					if(selectid==boxid){
						flag = true;
					}
				};
			}
			if(isEmpty(smallurl)){
				flag = flase;
			}
        	if(flag){
        		kqdata.unshift(jo);/*unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度。*/
    			while (kqdata.length>24)
    			{
    				kqdata.pop();/*pop() 方法用于删除并返回数组的最后一个元素。*/
    			};
    			
    			if(kqdata.length>0){
    				var data=kqdata[0];/*当前抓拍对象*/
    			};
    			$("#fullurl").attr("src",fullurl);
				$("#smallurl").attr("src",smallurl);
				$("#snap_address").html(snapaddress);
    			$("#snap_kqtime").html(kqtime);
    			$("#snap_facequality").html(facequality);
    			$("#snap_memo").html(memo);
				$("#kqid").val(kqid);
    			
    			$("#facequalitydiv").show();
    			
				if(similar!=null && similar>0.0){
					$("#cd1").show();
    				$("#cd2").show();
    				$("#cd4").hide();
					if(similar<99.99){
						$("#idvs").attr("src",ctx+"/static/image/vs.png");
						$("#faceurl").attr("src",faceurl);
						$("#snap_similar").html(similar);
					}else{
						$("#idvs").attr("src",ctx+"/static/image/inlibrary.png");
						$("#faceurl").attr("src",ctx+"/static/image/library.png");
						$("#snap_similar").html("");
					}
	    			$("#snap_sgryname").html(name);
	    			$("#snap_source").html(source);
				}else{
					$("#cd1").hide();
    				$("#cd2").hide();
    				$("#cd4").show();
    				
					$("#idvs").attr("src",ctx+"/static/image/vs.png");
					$("#faceurl").attr("src",ctx+"/static/image/faceurl.png");
	    			$("#snap_similar").html("");
	    			$("#snap_sgryname").html("");
	    			$("#snap_source").html("");
				};
            	$('#accesslist').html(template(kqdata));
        	};
        };
    };

    return {
        init: function () {
            initPage.apply(this);
        }
    };

}();

jQuery(document).ready(function () {
    DemoList.init();
});