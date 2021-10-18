var WayInfo = function () {
	return {
		   initData : function () {
		    	
		   },
		   initPage : function () {
			   
			    $(".btn_config").on('click', config);
				$(".btn_retime").on('click', timing);// 为每个超链接绑定函数
				$(".btn_restartsys").on('click',restartsys);
				$(".btn_restartapp").on("click", restartapp);
				$(".btn_addphoto").on("click",addphoto);
				$(".btn_addimage").on("click",addimage);
				$(".btn_opendoor").on("click",opendoor);
				$(".btn_delface").on("click",delface);
				$(".btn_delpng").on("click",delpng);
				$(".btn_getmessage").on("click",getmessage);
				$(".btn_localkq").on("click",localkq);
				$(".btn_getface").on("click",getface);
				$(".btn_selectface").on("click",selectface);
				
				$(".btn_UIcofi").on("click",UIcofi);
				$(".btn_facecofi").on("click",facecofi);
				
				$(".btn_close").on("click", function() {
					window.close();
				});
				
			
			function config(){
				form_helpers.confirm('确定配置?', function(result) {
					if (result == true) {
						$.ajax({
							type : "post",
							url : ctx + '/admin/gate/config',
							data : {
								'id' : $("#wayid").val()
							},
							success : function(data) {
								if (data.success) {
									form_helpers.notify(data.msg, '提示',
											'success');
								} else {
									form_helpers.notify(data.msg, '提示',
											'error');
								}
							},
							error : function(data) {
								form_helpers.notify('数据获取失败，请检查网络是否畅通!',
										"提示", "error");
							},
							complete : function(XHR, TS) {
								XHR = null
							}
						});
					}
				});
			};
			
			function timing(){
				form_helpers.confirm('确定校时?', function(result) {
					if (result == true) {
						$.ajax({
							type : "post",
							url : ctx + '/admin/gate/timing',
							data : {
								'id' : $("#wayid").val()
							},
							success : function(data) {
								if (data.success) {
									form_helpers.notify(data.msg, '提示',
											'success');
								} else {
									form_helpers.notify(data.msg, '提示',
											'error');
								}
							},
							error : function(data) {
								form_helpers.notify('数据获取失败，请检查网络是否畅通!',
										"提示", "error");
							},
							complete : function(XHR, TS) {
								XHR = null
							}
						});
					}
				});
			};
			
			function restartsys(){
				form_helpers.confirm('确定重启系统?', function(result) {
					if (result == true) {
						$.ajax({
							type : "post",
							url : ctx + '/admin/gate/reboot',
							data : {
								'boxid' : $("#boxid").val()
							},
							success : function(data) {
								if (data.success) {
									form_helpers.notify(data.msg, '提示',
											'success');
								} else {
									form_helpers.notify(data.msg, '提示',
											'error');
								}
							},
							error : function(data) {
								form_helpers.notify('数据获取失败，请检查网络是否畅通!',
										"提示", "error");
							},
							complete : function(XHR, TS) {
								XHR = null
							}
						});
					}
				});
			};
			
			function restartapp(){
				form_helpers.confirm('确定重启APP?', function(result) {
					if (result == true) {
						$.ajax({
							type : "post",
							url : ctx + '/admin/gate/rebootApp',
							data : {
								'boxid' : $("#boxid").val()
							},
							success : function(data) {
								if (data.success) {
									form_helpers.notify(data.msg, '提示',
											'success');
								} else {
									form_helpers.notify(data.msg, '提示',
											'error');
								}
							},
							error : function(data) {
								form_helpers.notify('数据获取失败，请检查网络是否畅通!',
										"提示", "error");
							},
							complete : function(XHR, TS) {
								XHR = null
							}
						});
					}
				});
			};
			
			function addphoto(){
				form_helpers.confirm('确定抓拍照片上传?', function(result) {
					if (result == true) {
						$.ajax({
							type : "post",
							url : ctx + '/admin/gate/remoteSnap',
							data : {
								'boxid' : $("#boxid").val(),
								'type' : 0
							},
							success : function(data) {
								if (data.success) {
									form_helpers.notify(data.msg, '提示',
											'success');
								} else {
									form_helpers.notify(data.msg, '提示',
											'error');
								}
							},
							error : function(data) {
								form_helpers.notify('数据获取失败，请检查网络是否畅通!',
										"提示", "error");
							},
							complete : function(XHR, TS) {
								XHR = null
							}
						});
					}
				});
			};
			
			function addimage(){
				form_helpers.confirm('确定截屏上传?', function(result) {
					if (result == true) {
						$.ajax({
							type : "post",
							url : ctx + '/admin/gate/remoteSnap',
							data : {
								'boxid' : $("#boxid").val(),
								'type' : 1
							},
							success : function(data) {
								if (data.success) {
									form_helpers.notify(data.msg, '提示',
											'success');
								} else {
									form_helpers.notify(data.msg, '提示',
											'error');
								}
							},
							error : function(data) {
								form_helpers.notify('数据获取失败，请检查网络是否畅通!',
										"提示", "error");
							},
							complete : function(XHR, TS) {
								XHR = null
							}
						});
					}
				});
			};
			
			function opendoor(){
				form_helpers.confirm('确定远程开门?', function(result) {
					if (result == true) {
						$.ajax({
							type : "post",
							url : ctx + '/admin/gate/remoteOpen',
							data : {
								'boxid' : $("#boxid").val()
							},
							success : function(data) {
								if (data.success) {
									form_helpers.notify(data.msg, '提示',
											'success');
								} else {
									form_helpers.notify(data.msg, '提示',
											'error');
								}
							},
							error : function(data) {
								form_helpers.notify('数据获取失败，请检查网络是否畅通!',
										"提示", "error");
							},
							complete : function(XHR, TS) {
								XHR = null
							}
						});
					}
				});
			};
			
			function delface(){
				form_helpers.confirm('确定删除所有人脸?', function(result) {
					if (result == true) {
						$.ajax({
							type : "post",
							url : ctx + '/admin/gate/clearAllFace',
							data : {
								'boxid' : $("#boxid").val()
							},
							success : function(data) {
								if (data.success) {
									form_helpers.notify(data.msg, '提示',
											'success');
								} else {
									form_helpers.notify(data.msg, '提示',
											'error');
								}
							},
							error : function(data) {
								form_helpers.notify('数据获取失败，请检查网络是否畅通!',
										"提示", "error");
							},
							complete : function(XHR, TS) {
								XHR = null
							}
						});
					}
				});
			};
			
			function delpng(){
				form_helpers.confirm('删除本地图片?', function(result) {
					if (result == true) {
						$.ajax({
							type : "post",
							url : ctx + '/admin/gate/clearLocalImg',
							data : {
								'boxid' : $("#boxid").val()
							},
							success : function(data) {
								if (data.success) {
									form_helpers.notify(data.msg, '提示',
											'success');
								} else {
									form_helpers.notify(data.msg, '提示',
											'error');
								}
							},
							error : function(data) {
								form_helpers.notify('数据获取失败，请检查网络是否畅通!',
										"提示", "error");
							},
							complete : function(XHR, TS) {
								XHR = null
							}
						});
					}
				});
			};
			
			
			function getmessage(){
				form_helpers.confirm('确认获取设备信息?', function(result) {
					if (result == true) {
						$.ajax({
							type : "post",
							url : ctx + '/admin/gate/boxInfo',
							data : {
								'boxid' : $("#boxid").val()
							},
							success : function(data) {
								if (data.success) {
									form_helpers.notify(data.msg, '提示',
											'success');
								} else {
									form_helpers.notify(data.msg, '提示',
											'error');
								}
							},
							error : function(data) {
								form_helpers.notify('数据获取失败，请检查网络是否畅通!',
										"提示", "error");
							},
							complete : function(XHR, TS) {
								XHR = null
							}
						});
					}
				});
			};
			
			function localkq(){
				form_helpers.confirm('确认上传本地考勤记录?', function(result) {
					if (result == true) {
						$.ajax({
							type : "post",
							url : ctx + '/admin/gate/boxDB',
							data : {
								'boxid' : $("#boxid").val()
							},
							success : function(data) {
								if (data.success) {
									form_helpers.notify(data.msg, '提示',
											'success');
								} else {
									form_helpers.notify(data.msg, '提示',
											'error');
								}
							},
							error : function(data) {
								form_helpers.notify('数据获取失败，请检查网络是否畅通!',
										"提示", "error");
							},
							complete : function(XHR, TS) {
								XHR = null
							}
						});
					}
				});
			};
			
			function getface(){
				form_helpers.confirm('确认获取人脸参数?', function(result) {
					if (result == true) {
						$.ajax({
							type : "post",
							url : ctx + '/admin/gate/getFaceDetecParam',
							data : {
								'boxid' : $("#boxid").val()
							},
							success : function(data) {
								if (data.success) {
									form_helpers.notify(data.msg, '提示',
											'success');
								} else {
									form_helpers.notify(data.msg, '提示',
											'error');
								}
							},
							error : function(data) {
								form_helpers.notify('数据获取失败，请检查网络是否畅通!',
										"提示", "error");
							},
							complete : function(XHR, TS) {
								XHR = null
							}
						});
					}
				});
			};
			
			function selectface(){
				form_helpers.confirm('确认查询指定人脸?', function(result) {
					if (result == true) {
						$.ajax({
							type : "post",
							url : ctx + '/admin/gate/queryUser',
							data : {
								'boxid' : $("#boxid").val(),
								'ryid' : $("#ryid").val(),
							},
							success : function(data) {
								if (data.success) {
									form_helpers.notify(data.msg, '提示',
											'success');
								} else {
									form_helpers.notify(data.msg, '提示',
											'error');
								}
							},
							error : function(data) {
								form_helpers.notify('数据获取失败，请检查网络是否畅通!',
										"提示", "error");
							},
							complete : function(XHR, TS) {
								XHR = null
							}
						});
					}
				});
			};
			
			function UIcofi(){
				var wayid=$("#wayid").val();
				window.open(ctx.concat("/admin/gate/uiconfi?wayid="+wayid));
			}
			
			function facecofi(){
				var boxid=$("#boxid").val();
				window.open(ctx.concat("/admin/gate/facecofi?boxid="+boxid));
			}
			
			
			function close(){
				window.close();
			}
			
			
		    }
		    
	    };

}();                          