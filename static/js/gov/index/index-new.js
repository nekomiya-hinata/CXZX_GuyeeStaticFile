"use strict";
var track = function () {

    var initPage = function (that) {
    	
    	/*window.location.href="http://192.168.1.226:8080/#/";*/
    	
    	$("#file1").change(function(){
		    $("#dispimg").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
    	$("#file2").change(function(){
		    $("#dispimg2").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
    	$("#file3").change(function(){
		    $("#dispimg3").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
    	
    	var options = {
    		useEasing: true,
    		useGrouping: true,
    		separator: ',',
    		decimal: '.'
    	};
    	
    	$.ajax({ 
    		type: 'get',  
    		dataType: 'text',  
    		url :  ctx+'/gov/dashboard/kpi', 
    		success : function(data){ 
    			var parsedWordArray = CryptoJS.enc.Base64.parse(data);
            	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
            	var result=JSON.parse(msg);
    			/*$('#todayWarningTotal').html('<span class="counter"  data-value="'+result.todayWarningTotal+'">0</span>');
    			$('#todaySnapFaceTotoal').html('<span class="counter"  data-value="'+result.todaySnapFaceTotoal+'">0</span>');
    			$('#todaySnapCarTotoal').html('<span class="counter"  data-value="'+result.todaySnapCarTotoal+'">0</span>');
    			$('.counter').counterUp({
    				delay: 10,每个数字动画的延迟时间，单位毫秒�?
	        	    time: 1000计数动画总的持续时间�?
	        	});*/
            	
            	new CountUp(placeTotal, 0, result.placeTotal, 0, 3, options).start();
            	new CountUp(boxTotal, 0, result.boxTotal, 0, 3, options).start();
            	new CountUp(todayWarningTotal, 0, result.todayWarningTotal, 0, 3, options).start();
            	new CountUp(todaySnapFaceTotoal, 0, result.todaySnapFaceTotoal, 0, 3, options).start();
            	new CountUp(todaySnapCarTotoal, 0, result.todaySnapCarTotoal, 0, 3, options).start();
    		}  
    	});
    	
    	var map = new BMap.Map("allmap",{enableMapClick:false});
    	var longitude = $("#longitude").val();
    	var latitude = $("#latitude").val();
    	var cityname = $("#cityname").val();
    	var point = new BMap.Point(longitude,latitude);
    	map.centerAndZoom(point, 17);
    	//map.setCurrentCity(cityname); 
    	map.enableScrollWheelZoom(true);/*开启鼠标滚轮缩�?/
        
    	/*鼠标离开地图 地图禁止缩放*/
    	function div_onmouseover(){
    		this.map.disableScrollWheelZoom(true);
    	};
    	/*鼠标放在地图�?地图可以缩放*/
    	function div_onmouseout(){
    		this.map.enableScrollWheelZoom(true);
    	};
    	
    	/*覆盖物构造方�?/
    	function ComplexCustomOverlay(point, boxaddress, boxid, snaptotal){
    	    this._point = point;
    	    this._boxaddress = boxaddress;
    	    this._boxid = boxid;
    	    this._snaptotal = snaptotal;
    	};
    	
    	ComplexCustomOverlay.prototype = new BMap.Overlay();
    	ComplexCustomOverlay.prototype.initialize = function(map){
    		this._map = map;
    		var div = this._div = document.createElement("div");
    		div.style.position = "absolute";
    		div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
    		div.style.backgroundColor = "#EE5D5B";
    		div.style.border = "1px solid #BC3B3A";
    		div.style.color = "white";
    		div.style.height = "18px";
    		div.style.padding = "2px";
    		div.style.lineHeight = "18px";
    		div.style.whiteSpace = "nowrap";
    		div.style.MozUserSelect = "none";
    		div.style.fontSize = "12px";
    		this._div.innerHTML='<span id="'+this._boxid+'" class="counter" data-value="'+this._snaptotal+'" >0</span>';
    		
    		var that = this;
    		/*var arrow = this._arrow = document.createElement("div");
    		arrow.style.position = "absolute";
    		arrow.style.width = "11px";
    		arrow.style.height = "10px";
    		arrow.style.top = "22px";
    		arrow.style.left = "10px";
    		arrow.style.overflow = "hidden";
    		div.appendChild(arrow);

    		div.onmouseover = function(){
    			this.style.backgroundColor = "#6BADCA";
    	        this.style.borderColor = "#0000ff";
    	        this.getElementsByTagName("span")[0].innerHTML = that._boxaddress+",今日抓拍:"+that._snaptotal+"�?;
    	        arrow.style.backgroundPosition = "0px -20px";
    		}

    		div.onmouseout = function(){
    	        this.style.backgroundColor = "#EE5D5B";
    	        this.style.borderColor = "#BC3B3A";
    	        this.getElementsByTagName("span")[0].innerHTML = that._snaptotal;
    	        arrow.style.backgroundPosition = "0px 0px";
    		}*/
    		
    		/*var span = this._span = document.createElement("span");
    		div.appendChild(span);
    		span.appendChild(document.createTextNode(this._text));*/
    		
    		/*var span=this._span=document.createElement("span");
    		这里用jquery设置样式
    		 $(span).css({   
    			'position':'absolute',
    			'zIndex':BMap.Overlay.getZIndex(this._point.lat),
    			'display':'block',
    			'width':'26px',
    			'color':'#FFF',
    			'text-align':'center',
    			'point-events':'none'
    			});
    	 　　	设置数字也就是我们的标注
    		this._span.innerHTML="<span style='color:red;'>"+this._index+"</span>";*/
    		
    		map.getPanes().labelPane.appendChild(div);
    		return div;
    	};
    	
    	ComplexCustomOverlay.prototype.draw = function(){
    		var map = this._map;
    		var pixel = map.pointToOverlayPixel(this._point);
    		/*设置自定义覆盖物span 与marker的位�?/
    		this._div.style.left = pixel.x-10+'px';
    		this._div.style.top  = pixel.y-30+'px';
    	};
    	
    	/*添加�?/
    	function addMarker(point,type){
    		/*设置不同点的背景图（红色和绿色两个图片）*/
    		if(type=='red'){
    			var myIcon=new BMap.Icon(ctx+'/static/image/red.png',new BMap.Size(29,38));/*bullet_red.png*/
    			var marker = new BMap.Marker(point);
    			marker.setIcon(myIcon);
    			map.addOverlay(marker);
    			/*marker.setAnimation(BMAP_ANIMATION_BOUNCE);*/
    		}else{
    			var myIcon=new BMap.Icon(ctx+'/static/image/snap.png',new BMap.Size(29,38));/*bullet_green.png*/
    			var marker = new BMap.Marker(point);
    			marker.setIcon(myIcon);
    			map.addOverlay(marker);
    			/*marker.setAnimation(BMAP_ANIMATION_BOUNCE);*/ /*跳动的动�?/
    		}
    	};
    	
    	/*创建折线*/
    	var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
    	    scale: 0.6,/*图标缩放大小*/
    	    strokeColor:'#fff',/*设置矢量图标的线填充颜色*/
    	    strokeWeight: '2',/*设置线宽*/
    	});
    	var icons = new BMap.IconSequence(sy, '10', '30');
    	function clear(){
    		var allOverlay = map.getOverlays();
    		for (var i = 0; i < allOverlay.length; i++){
    			map.removeOverlay(allOverlay[i]);
    		};
    	};
    	
    	/**添加临控人员*/
    	function searchControl(){
		   this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
		   this.defaultOffset = new BMap.Size(10,10);/*距离右边距离,距离顶部距离*/
		}
    	searchControl.prototype = new BMap.Control();
    	searchControl.prototype.initialize = function(map){
    		 var search = document.getElementById("searchControl")
    		 map.getContainer().appendChild(search);
    		 return search;
    	};
    	var searchZoomCtrl = new searchControl();
    	map.addControl(searchZoomCtrl);
    	/**实时抓拍*/
    	function waterControl(){
 		   this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
 		   this.defaultOffset = new BMap.Size(20,10);/*距离右边距离,距离顶部距离*/
 		};
    	waterControl.prototype = new BMap.Control();
    	waterControl.prototype.initialize = function(map){
     		 var water = document.getElementById("waterControl")
     		 map.getContainer().appendChild(water);
     		 return water;
     	};
     	var waterZoomCtrl = new waterControl();
     	map.addControl(waterZoomCtrl);
     	/**实时抓拍*/
    	function sumControl(){
 		   this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
 		  var o = document.getElementById("sumControl");
 		  var w = o.clientWidth||o.offsetWidth;
 		   this.defaultOffset = new BMap.Size((document.body.clientWidth-w)/2,10);/*距离右边距离,距离顶部距离*/
 		};
 		sumControl.prototype = new BMap.Control();
 		sumControl.prototype.initialize = function(map){
     		 var sum = document.getElementById("sumControl")
     		 map.getContainer().appendChild(sum);
     		 return sum;
     	};
     	var sumZoomCtrl = new sumControl();
     	map.addControl(sumZoomCtrl);
     	
    	
    	var myIcon = new BMap.Icon(ctx+'/static/image/green.png', new BMap.Size(32, 70), {
    		//offset: new BMap.Size(0, -5),    //相当于CSS精灵
    		imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点�?
    	});
    	
    	 form_helpers.parsley($('#form'));
    	 $('#form').ajaxForm({
    		url :ctx + "/gov/tempperson",
			type : 'POST',
			dataType : 'json',
			beforeSubmit : function(formData, form, options) {
				form_helpers.blockUI($('#form'));
			},
			error : function(data, textStatus, errorThrown) {
				form_helpers.unblockUI($('#form'));
			},
			success : function(data) {
				form_helpers.unblockUI($('#form'));
				if (data.success) {
					var parsedWordArray = CryptoJS.enc.Base64.parse(data.data);
		        	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
		        	var contentdata=JSON.parse(msg);
					
					$("#pid1").val(contentdata.pid1);
					$("#pid2").val(contentdata.pid2);
					$("#pid3").val(contentdata.pid3);
					form_helpers.unblockUI($('#form'));
					form_helpers.notify(data.msg, "提示信息", "success");
				} else {
					$("#pid1").val("");
					$("#pid2").val("");
					$("#pid3").val("");
					form_helpers.unblockUI($('#form'));
					form_helpers.notify(data.msg, "提示信息", "warning");
					/*form_helpers.unblockUI($('#form'));
					form_helpers.info($('#alert'), "warning", "warning", data.msg, 6);*/
				}
			}
    	 });
    	
    	$("#btn_reset").on('click',reset);
     	function reset() {
    		$('#form')[0].reset();
    		$("#dispimg").attr("src",ctx+"/static/image/noimg.jpg");
    		$("#dispimg2").attr("src",ctx+"/static/image/noimg.jpg");
    		$("#dispimg3").attr("src",ctx+"/static/image/noimg.jpg");
    		//clear();
		};
    	
    	function run(point_start, point_end, myIcon, myColor, myMarker){
    		var point_init = point_start;
    		var walking = new BMap.WalkingRoute(map);    //驾车实例 DrivingRoute 步行实例WalkingRoute
    		walking.search(point_start, point_end);
    		walking.setSearchCompleteCallback(function(){
    			var pts = walking.getResults().getPlan(0).getRoute(0).getPath();    //通过驾车实例，获得一系列点的数组
    			var paths = pts.length;    //获得有几个点

    			var carMk = new BMap.Marker(pts[0],{icon:myIcon});//myMarker  
    			map.addOverlay(carMk);//添加坐标�?
    			var i=0;
    			function resetMkPoint(i){
    				carMk.setPosition(pts[i]);
    				//map.setViewport([point_start,pts[i]]);
    				var polyline =new BMap.Polyline([point_init,pts[i]], {
    					enableEditing: false,
    					enableClicking: false,
    					strokeWeight:'2',
    					strokeOpacity: 0.8,
    					strokeColor:myColor
    				});
    				polyline.setStrokeStyle("solid");
    				map.addOverlay(polyline);
    				
    				if(i==(paths-1)){
    					if(pts[i]!=point_end){
    						var polyline =new BMap.Polyline([pts[i],point_end], {
    	    					enableEditing: false,
    	    					enableClicking: false,
    	    					strokeWeight:'2',
    	    					strokeOpacity: 0.8,
    	    					strokeColor:myColor
    	    				});
    	    				polyline.setStrokeStyle("solid");
    	    				map.addOverlay(polyline);
    	    				map.removeOverlay(carMk);
    					}else{
    						map.removeOverlay(carMk);
    					}
    				}
    				
    				if(i>0){
    					point_init = pts[i];
    				}
    				if(i < (paths-1)){
    					setTimeout(function(){
    						i++;
    						resetMkPoint(i);
    					},500);
    				}
    			}
    			setTimeout(function(){
    				resetMkPoint(1);
    			},100);
    			map.setViewport([point_start, point_end]);
    			map.addOverlay(myMarker);
    		});
    	}
		
    	function initPoints(){
    		var points = [];
    		$.ajax({  
        		type: 'get',  
        		dataType: 'text',  
        		url :  ctx+'/gov/box/initPoints', 
        		success : function(arrays){ 
        			var parsedWordArray = CryptoJS.enc.Base64.parse(arrays);
                	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
                	var result=JSON.parse(msg);
                	$.each(result, function (index, item) {
						var point = new BMap.Point(this.longitude, this.latitude);
						var boxaddress = this.boxaddress;
						var boxid = this.boxid;
						var snaptotal = this.snaptotal;
						addMarker(point,'green');
						var myCompOverlay = new ComplexCustomOverlay(point, boxaddress, boxid, snaptotal);
						map.addOverlay(myCompOverlay); 
						
						new CountUp(boxid, 0, snaptotal, 0, 3, options).start();
						
					  	points[index]=point;
					});
        		}
        	});
    		map.setViewport(points);
    	}
    	initPoints();
    	
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
        	var topic = "/topic/accesslist_online_branch_"+$('#orgid').val();//双龙�?6711068209163 威远�?511024
			client.subscribe(topic, handleMq);
		};
        
        function errorCallback(){
			setTimeout(function() {
				initWs();
			}, 5000);
		};
		
		var point_start1 = null;
		var init_placeid1 = null;
		var init_marker1 = null;
		var init_color1 = "#6699ff";
		
		var point_start2 = null;
		var init_placeid2 = null;
		var init_marker2 = null;
		var init_color2 = "#FF0000";
		
		var point_start3 = null;
		var init_placeid3 = null;
		var init_marker3 = null;
		var init_color3 = "#18a45b";
		
		var detail_template = Handlebars.compile($("#detail_template").html());
		
		var kqdata=[];
		function renderPhoto(){ 
			if(kqdata.length>0){
				
				$('#detail').html("");
				for (var i=0;i<kqdata.length;i++){
					var item=renderLine(kqdata[i]);
					$('#detail').append(item);
				}
				/*$(".m-widget9__img").fadeOut('slow',function(){
					$(this).fadeIn();
				});*/
			}
		}
		
		function renderLine(data){
			//var detail_html = '<div style="margin-bottom: 10px;"><img src="'+data.fullurl+'" style="height: 100px;width: 150px;" onclick="info('+data.fullurl+')"></div>'
			var detail_html = '<div class="m-widget5">'
				        +'<div class="m-widget5__item">'
							+'<div class="m-widget5__content">'
								+'<div class="m-widget5__pic">'
									+'<img class="m-widget7__img" style="background-size:cover;hight:100%;" src="'+data.fullurl+'" alt="">'
								+'</div>'
								+'<div class="m-widget5__section">'
									+'<div class="m-widget5__info">'
										+'<span class="m-widget5__author" style="font-size: 8px;"><i class="fa fa-clock" title="出入时间"></i> '+data.kqtime+'</span></br>'
										+'<span class="m-widget5__info-label"><i class="fa fa-street-view" title="地点"></i> '+data.snapaddress+'</span>'
									+'</div>'
								+'</div>'
							+'</div>'
						+'</div>'
					+'</div>';
			return $(detail_html);
		}
		function handleMq(message){
        	var parsedWordArray = CryptoJS.enc.Base64.parse(message.body);
        	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
        	var jo=JSON.parse(msg);
        	
        	kqdata.unshift(jo);/*unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度�?/
			while (kqdata.length>10)
			{
				kqdata.pop();/*pop() 方法用于删除并返回数组的最后一个元素�?/
			}
			renderPhoto();
			
			var todaySnapFaceTotoal_span =document.getElementById("todaySnapFaceTotoal");
			var todaySnapFaceTotoal_olddata = parseInt(todaySnapFaceTotoal_span.innerText.replace(",",""));
			var todaySnapFaceTotoal_newdata =  todaySnapFaceTotoal_olddata+1;
        	new CountUp(todaySnapFaceTotoal, todaySnapFaceTotoal_olddata, todaySnapFaceTotoal_newdata, 0, 3, options).start();
        	
        	var boxid = jo.boxid;
        	var box_span = document.getElementById(boxid);
        	var lng = jo.lng;
        	var lat = jo.lat;
        	var placeid = jo.placeid;
        	var smallurl = jo.smallurl;
        	var personid = jo.temppersonid;
        	/*if(boxid=='initsnapBE:27:4A:4E:59:81' || 
        			boxid=='initsnapBE:27:C7:85:32:F8'|| 
        			boxid == 'initsnapBE:27:54:BB:18:21' ||
        			boxid == 'initsnapBE:27:B1:8B:22:21' ||
        			boxid == 'initsnapBE:27:62:D2:C4:C7'){
        		personid = "test2";
        	}*/
        	
        	/**实时抓拍展示**/
        	//var detail_html = detail_template(jo);
			//$('#detail').html(detail_html);
        	if(box_span!='' && box_span!=null){/*相应点位数字+1*/
        		var olddata = parseInt(box_span.innerText.replace(",",""));
    			var newdata =  olddata+1;
    			/* target , startVal, endVal , decimals , duration , options */
            	new CountUp(boxid, olddata, newdata, 0, 3, options).start();
        	}
        	if(personid!=null){
        		/*******动态画临控人员1的轨�?******/
        		if(personid==$("#pid1").val()){
        			var point_end = new BMap.Point(lng, lat);
    				var myIcon=new BMap.Icon(smallurl.replace('.jpg','_20x20.jpg'),new BMap.Size(20,20));
        			var marker = new BMap.Marker(point_end);
        			marker.setIcon(myIcon);
        			
        			if(point_start1!='undefined' && point_start1!=null){
        				if(init_placeid1 == placeid){
        					//同一个场所 连线  不走�?
        					if(point_start1==point_end){
        						//nothing to do
        						console.info("轨迹1--------同一场所同一地点,nothing to do")
        					}else{
        						console.info("轨迹1--------同一个场所,不同地点,直线")
        						var points = [];
        					  	points[0]=point_start1;
        					  	points[1]=point_end;
        					  	var polyline =new BMap.Polyline(points, {
            						enableEditing: false,
            						enableClicking: false,
            						strokeWeight:'2',
            						strokeOpacity: 0.8,
            						strokeColor:init_color1 
            					});
            					polyline.setStrokeStyle("solid");
            					map.addOverlay(polyline);
            					map.addOverlay(marker);
        					}
        				}else{
        					console.info("轨迹1--------不同场所  步行导航");
        					/*if(!trackflag){
        						run(point_start1, point_end, myIcon, init_color1, marker);
        					}
        					setTimeout(function(){
        						run(point_start1, point_end, myIcon, init_color1, marker);
            					map.addOverlay(marker);
        					},1000);*/
        					run(point_start1, point_end, myIcon, init_color1, marker);
        				}
        				if(init_marker1!=null){
        					map.removeOverlay(init_marker1);
        				}
        				point_start1 = point_end;
        				init_placeid1 = placeid;
        				init_marker1 = marker;
        			}else{
        				console.info("初始化临控人�?的起�?)
        				
        				point_start1 = point_end;
        				init_placeid1 = placeid;
        				init_marker1 = marker;
        				
        				map.addOverlay(marker);
        				//map.addOverlay(marker);
            			//marker.setAnimation(BMAP_ANIMATION_BOUNCE); /*跳动的动�?/
        			}
            	}
        		
        		/*******动态画临控人员2的轨�?******/
        		if(personid==$("#pid2").val()){
        			var point_end = new BMap.Point(lng, lat);
    				var myIcon=new BMap.Icon(smallurl.replace('.jpg','_20x20.jpg'),new BMap.Size(20,20));
        			var marker = new BMap.Marker(point_end);
        			marker.setIcon(myIcon);
        			
        			if(point_start2!='undefined' && point_start2!=null){
        				if(init_placeid2 == placeid){
        					if(point_start2==point_end){
        						console.info("开始画第二条轨迹线--------同一个场所同一地点");
        					}else{
        						console.info("开始画第二条轨迹线--------同一个场所,不同地点,连线");
        						
        						var points = [];
        					  	points[0]=point_start2;
        					  	points[1]=point_end;
        					  	var polyline =new BMap.Polyline(points, {
            						enableEditing: false,
            						enableClicking: false,
            						strokeWeight:'2',
            						strokeOpacity: 0.8,
            						strokeColor:init_color2
            					});
            					polyline.setStrokeStyle("solid");
            					map.addOverlay(polyline);
            					
            					map.addOverlay(marker);
        					}
        				}else{
        					console.info("开始画第二条轨迹线--------同一个场所不同一地点,动态轨�?);
        					run(point_start2, point_end, myIcon, init_color2, marker);
        				}
        				if(init_marker2!=null){
        					map.removeOverlay(init_marker2);
        				}
        				
        				point_start2 = point_end;
        				init_placeid2 = placeid;
        				init_marker2 = marker;
        			}else{
        				point_start2 = point_end;
        				init_placeid2 = placeid;
        				init_marker2 = marker;
        				
        				map.addOverlay(marker);
        			}
            	}
        		
        		/*******动态画临控人员3的轨�?******/
        		if(personid==$("#pid3").val()){
        			var point_end = new BMap.Point(lng, lat);
    				var myIcon=new BMap.Icon(smallurl.replace('.jpg','_20x20.jpg'),new BMap.Size(20,20));
        			var marker = new BMap.Marker(point_end);
        			marker.setIcon(myIcon);
        			
        			if(point_start3!='undefined' && point_start3!=null){
        				if(init_placeid3 == placeid){
        					if(point_start3==point_end){
        						
        					}else{
        						var points = [];
        					  	points[0]=point_start3;
        					  	points[1]=point_end;
        					  	var polyline =new BMap.Polyline(points, {
            						enableEditing: false,
            						enableClicking: false,
            						strokeWeight:'2',
            						strokeOpacity: 0.8,
            						strokeColor:init_color3
            					});
            					polyline.setStrokeStyle("solid");
            					map.addOverlay(polyline);
            					map.addOverlay(marker);
        					}
        				}else{
        					run(point_start3, point_end, myIcon, init_color3, marker);
        					/*if(flag){
        						map.addOverlay(marker);
        					}*/
        				}
        				if(init_marker3!=null){
        					map.removeOverlay(init_marker3);
        				}
        				
        				point_start3 = point_end;
        				init_placeid3 = placeid;
        				point_start3 = marker;
        			}else{
        				point_start3 = point_end;
        				init_placeid3 = placeid;
        				init_marker3 = marker;
        				
        				map.addOverlay(marker);
        			}
            	}
        		
        	}
        };
        
        
        var carClient;
        function initCarWs(){
        	 if(window.WebSocket) {
      			var url =  "ws://sctel-acs.iguyee.cn:1886/stomp";
      			var url3 =  "ws://192.168.1.213:61614/stomp";
      			carClient = Stomp.client(url);
      			carClient.debug = null;
      			carClient.heartbeat.outgoing = 0;
      			carClient.heartbeat.incoming = 10000;
      			carClient.connect("","",connectCarCallback,errorCarCallback);
             }
        }
        initCarWs();
        
        function connectCarCallback (frame) {
        	var topic = "/topic/caraccesslist_online_branch_"+$('#orgid').val();
        	carClient.subscribe(topic, handleCarMq);
		};
        
        function errorCarCallback(){
			setTimeout(function() {
				initCarWs();
			}, 5000);
		};
        
        function handleCarMq(message){
        	var parsedWordArray = CryptoJS.enc.Base64.parse(message.body);
        	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
        	var jo=JSON.parse(msg);
        	var todaySnapCarTotoal_span =document.getElementById("todaySnapCarTotoal");
			var todaySnapCarTotoal_olddata = parseInt(todaySnapCarTotoal_span.innerText.replace(",",""));
			var todaySnapCarTotoal_newdata =  todaySnapCarTotoal_olddata+1;
        	new CountUp(todaySnapCarTotoal, todaySnapCarTotoal_olddata, todaySnapCarTotoal_newdata, 0, 3, options).start();
        	
        	kqdata.unshift(jo);/*unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度�?/
			while (kqdata.length>5)
			{
				kqdata.pop();/*pop() 方法用于删除并返回数组的最后一个元素�?/
			}
			renderPhoto();
        }
        
        var warningClient;
        function initWarningWs(){
        	 if(window.WebSocket) {
      			var url =  "ws://sctel-acs.iguyee.cn:1886/stomp";
      			var url3 =  "ws://192.168.1.213:61614/stomp";
      			warningClient = Stomp.client(url);
      			warningClient.debug = null;
      			warningClient.heartbeat.outgoing = 0;
      			warningClient.heartbeat.incoming = 10000;
      			warningClient.connect("","",connectWarningCallback,errorWarningCallback);
             }
        }
        initWarningWs();
        function connectWarningCallback (frame) {
        	var topic = "/topic/accesslist_warning_branch_"+$('#orgid').val();
        	warningClient.subscribe(topic, handleWarningMq);
		};
        function errorWarningCallback(){
			setTimeout(function() {
				initWarningWs();
			}, 5000);
		};
        function handleWarningMq(message){
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
					background:"#fff",/*背景框颜�?/
					timer:120e3,/*自动关闭对话框的定时器，单位毫秒�?/
					confirmButtonText:'处理'
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
        	};
        	
        	var todayWarningTotal_span =document.getElementById("todayWarningTotal");
			var todayWarningTotal_olddata = parseInt(todayWarningTotal_span.innerText.replace(",",""));
			var todayWarningTotal_newdata =  todayWarningTotal_olddata+1;
        	new CountUp(todayWarningTotal, todayWarningTotal_olddata, todayWarningTotal_newdata, 0, 3, options).start();
        	
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
function info(url){
	alert(2222);
}