"use strict";
// Class definition
var BoxStatusList = function () {

    var initPage = function (that) {
    	
    	 /*$(".form_datetime").datetimepicker({
			language : 'zh-CN',
	        format: "yyyy-mm-dd",//yyyy-mm-dd hh:ii
	        //showMeridian: true,
	        autoclose: true,
	        todayBtn: true,
	        size:'mini',
	        minuteStep:5,
	        endDate:new Date()
	    });*/
    
	    $('.form_datetime').datepicker({
			language : 'zh-CN',
			autoclose : false,
			todayBtn : true,
			format : 'yyyy-mm-dd'
		});
    
	    /*$(".form_datetime").datetimepicker({
			language : 'zh-CN',
	        format: "yyyy-mm-dd hh:ii",
	        autoclose: true,
	        todayBtn: true,
	        size:'mini',
	        minuteStep:5,
	        endDate:new Date()
	    });*/

    	var data = [{ id: 0, text: '全部' },{ id: 1, text: '在线' }, { id: -1, text: '离线' }];
    	$('#onlineflag').select2({
        	placeholder : "请选择设备类型...",
        	data: data
		});
    	
    	var orderflagdata = [{ id: 1, text: '状态时间倒序' },{ id: 2, text: '状态时间正序' },{ id: 3, text: '日志时间倒序' },{ id: 4, text: '日志时间正序' }];
    	$('#orderflag').select2({
        	placeholder : "排序规则...",
        	data: orderflagdata
		});
    	
    	function loadKpi(){
    		$.ajax({  
        		type: 'get',  
        		dataType: 'text', 
        		url :  ctx+"/admin/boxck/boxckkpi",
        		success : function(data){ 
                	var result=JSON.parse(data);
        			$('#boxcktotal').html('<span class="counter"  data-value="'+result.total+'">0</span>');
        			$('#boxckonline').html('<span class="counter"  data-value="'+result.online+'">0</span>');
        			$('#boxckoffline').html('<span class="counter"  data-value="'+result.offline+'">0</span>');
        			$('.counter').counterUp({
    	        	    delay: 10,
    	        	    time: 1000
    	        	});
        		}
        	});
    	}
    	loadKpi();
    	
		$.extend($.fn.dataTable.defaults, {
			"searching": false,
			"ordering":  false,
			"filter" : false,
			"info": true,
			"paging": true,
			"lengthChange": false,
			"processing" : true,
			"lengthMenu": [10],//每页条数
		});
		
		this.datatable=$('#table').dataTable({
			"serverSide": true,
			"language": {"url": ctx+"/static/resource/dataTables.zh_CN.txt"},
			"ajax": {
				"url": ctx+"/admin/boxck/quickSearch",
				"type": "GET",
				"data": function (params) {//Ajax提交到服务端的请求数据
					params.search_LIKE_devicemac=$("#param").val();
					params.search_LIKE_softversion=$("#softversion").val();
					params.online=$("#onlineflag").val();
					params.begin=$("#begin").val();
					params.end=$("#end").val();
					params.orderflag=$("#orderflag").val();
					return params;
				}
			},
			"fnDrawCallback": function(){this.api().column(0).nodes().each(function(cell, i) {cell.innerHTML =  i + 1;});},
			"columns": [
				{"data" : null,"title" :"序号", "width" : "30px","className": "text-center dt-nowrap" },
				{"data": "online","title" :"设备状态","className": " text-center dt-nowrap",
					"render" : function(data, type, full, meta) {
						if(data == "1"){
							return "<img src='"+ctx+"/static/image/bullet_green.png'>";
						}else{
							return "<img src='"+ctx+"/static/image/bullet_red.png'>";
						}
					}
				},
				{"data": "devicemac","title" :"设备MAC","className": " text-center dt-nowrap"},
				{"data": "softversion","title" :"版本","className": " text-center dt-nowrap"},
				{"data": "createdDate","title" :"创建时间" ,"className": "text-center dt-nowrap"},
				{"data": "statusuptime","title" :"状态更新时间" ,"className": "text-center dt-nowrap"},
				{"data": "loguptime","title" :"日志更新时间" ,"className": "text-center dt-nowrap"},
				{"data": "logip","title" :"IP" ,"className": "text-center dt-nowrap"},
				{"data": "logipaddress","title" :"IP位置" ,"className": "text-center dt-nowrap"},
				{"data": "uptimestr","title" :"运行时长" ,"className": "text-center dt-nowrap"},
				{"data": "","className": "text-center dt-nowrap ","width": "160px","title": "操作",
					render: function (data, type, row, meta) {
						return `
							<a href="javascript:void(0)" class="btn  btn-clean " title="状态" onclick="BoxStatusList.boxstatus(\'${row.id}\')">
                          		状态
                        	</a>
                        	<a href="javascript:void(0)" class="btn  btn-clean " title="日志" onclick="BoxStatusList.boxdog(\'${row.id}\')">
                      			日志
							</a>`;
                
					}
				}]
			});
		
		// 选中行算法
		$('#table tbody').on('click', 'tr', function() {
			if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
			} else {
				$('#table tr.selected').removeClass('selected');
				$(this).addClass('selected');
			}
		});
		
		//查询事件
		$('.btn_search').on('click',function(){
			BoxStatusList.refresh();
		});
		
		$('.btn_reset').on('click',function(){
			$('#searchForm')[0].reset();
			$("#protocal").select2("val", [""]);
		});
    }
	
	return {
        init: function () {
            initPage.apply(this);
        },
        boxstatus:function(deviceid){
			window.open(ctx + '/admin/boxstatus?deviceid=' + deviceid);
		},
        boxdog:function(deviceid){
			window.open(ctx + '/admin/boxdog?deviceid=' + deviceid);
		},
		refresh: function () {
			BoxStatusList.datatable.api().ajax.reload();
        }
    };

}();

jQuery(document).ready(function () {
	BoxStatusList.init();
});