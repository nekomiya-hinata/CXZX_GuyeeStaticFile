"use strict";
var track = function () {

    var initPage = function (that) {
    	$("#files").change(function(){
		    $("#dispimg").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
		$(".form_datetime").datetimepicker({
			language : 'zh-CN',
	        format: "yyyy-mm-dd hh:ii:ss",
	        autoclose: true,
	        todayBtn: true,
	        size:'mini',
	        minuteStep:5,
	        endDate:new Date()
	    });
    	
    	var map = new BMap.Map("allmap",{enableMapClick:false});
    	var longitude = $("#longitude").val();
    	var latitude = $("#latitude").val();
    	var cityname = $("#cityname").val();
    	var point = new BMap.Point(longitude,latitude);/*104.528045,28.439575高县人民医院   104.53778,28.439461 高县市政广场 */
    	map.centerAndZoom(point, 17);
    	//map.setCurrentCity(cityname); 
    	map.enableScrollWheelZoom(true);/*开启鼠标滚轮缩放*/
    	
    	/*鼠标离开地图 地图禁止缩放*/
    	function div_onmouseover(){
    		this.map.disableScrollWheelZoom(true);
    	};
    	/*鼠标放在地图上 地图可以缩放*/
    	function div_onmouseout(){
    		this.map.enableScrollWheelZoom(true);
    	};
    	
    	/*覆盖物构造方法*/
    	function ComplexCustomOverlay(point,index){
    	    this._point = point;
    	    this._index = index;
    	};
    	
    	ComplexCustomOverlay.prototype = new BMap.Overlay();
    	ComplexCustomOverlay.prototype.initialize = function(map){
    		this._map = map;
    		var span=this._span=document.createElement("span");
    		/*这里用jquery设置样式*/
    		 $(span).css({   
    			'position':'absolute',
    			'zIndex':BMap.Overlay.getZIndex(this._point.lat),
    			'display':'block',
    			'width':'26px',
    			'color':'#FFF',
    			'text-align':'center',
    			'point-events':'none'
    			});
    	 　　	/*设置数字也就是我们的标注*/
    		this._span.innerHTML=this._index;
    		map.getPanes().labelPane.appendChild(span);
    		return span;
    	};
    	
    	ComplexCustomOverlay.prototype.draw = function(){
    		var map = this._map;
    		var pixel = map.pointToOverlayPixel(this._point);
    		/*设置自定义覆盖物span 与marker的位置*/
    		this._span.style.left = pixel.x-10+'px';
    		this._span.style.top  = pixel.y-14+'px';
    	};
    	
    	/*添加点*/
    	function addMarker(point,type){
    		/*设置不同点的背景图（红色和绿色两个图片）*/
    		if(type=='red'){
    			var myIcon=new BMap.Icon(ctx+'/static/image/red.png',new BMap.Size(29,38));/*bullet_red.png*/
    			var marker = new BMap.Marker(point);
    			marker.setIcon(myIcon);
    			map.addOverlay(marker);
    		}else{
    			var myIcon=new BMap.Icon(ctx+'/static/image/green.png',new BMap.Size(29,38));/*bullet_green.png*/
    			var marker = new BMap.Marker(point);
    			marker.setIcon(myIcon);
    			map.addOverlay(marker);
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
    	/**目标人员查询*/
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
    	/**相似人员列表*/
    	function personControl(){
   		   /*this.defaultAnchor = BMAP_ANCHOR_BOTTOM_LEFT;*/
   		   /*this.defaultOffset = new BMap.Size(10,0);距离右边距离,距离顶部距离*/   		   
    	   this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
 		   this.defaultOffset = new BMap.Size(260,10);/*距离右边距离,距离顶部距离*/
   		};
      	personControl.prototype = new BMap.Control();
      	personControl.prototype.initialize = function(map){
       		 var person = document.getElementById("personControl")
       		 map.getContainer().appendChild(person);
       		 return person;
       	};
       	var personZoomCtrl = new personControl();
       	map.addControl(personZoomCtrl);
       	/**通行记录*/
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
     	
     	/*这个方法好像没有使用了*/
     	/**
     	function loadTrack(){
    		$.ajax({
    			type : "GET",
    			url :ctx + "/gov/accesslist/getPersonTrack",
    			success : function(data) {
    				var points = [];
    				clear();
    				if(data!=null){
    					var detail_template = Handlebars.compile($("#detail_template").html());
    		    		var detail_html = detail_template(data.data);
    	    			$('#detail').html(detail_html);
    					$.each(data.data, function (index, item) {
    						var point = new BMap.Point(this.lng, this.lat);
    						addMarker(point,'red');
    						var myCompOverlay = new ComplexCustomOverlay(point,(index+1));
    						map.addOverlay(myCompOverlay); 
    					  	points[index]=point;
    					});
    				}
    				if(points.length>0){
    					map.setViewport(points);
    					var polyline =new BMap.Polyline(points, {
    						enableEditing: false,//是否启用线编辑，默认为false
    						enableClicking: false,//是否响应点击事件，默认为true
    						//icons:[icons],
    						strokeWeight:'6',//折线的宽度，以像素为单位
    						strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
    						strokeColor:"#18a45b" //折线颜色
    					});
    					polyline.setStrokeStyle("solid");//dashed虚线  solid实线
    					map.addOverlay(polyline);
    				}
    			},
    			error : function(data) {
    				 notify('数据获取失败，请检查网络是否畅通!');
    			},
    			complete : function(XHR, TS) {
    				XHR = null
    			}
    		});
     	}**/
     	 
     	/*获取相似人员列表*/
     	 form_helpers.parsley($('#form'));
     	 $('#form').ajaxForm({
     		url :ctx + "/gov/accesslist/searchSimilarityPerson",
			dataType : 'json',
			type : 'POST',
			beforeSubmit : function(formData, form, options) {
				form_helpers.blockUI($('#form'));
			},
			error : function(data, textStatus, errorThrown) {
				form_helpers.unblockUI($('#form'));
			},
			success : function(data) {
				form_helpers.unblockUI($('#form'));
				if(data!=null){
					document.getElementById("personDetail").scrollTop = 0;
					$('#personControl').show();
					$('#person_title').html("共查询到<span style='color:red;'>"+data.pageTotal+"</span>个结果");
					var personDetail_template = Handlebars.compile($("#persondetail_template").html());
					var parsedWordArray = CryptoJS.enc.Base64.parse(data.data);
	                var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
	                var result=JSON.parse(msg);
		    		var personDetail_html = personDetail_template(result);
	    			$('#personDetail').html(personDetail_html);
				};
			}
     	 });	
     	 
     	$("#btn_reset").on('click',reset);
     	function reset() {
    		$('#form')[0].reset();
    		$("#dispimg").attr("src",ctx+"/static/image/noimg.jpg");
    		$('#personControl').hide();
    		$('#waterControl').hide();
    		document.getElementById("personDetail").scrollTop = 0;
    		clear();
		};
		
		this.searchTrack = function searchTrack(personid, persontype){
			$('#water_title').html("数据加载中");
			$('#detail').html("");
			$.ajax({
    			type : "GET",
    			url :ctx + "/gov/accesslist/searchTrack?personid="+personid+"&persontype="+persontype+"&sdate="+$("#sdate").val()+"&edate="+$("#edate").val(),
    			success : function(data) {
    				var points = [];
    				clear();
    				if(data!=null){
    					$('#waterControl').show();
    					$('#water_title').html("共查询到<span style='color:red;'>"+data.pageTotal+"</span>条抓拍记录");
    					var detail_template = Handlebars.compile($("#detail_template").html());
    					
    					var parsedWordArray = CryptoJS.enc.Base64.parse(data.data);
    		        	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
    		        	var contentdata=JSON.parse(msg);
    					
    		    		var detail_html = detail_template(contentdata);
    	    			$('#detail').html(detail_html);
    					$.each(contentdata, function (index, item) {
    						var point = new BMap.Point(this.lng, this.lat);
    						addMarker(point,'red');
    						var myCompOverlay = new ComplexCustomOverlay(point,(index+1));
    						map.addOverlay(myCompOverlay); 
    					  	points[index]=point;
    					});
    				}
    				if(points.length>0){
    					map.setViewport(points);
    					var polyline =new BMap.Polyline(points, {
    						enableEditing: false,/*是否启用线编辑，默认为false*/
    						enableClicking: false,/*是否响应点击事件，默认为true*/
    						/*icons:[icons],*/
    						strokeWeight:'6',/*折线的宽度，以像素为单位*/
    						strokeOpacity: 0.8,/*折线的透明度，取值范围0 - 1*/
    						strokeColor:"#18a45b" /*折线颜色*/
    					});
    					polyline.setStrokeStyle("solid");/*dashed虚线  solid实线*/
    					map.addOverlay(polyline);
    				}
    			},
    			error : function(data) {
    				 notify('数据获取失败，请检查网络是否畅通!');
    			},
    			complete : function(XHR, TS) {
    				XHR = null;
    			}
    		});
		};
		
		this.personInfo = function personInfo(personid, persontype){
			$.ajax({
    			type : "get",
    			dataType : "text",
    			url :ctx + "/gov/accesslist/getPersonInfo?personid="+personid+"&persontype="+persontype,
    			success : function(result) {
    				var parsedWordArray = CryptoJS.enc.Base64.parse(result);
    	        	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
    	        	var data=JSON.parse(msg);
    				var html = "<p align='left' style='font-size: 14px;'>姓名:"+data.name+"</p>"
    				+"<p align='left' style='font-size: 14px;'>性别:"+(data.sex==null?"":data.sex)+"</p>"
    				+"<p align='left' style='font-size: 14px;'>年龄:"+(data.age==null?"":data.age)+"</p>"
    				+"<p align='left' style='font-size: 14px;'>电话:"+(data.mobile==null?"":data.mobile)+"</p>"
    				+"<p align='left' style='font-size: 14px;'>民族:"+(data.nation==null?"":data.nation)+"</p>"
    				+"<p align='left' style='font-size: 14px;'>证件号码:"+(data.idcode==null?"":data.idcode)+"</p>"
    				+"<p align='left' style='font-size: 14px;'>数据来源:"+(data.source==null?"":data.source)+"</p>"
    				+"<p align='left' style='font-size: 14px;'>最近出入:"+(data.lastkqtime==null?"":data.lastkqtime)+"</p>"
    				+"<p align='left' style='font-size: 14px;'>地址信息:"+(data.address==null?"":data.address)+"</p>";
    				Swal.fire({
    	    			title:"人员信息",
    	    			html:html,
    	    			background:"#fff",/*背景框颜色*/
    	    		}).then(function(e){
    	    			"timer"===e.dismiss&&console.log("I was closed by the timer");
    	    		});
    			},
    			error : function(data) {
    				 notify('数据获取失败，请检查网络是否畅通!');
    			},
    			complete : function(XHR, TS) {
    				XHR = null;
    			}
    		});
		}
    };

    return {
        init: function () {
            initPage.apply(this);
        },
        searchTrack: function(massid, persontype){
        	track.searchTrack(massid, persontype);
		},
		personInfo: function(massid, persontype){
        	track.personInfo(massid, persontype);
		}
    };
}();

jQuery(document).ready(function () {
    track.init();
});