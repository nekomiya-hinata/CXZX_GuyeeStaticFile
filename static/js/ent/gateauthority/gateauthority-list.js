var GateauthorityList = function() {
	return {
		initData : function() {
		},
		initPage : function() {
			$("#btn_close").on('click', function () {
	            window.close();
	        });
			
			$('.btn_treeRefresh').on('click', function () {
	            $('#passagewayTree').jstree(true).refresh();
	        });
			$('#btn_search').on('click', function () {
	        	query();
	        });
			$('#btn_Add').on('click', add);
			$("#cleanway").on("click", cleanway);
			
			function query() {
				GateauthorityList.refresh();
	        }
			
			var fastNodeid=null;
			$("#passagewayTree").jstree({
	            "core": {
	                "themes": {"responsive": true},
	                'data' : function (obj, callback) {
	                    var jsonstr="[]";
	                    var jsonarray = eval('('+jsonstr+')');
	                    $.ajax({
	                        type: "GET",
	                        url:ctx + "/ent/gate/gatetree",
	                        dataType:"json",
	                        async: false,
	                        success:function(result) {
	                            var arrays= result;
	                            for(var i=0 ; i<arrays.length; i++){
	                                var arr = {
	                                        "id":arrays[i].id,
	                                        "parent":arrays[i].pid=="root"?"#":arrays[i].pid,
	                                        "text":arrays[i].name,
	                                        "icon":arrays[i].icon,
	                                }
	                                jsonarray.push(arr);
	                            }
	                            fastNodeid=arrays[0].id;
	                        }
	 
	                    });
	                    callback.call(this, jsonarray);
	                }
	            },
	            'types': {
					'root': {"icon": "fa fa-home"},
	                '1': {"icon": "fa fa-table"},
	                '2': {"icon": "fa fa-building"},
					'3': {"icon": "fa fa-building"},
					'6': {"icon": "fa fa-file"},
	            },
	            "plugins": ["contextmenu", "changed", "dnd", "state", "types"],
	            'state': {
	                "opened": true
	            },
	        }).on('changed.jstree', function (e, data) {  
	        	$("#wayid").val(data.instance.get_node(data.selected[0]).id);
	        	$("#selectid").val(data.instance.get_node(data.selected[0]).id);
	        	GateauthorityList.datatable.api().ajax.reload();
	        	if($("#wayid").val() !=null && $("#wayid").val()!= -1 && $("#wayid").val() !="")
	        	trainmain();
	        	
	        	$.ajax({
                    type: "GET",
                    url:ctx + "/ent/gate/getWayBox",
                    dataType:"json",
                    async: false,
                    data:{
                    	id:$("#wayid").val()
                    },
                    success:function(result) {
                    	$("#showbox").html("");
                    	if(result.data != null)
                    	$("#showbox").html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+result.data.rfidreader+"&nbsp;&nbsp;&nbsp;&nbsp;"+result.data.boxid);
                    }
                });
	        });
			
			var trainmain = function(){
				$.ajax({
				    url: ctx + "/ent/gate/authoritysMain",
				    data:{
				    	wayid: $("#wayid").val(),
				    	status : $("#status").val(),
						name : $("#ryname").val()
				    },
				    datatype: "json",
				    success: function(data) {
				    	if (data!=null) {
				    		$("#zrs").html('<span class="counter"  data-value="'+data.zrs+'">0</span>');
				        	$("#yfrs").html('<span class="counter"  data-value="'+data.yfrs+'">0</span>');
				        	$("#wfrs").html('<span class="counter"  data-value="'+data.wfrs+'">0</span>');
				        	$('.counter').counterUp({
				        	    delay: 10,
				        	    time: 1000
				        	});
				        }
				    }
				});
			}
			
			$.extend($.fn.dataTable.defaults, {// 初始化datables
				"searching" : false,
				"ordering" : false,
				"filter" : false,
				"info" : true,
				"paging" : true,
				"lengthChange" : false,
				"processing" : true,
				"lengthMenu" : [ 10 ],// 每页条数
			});
			this.datatable = $('#table').dataTable({
				"serverSide" : true,
				"language" : {
					"url" :ctx + "/static/resource/dataTables.zh_CN.txt"
				},
				"ajax" : {
					"url" :ctx + "/ent/gateauthority/authoritysQuickSearch",
					"type" : "GET",
					"data" : function(params) {// Ajax提交到服务端的请求数据
						params.search_EQ_wayid = $("#wayid").val()=="" ? -1:$("#wayid").val();// 默认加载没有任何条件则查询全部，当单击查询按钮时提交条件查询后台数据库
						params.search_LIKE_massname = $("#param").val();
						return params;
					}
				},
				"fnDrawCallback" : function() {
					this.api().column(0).nodes().each(function(cell, i) {cell.innerHTML = i + 1;});
				},
				"columns" : [{"data" : null,"title" : "序号","width" : "30px","className" : "text-center dt-nowrap"}, 
				    {"data":"photo","title" :"人脸识别","className": "text-center dt-nowrap","width":"80px",
					"render": function ( data, type, row, meta) {
						if(row.photo=="" || row.photo==null || row.photo=="null"){
							return '<a><img width="35px" height="35px" src="'+ctx + '/static/image/nophoto.jpg"> </a>';
						}else{
							return '<a><img width="35px" height="35px" src='+urlFormat(row.photo,35,35)+'> </a>';
						}
					}}, 
				    {"data":"sgryname","title" : "姓名","className" : " text-center dt-nowrap",
				     "render":function(data,type,row,meta){
				    	 return "<a style='text-decoration:none;' target='_blank' href='"+ctx+"/ent/staff/getInfoByMassid?massid="+row.massid+"'>"+data+"</a>";
			    	}},
			    	{"data":"cardno","title":"门禁卡","className":" text-center dt-nowrap"},
			    	{"data":"memo","title":"授权状态","className":" text-center dt-nowrap"},
			    	{"data":"validfrom","title":"有效期(起)","width":"200px","className":"text-center dt-nowrap"},
			    	{"data":"validend","title":"有效期(止)","width":"200px","className":"text-center dt-nowrap"},
			    	{"data":"downloaddt","title":"通道同步时间","className":"text-center dt-nowrap"},
			    	{"data":"feedbackdt","title":"同步成功时间","className":"text-center dt-nowrap"},
			    	{"data":"feedbackstatus","title":"反馈结果","className":"text-center dt-nowrap",
			    	 "mRender": function ( data, type, row, meta) {
							if(row.feedbackstatus==0){
								return '未下发';
							}else if(row.feedbackstatus== -1){
								return '下发失败 ';
							}else if(row.feedbackstatus==1){
								return '下发成功 ';
							}else{
								return '无反馈状态';
							}
						}
			    	},
			    	{"title" :"操作","className": "text-center dt-nowrap","width":"80px",
			    	  "mRender": function ( data, type, row, meta) {
			    		  return `
	                         <a href="javascript:void(0)" class="btn  btn-clean " title="下发" onclick="GateauthorityList.down(${row.id})">
	                           	下发
	                         </a>
	                         <span class="dropdown">
	                             <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown" aria-expanded="true">
	                                 <i class="flaticon-more-1"></i>
	                             </a>
	                             <div class="dropdown-menu dropdown-menu-right">
	                                 <a class="dropdown-item" href="javascript:void(0)" onclick="GateauthorityList.remove(${row.id})"><i class="la la-trash"></i> 移除</a>
	                             </div>
	                         </span>`;
			    	}
			    	}]		
			});
			
			$('#formByGroup').ajaxForm(
					{
						type : 'post',
						url : ctx + '/ent/gate/down',
						dataType : 'json',
						async : true,
						beforeSubmit : function(formData, form, options) {
						},
						success : function(data) {
							form_helpers.unblockUI();
							if (data.success) {
								GateauthorityList.datatable.api().ajax.reload();
								form_helpers.notify(data.msg, '提示','success');
							} else {
								form_helpers.notify(data.msg, '提示','error');
							}
						},
						error : function(data) {
							form_helpers.unblockUI($('#formByGroup'));
							form_helpers.notify('数据提交失败，请检查网络是否畅通!', "提示");
						},
						complete : function(XHR, TS) {
							XHR = null
						}
			});
			
			// 查询事件(查询按钮单击触发事件)
			$('.search').on('click', function() {
				GateauthorityList.datatable.api().ajax.reload(); // 刷新datatable
				trainmain();
			});
			
			function add() {
				//var wayid=$("#wayid").val();
				//window.open(ctx + '/ent/gateauthority/add?id='+wayid);
				window.open(ctx + '/ent/gateauthority/add');
			}
			
			function cleanway() {
				var wayid=$("#wayid").val();
				form_helpers.confirm('确定要清除该通道所有白名单?', function(result) {
					if (result) {
						$.ajax({
							type : "post",
							url : ctx + '/ent/gate/cleanway',
							data : {
								'id' : wayid
							},
							beforeSend : function() {
								form_helpers.blockUI();

							},
							success : function(data) {
								form_helpers.unblockUI();
								if (data.success) {
									GateauthorityList.datatable.api().ajax
											.reload();
									form_helpers.notify(data.msg, '提示',
											'success');
								} else {
									form_helpers.notify(data.msg, '提示',
											'error');
								}
							},
							error : function(data) {
								form_helpers.unblockUI();
								form_helpers.notify('数据获取失败，请检查网络是否畅通!',
										"提示", "error");
							},
							complete : function(XHR, TS) {
								XHR = null
							}
						});
					}
				});
			}
			
			
		},
		// 下发通道白名单
		down:function(id) {
				/*form_helpers.confirm('确定下发?', function(result) {
					if (result) {
					}
				});*/
			form_helpers.blockUI($(document.body));
			$.ajax({
				type : "post",
				url : ctx + '/ent/gate/down',
				data : {
					'id' : id
				},
				beforeSend : function() {
					form_helpers.blockUI();

				},
				success : function(data) {
					form_helpers.unblockUI();
					if (data.success) {
						GateauthorityList.datatable.api().ajax.reload();
						form_helpers.notify(data.msg, '提示','success');
					} else {
						form_helpers.notify(data.msg, '提示','error');
					}
				},
				error : function(data) {
					form_helpers.unblockUI();
					form_helpers.notify('数据获取失败，请检查网络是否畅通!',"提示", "error");
				},
				complete : function(XHR, TS) {
					XHR = null
				}
			});
		},
		refresh: function () {
        	console.log(DemoList.datatable);
        	GateauthorityList.datatable.ajax.reload();
        },
		remove:function(id) {
			/*form_helpers.confirm('确定移除?', function(result) {
				if (result) {
				}
			});*/
			form_helpers.blockUI($(document.body));
			$.ajax({
				type : "post",
				url : ctx + '/ent/gateauthority/delete',
				data : {
					'id' : id
				},
				beforeSend : function() {
					form_helpers.blockUI();

				},
				success : function(data) {
					form_helpers.unblockUI();
					if (data.success) {
						GateauthorityList.datatable.api().ajax
								.reload();
						form_helpers.notify(data.msg, '提示',
								'success');
					} else {
						form_helpers.notify(data.msg, '提示',
								'error');
					}
				},
				error : function(data) {
					form_helpers.unblockUI();
					form_helpers.notify('数据获取失败，请检查网络是否畅通!',
							"提示", "error");
				},
				complete : function(XHR, TS) {
					XHR = null
				}
			});
		},
		
		
		
	}
}();