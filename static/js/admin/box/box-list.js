"use strict";
// Class definition
var BoxList = function () {

    var initPage = function (that) {
    	$(".btn_add").on('click', add);
		$(".btn_close").on("click", function() {
			window.close();
		});
		
		$('#protocal').select2({
        	placeholder : "请选择设备类型...",
			language:'zh-CN',
			allowClear : true,
			minimumResultsForSearch: -1,
			ajax : {
				url : ctx + "/admin/box/guyeeProtocalEnum",
				dataType : 'json',
				method : 'GET',
				cache : true,
				processResults : function(data, page) {
					var result = [];
					$.each(data, function(index, val) {
						result.push({
							'id' : this.id,
							'text' : this.text 
						});
					});
					return {
						results : result
					};
				}
			}
		});

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
				"url": ctx+"/admin/box/connectSearch",
				"type": "GET",
				"data": function (params) {//Ajax提交到服务端的请求数据
					params.name=$("#param").val();
					params.id=$("#id").val();
					params.protocal=$("#protocal").val();
					return params;
				}
			},
			"fnDrawCallback": function(){this.api().column(0).nodes().each(function(cell, i) {cell.innerHTML =  i + 1;});},
			"columns": [
				{"data" : null,"title" :"序号", "width" : "30px","className": "text-center dt-nowrap" },
				{"data": "status","title" :"设备状态","className": " text-center dt-nowrap",
					"render" : function(data, type, full, meta) {
						//str +="<img src='data:image/gif;base64,"+full.thumbnailStr+"' alt='Base64 encoded image' width='40' height='30'/>";
						if(data == "1"){
							return "<img src='"+ctx+"/static/image/bullet_green.png'>";
						}else{
							return "<img src='"+ctx+"/static/image/bullet_red.png'>";
						}
					}
				},
				{"data": "id","title" :"设备ID","className": " text-center dt-nowrap"},
				{"data": "protocalname","title" :"设备类型","className": " text-center dt-nowrap"},
				{"data": "name","title" :"安装场所","className": " text-center dt-nowrap"},
				{"data": "address","title" :"安装位置","className": " text-center dt-nowrap"},
				{"data": "flag","title" :"是否有效" ,"className": "text-center dt-nowrap",
					"render" : function(data, type, full, meta) {
						return data == "1" ? "是" : "否";
					}
				},
				{"data": "bindflag","title" :"是否绑定网关" ,"className": "text-center dt-nowrap",
					"render" : function(data, type, full, meta) {
						return data == "1" ? "是" : "否";
					}
				},
				{"data": "lasthearttime","title" :"最近心跳时间" ,"className": "text-center dt-nowrap"},
				{"data": "activedate","title" :"盒子激活时间" ,"className": "text-center dt-nowrap"},
				{"title" :"操作","className": "text-center dt-nowrap","width":"100px","mRender": function ( data, type, row, meta) {
						/*if(row.RfidreaderName !="基础设备远距读卡"){
                            return '<a onclick=BoxList.way(\"'+row.id+'\")>配置通道</a>';
                        }else{
                            return '<a  onclick=BoxList.test(\"'+row.id+'\")>测试</a>';
                        }*/
					return `
	                    <a href="javascript:void(0)" class="btn  btn-clean " title="修改" onclick="BoxList.edit(\'${row.id}\')">
	                      	修改
	                    </a>
	                    <a href="javascript:void(0)" class="btn  btn-clean " title="删除" onclick="BoxList.del(\'${row.id}\')">
	                      	删除
	                    </a>`;
						/*return `<div class="btn-group">
									<span class="dropdown">
										<a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown" aria-expanded="true">
											配置通道&nbsp;&nbsp;
										</a>
										<div class="dropdown-menu dropdown-menu-right">
											<a class="dropdown-item" href="javascript:void(0);" onclick="BoxList.carway(\'${row.id}\')"> 车辆通道</a>
											<a class="dropdown-item" href="javascript:void(0);" onclick="BoxList.faceway(\'${row.id}\')" > 人脸通道</a>
										</div>
									</span>
								</div>
								<div class="btn-group" style="margin-top:0px">
									<span class="dropdown">
										<a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown" aria-expanded="true">
											<i class="flaticon-more-1"></i>
										</a>
										<div class="dropdown-menu dropdown-menu-right">
											<a class="dropdown-item" href="javascript:void(0)" onclick="BoxList.edit(\'${row.id}\')"><i class="la la-edit"></i> 修改</a>
											<a class="dropdown-item" href="javascript:void(0)" onclick="BoxList.del(\'${row.id}\')"><i class="la la-trash"></i> 删除</a>
                            			</div>
									</span>
								</div>`;*/
				}}]
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
			BoxList.refresh();
		});

		function add(){
			window.open(ctx.concat("/admin/box/add"));
		}
		
		$('.btn_reset').on('click',function(){
			$('#searchForm')[0].reset();
			$("#protocal").select2("val", [""]);
		});
    }
	
	return {
        init: function () {
            initPage.apply(this);
        },
        edit:function(id,protocal){
			window.open(ctx + '/admin/box/edit?id=' + id);
		},
		refresh: function () {
			BoxList.datatable.api().ajax.reload();
        },
		del: function (id) {
			form_helpers.confirm('确定删除?', function(result) {
				if (result.value == true) {
					form_helpers.blockUI($(document.body));
						$.ajax({
							type : "POST",
							url: ctx + "/admin/box/delete",
							data : {
								'id' : id,
							},
							success : function(data) {
								form_helpers.unblockUI($(document.body));
								if (data.success) {
									BoxList.refresh();
									form_helpers.notify(data.msg, '提示','success');
								} else {
									form_helpers.notify(data.msg, '提示','error');
								}
							},
							error : function(data) {
								form_helpers.unblockUI($(document.body));
								form_helpers.notify('数据获取失败，请检查网络是否畅通!',"提示", "error");
							},
							complete : function(XHR, TS) {
								XHR = null
							}
						});
				}
			});
		},
		carway:function(id)
		{
			window.open(ctx.concat("/admin/guyeecarpassageway/waylist?boxid="+id));
		},
		faceway:function(id){
			window.open(ctx.concat("/admin/gate/waylist?boxid="+id));
		},
		view:function(id,protocal)
		{
			window.open(ctx.concat("/admin/box/info?id=", id));
		}
    };

}();

jQuery(document).ready(function () {
	BoxList.init();
});