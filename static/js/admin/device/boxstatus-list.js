"use strict";
// Class definition
var BoxStatusList = function () {

    var initPage = function (that) {

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
				"url": ctx+"/admin/boxstatus/quickSearch",
				"type": "GET",
				"data": function (params) {//Ajax提交到服务端的请求数据
					/*params.search_LIKE_devicemac=$("#param").val();
					params.search_LIKE_softversion=$("#softversion").val();*/
					params.search_EQ_deviceid=$("#deviceid").val();
					return params;
				}
			},
			"fnDrawCallback": function(){this.api().column(0).nodes().each(function(cell, i) {cell.innerHTML =  i + 1;});},
			"columns": [
				{"data" : null,"title" :"序号", "width" : "30px","className": "text-center dt-nowrap" },
				{"data": "status","title" :"sdstatus","className": " text-center dt-nowrap"
					/*"render" : function(data, type, full, meta) {
						if(data == "OK"){
							return "<img src='"+ctx+"/static/image/bullet_green.png'>";
						}else{
							return "<img src='"+ctx+"/static/image/bullet_red.png'>";
						}
					}*/
				},
				{"data": "devicemac","title" :"设备MAC","className": " text-center dt-nowrap"},
				{"data": "netip","title" :"IP","className": " text-center dt-nowrap"},
				{"data": "softversion","title" :"版本","className": " text-center dt-nowrap"},
				{"data": "uploadcapoknum","title" :"上传成功数量","className": " text-center dt-nowrap"},
				{"data": "sdkcapnum","title" :"系统抓拍数量","className": " text-center dt-nowrap"},
				{"data": "boardname","title" :"boardname" ,"className": "text-center dt-nowrap"},
				{"data": "sdtotal","title" :"sdtotal" ,"className": "text-center dt-nowrap"},
				{"data": "sdfree","title" :"sdfree" ,"className": "text-center dt-nowrap"},
				{"data": "recordmode","title" :"recordmode" ,"className": "text-center dt-nowrap"},
				{"data": "noregresponse","title" :"noregresponse" ,"className": "text-center dt-nowrap"},
				{"data": "facetotal","title" :"人脸总数" ,"className": "text-center dt-nowrap"},
				{"data": "recordtotal","title" :"记录总数" ,"className": "text-center dt-nowrap"},
				{"data": "mjenable","title" :"魔镜使能开关" ,"className": "text-center dt-nowrap"},
				{"data": "mjaienable","title" :"魔镜AI使能开关" ,"className": "text-center dt-nowrap"},
				{"data": "mjaicode","title" :"魔镜AI错误码" ,"className": "text-center dt-nowrap"},
				{"data": "devicetime","title" :"设备时间" ,"className": "text-center dt-nowrap"},
				/*{"data": "uptime","title" :"运行时间" ,"className": "text-center dt-nowrap"},*/
				{"data": "uptimestr","title" :"运行时长" ,"className": "text-center dt-nowrap"},
				{"data": "logip","title" :"IP" ,"className": "text-center dt-nowrap"}
				/*{"data": "logipaddress","title" :"IP位置" ,"className": "text-center dt-nowrap"}
				{"data": "","className": "text-center dt-nowrap ","width": "160px","title": "操作",
					render: function (data, type, row, meta) {
						return `<a href="javascript:void(0)" class="btn  btn-clean " title="设备日志" onclick="BoxStatusList.boxdog(\'${row.deviceid}\')">
                      				设备日志
								</a>`;
                
					}
				}*/]
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