"use strict";
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
                     };
                     return true;
                },
                'data' : function (obj, callback) {
                    var jsonstr="[]";
                    var jsonarray = eval('('+jsonstr+')');
                    $.ajax({
                        type: "GET",
                        url:ctx + '/gov/carcamera/getJsonTree',
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
                                        "opened":arrays[i].opened
                                };
                                jsonarray.push(arr);
                            };
                            fastNodeid=arrays[0].id;
                        }
                    });
                    callback.call(this, jsonarray);
                }
            },
            "plugins" : [ "contextmenu","changed", "state", "types" ],
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
        	var dataid = data.instance.get_node(data.selected[0]).id;
        	var datatype = data.instance.get_node(data.selected[0]).data;
        	if(datatype!=null && datatype!='undefined'){
            	$("#selectid").val(dataid);
            	$("#datatype").val(datatype);
        	}
			if($('#orgid').val() == '510623') {
				var d = data.instance.get_node(data.selected[0]);
				if (d) {
					var type = d.original.type;
					if (type == 2){
						$('#branchid').val(dataid);
					}
				}
			}
        });
        
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
      			client.heartbeat.outgoing = 0;
      			client.heartbeat.incoming = 10000;
     	        client.connect("","",connectCallback,errorCallback);
             }
        }
        initWs();
        
        /**为避免空白画面 进来之后首先获取早先10条数据*/
        $.ajax({  
    		type: 'get',  
    		dataType: 'text',  
    		url :  ctx+'/gov/caraccesslist/getCarAccesslistOnlineData', 
    		success : function(arrays){ 
    			console.info("预先加载车辆实时流水...")
    		}
    	});
        
        function connectCallback (frame) {
			if ($('#orgid').val() == '510623'){//中江县
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
								var topic = "/topic/caraccesslist_online_branch_"+branchid;//$('#orgid').val();
								//var topic = "/topic/boxsnap_online"
								/*var topic = "/topic/topic_person_kq";*/
								client.subscribe(topic, handleMq);
							});
						}
					}
				});
			}
			var topic = "/topic/caraccesslist_online_branch_"+$('#orgid').val();
			/*var topic = "/topic/topic_person_kq";*/
			client.subscribe(topic, handleMq);
		};
        
        function errorCallback(){
			setTimeout(function() {
				initWs();
			}, 5000);
		};
        
        var kqdata=[];
        function handleMq(message){
        	/*var parsedWordArray = CryptoJS.enc.Base64.parse(message.body);
        	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
        	var jo=JSON.parse(message);*/
        	var jo=JSON.parse(message.body);
        	var kqid = jo.id;
        	var kqtime = jo.kqtime;
        	var fullurl = jo.fullurl;
        	var smallurl = jo.smallurl;
        	var branchid = jo.branchid;
        	var placeid = jo.placeid;
        	var placename = jo.placename;
        	var boxid = jo.carcameraid;
        	var snapaddress = jo.snapaddress;
        	var similar = jo.similar;
        	var plate = jo.plate;
        	var source = jo.source;
        	var platetype = jo.platetype;
        	var carColor = jo.carColor;
        	
        	var cbranchid = $('#orgid').val();
        	var selectid = $("#selectid").val()==""?1:$("#selectid").val();
			var datatype = $("#datatype").val()==""?1:$("#datatype").val();
        	var flag = false;
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
			if ($('#orgid').val() == '510623'){//中江县
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
        	if(flag){
        		kqdata.unshift(jo);
    			while (kqdata.length>24)
    			{
    				kqdata.pop();
    			};
    			
    			if(kqdata.length>0){
    				var data=kqdata[0];
    				$("#fullurl").attr("src",fullurl);
    				$("#fullurl2").attr("src",fullurl);
    				$("#smallurl").attr("src",smallurl);
    			};
    			$("#snap_similar").html(similar);
    			$("#snap_address").html(snapaddress);
    			$("#snap_kqtime").html(kqtime);
    			
    			$("#snap_plate").html(plate);
    			$("#snap_source").html(source);
    			
    			$("#snap_platetype").html(platetype);
    			$("#snap_carColor").html(carColor);
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