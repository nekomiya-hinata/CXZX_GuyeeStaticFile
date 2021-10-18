var BoxConfig = function() {
	return {
		initData : function() {
		},
		initPage : function() {
			
			$(".btn_boxlogo").on("click",boxlogo);
			$(".btn_boxvoice").on("click",boxvoice);
			$(".btn_boxface").on("click",boxface);
			$(".btn_boxalarm").on("click",boxalarm);
			
			function boxlogo(){
				form_helpers.confirm('确定下发设备logo?', function(result) {
					if (result == true) {
						$.ajax({
							type : "post",
							url : ctx + '/admin/gate/boxlogo',
							data : {
								'boxid' : $("#boxid").val(),
							},
							success : function(data) {
								if (data.success) {
									form_helpers.notify(data.msg, '提示','success');
								} else {
									form_helpers.notify(data.msg, '提示','error');
								}
							},
							error : function(data) {
								form_helpers.notify('数据获取失败，请检查网络是否畅通!',"提示", "error");
							},
							complete : function(XHR, TS) {
								XHR = null
							}
						});
					}
				});
			};
			
			function boxvoice(){
				form_helpers.confirm('确定下发设备声音数据?', function(result) {
					if (result == true) {
						$.ajax({
							type : "post",
							url : ctx + '/admin/gate/boxvoice',
							data : {
								'boxid' : $("#boxid").val(),
							},
							success : function(data) {
								if (data.success) {
									form_helpers.notify(data.msg, '提示','success');
								} else {
									form_helpers.notify(data.msg, '提示','error');
								}
							},
							error : function(data) {
								form_helpers.notify('数据获取失败，请检查网络是否畅通!',"提示", "error");
							},
							complete : function(XHR, TS) {
								XHR = null
							}
						});
					}
				});
			};
			
			function boxface(){
				form_helpers.confirm('确定下发人脸比对参数?', function(result) {
					if (result == true) {
						$.ajax({
							type : "post",
							url : ctx + '/admin/gate/boxface',
							data : {
								'boxid' : $("#boxid").val(),
							},
							success : function(data) {
								if (data.success) {
									form_helpers.notify(data.msg, '提示','success');
								} else {
									form_helpers.notify(data.msg, '提示','error');
								}
							},
							error : function(data) {
								form_helpers.notify('数据获取失败，请检查网络是否畅通!',"提示", "error");
							},
							complete : function(XHR, TS) {
								XHR = null
							}
						});
					}
				});
			};
			
			function boxalarm(){
				form_helpers.confirm('确定下发报警联动参数?', function(result) {
					if (result == true) {
						$.ajax({
							type : "post",
							url : ctx + '/admin/gate/boxalarm',
							data : {
								'boxid' : $("#boxid").val(),
							},
							success : function(data) {
								if (data.success) {
									form_helpers.notify(data.msg, '提示','success');
								} else {
									form_helpers.notify(data.msg, '提示','error');
								}
							},
							error : function(data) {
								form_helpers.notify('数据获取失败，请检查网络是否畅通!',"提示", "error");
							},
							complete : function(XHR, TS) {
								XHR = null
							}
						});
					}
				});
			};
			
			
			function formatRepo(repo) {
				var markup = "<img name='logotemplateid' id='logotemplateid' width='100' height='80' src='" + repo.url + "'/>";
				
				markup += "<div class='select2-result-repository clearfix'>" +
                "<div class='select2-result-repository'>" +
                "<div class='select2-result-repository__title'>" + repo.templatename + "</div>";
	            
	            markup += "<div class='select2-result-repository__statistics'>" +
                "<div class='select2-result-repository__forks'>描述: </span> " + repo.description + " </div>" +
                "</div>" +
                "</div></div>";
	            return markup;
	        };
	        
	        function formatRepo2(repo) {
				var markup = "<div class='select2-result-repository clearfix'>" +
                "<div class='select2-result-repository'>" +
                "<div class='select2-result-repository__title'>" + repo.templatename + "</div>";
	            
	            markup += "<div class='select2-result-repository__statistics'>" +
                "<div class='select2-result-repository__forks'>描述: </span> " + repo.description + " </div>" +
                "</div>" +
                "</div></div>";
	            return markup;
	        };
	        
	        function formatRepo3(repo) {
				var markup = "<div class='select2-result-repository clearfix'>" +
                "<div class='select2-result-repository'>" +
                "<div class='select2-result-repository__title'>" + repo.templatename + "</div>";
	            
	            markup += "<div class='select2-result-repository__statistics'>" +
                "<div class='select2-result-repository__forks'>描述: </span> " + repo.description + " </div>" +
                "</div>" +
                "</div></div>";
	            return markup;
	        };
		  
		 
	        function formatRepoSelection(repo) {
			  if (repo.templatename!='')
	              return repo.templatename;
			  else
				  return "";
	       	};
			
			$('#logotemplateid').editable({
	            url: ctx+'/admin/boxconfig/save',
	            /*validate: function (value) {
	                if ($.trim(value) == '') 
	                	return '此字段为必填项';
	            },*/
	            params: function(params) {//保存编辑的数据的时候,用于提交的数据
	            	var data = {};
	                data[params.name] = params.value;
	                data["boxid"] = $('#boxid').val();
	                return data;
	            },
	            emptytext : "请选择logo方案",
	            source : function () {//动态获取数据
                    var result = [];
                    $.ajax({
                        url : ctx+'/admin/boxconfig/getBoxLogoTemplateList',
                        async : false,
                        type : "GET",
                        success : function(data) {
                            $.each(data.data,function(i,item){
                            	result.push(item);
                            });
                        }
                    });
                    return result;
                },
                select2 : {
                    allowClear : true,
                    language: "zh-CN",
                    width : '300px',//设置宽
                    templateResult: formatRepo,
					escapeMarkup: function(markup) {
						return markup;
			        },
			        templateSelection: formatRepoSelection,
                    id: function (item) {
                        return item.id;
                    },
                },
                success: function(data, newValue) {
                	if(data.success){
                		if(data.BoxLogoTemplate!=null){
                			$("#logotemplateurl").attr("src",data.BoxLogoTemplate.url);
                			$("#logotemplatedescription").html(data.BoxLogoTemplate.description);
                		}else{
                			$("#logotemplateurl").attr("src","");
                			$("#logotemplatedescription").html("");
                		}
                	}
                	notify(data.msg);
                },
                display: function(value, sourceData) {
                	if(sourceData!=null){
                		if(sourceData.BoxLogoTemplate!=null){
                			var BoxLogoTemplate = sourceData.BoxLogoTemplate;
                			$(this).text(BoxLogoTemplate.templatename); 
                		}else{
                			$(this).text("请选择logo方案"); 
                		}
                	}
                },
	            error:function()
	            {
	            	notify('数据提交失败，请检查网络是否畅通!');
	            },
	        });
			
			$('#voicetemplateid').editable({
	            url: ctx+'/admin/boxconfig/save',
	            params: function(params) {//保存编辑的数据的时候,用于提交的数据
	            	var data = {};
	                data[params.name] = params.value;
	                data["boxid"] = $('#boxid').val();
	                return data;
	            },
	            emptytext : "请选择配音方案",
	            source : function () {//动态获取数据
                    var result = [];
                    $.ajax({
                        url : ctx+'/admin/boxconfig/getBoxVoiceTemplateMList',
                        async : false,
                        type : "GET",
                        success : function(data) {
                            $.each(data.data,function(i,item){
                            	result.push(item);
                            });
                        }
                    });
                    return result;
                },
                select2 : {
                    allowClear : true,
                    language: "zh-CN",
                    width : '300px',//设置宽
                    templateResult: formatRepo2,
					escapeMarkup: function(markup) {
						return markup;
			        },
			        templateSelection: formatRepoSelection,
                    id: function (item) {
                        return item.id;
                    },
                },
                success: function(data, newValue) {
                	if(data.success){
                		if(data.BoxVoiceTemplateM!=null){
                			$("#voicetemplatedescription").html(data.BoxVoiceTemplateM.description);
                		}else{
                			$("#voicetemplatedescription").html("");
                		}
                	}
                	notify(data.msg);
                },
                display: function(value, sourceData) {
                	if(sourceData!=null){
                		if(sourceData.BoxVoiceTemplateM!=null){
                			var BoxVoiceTemplateM=sourceData.BoxVoiceTemplateM;
                			$(this).text(sourceData.BoxVoiceTemplateM.templatename); 
                		}else{
                			$(this).text("请选择配音方案"); 
                		}
                	}
                },
	            error:function()
	            {
	            	notify('数据提交失败，请检查网络是否畅通!');
	            },
	        });
			
			
			$('#paramtemplateid').editable({
	            url: ctx+'/admin/boxconfig/save',
	            params: function(params) {//保存编辑的数据的时候,用于提交的数据
	            	var data = {};
	                data[params.name] = params.value;
	                data["boxid"] = $('#boxid').val();
	                return data;
	            },
	            emptytext : "请选择方案",
	            source : function () {//动态获取数据
                    var result = [];
                    $.ajax({
                        url : ctx+'/admin/boxconfig/getBoxParamTemplateList',
                        async : false,
                        type : "GET",
                        success : function(data) {
                            $.each(data.data,function(i,item){
                            	result.push(item);
                            });
                        }
                    });
                    return result;
                },
                select2 : {
                    allowClear : true,
                    language: "zh-CN",
                    width : '300px',//设置宽
                    templateResult: formatRepo3,
					escapeMarkup: function(markup) {
						return markup;
			        },
			        templateSelection: formatRepoSelection,
                    id: function (item) {
                        return item.id;
                    },
                },
                success: function(data, newValue) {
                	if(data.success){
                		if(data.BoxParamTemplate!=null){
                			$("#paramtemplatedescription").html(data.BoxParamTemplate.description);
                		}else{
                			$("#paramtemplatedescription").html("");
                		}
                	}
                	notify(data.msg);
                },
                display: function(value, sourceData) {
                	if(sourceData!=null){
                		if(sourceData.BoxParamTemplate!=null){
                			var BoxParamTemplate=sourceData.BoxParamTemplate;
                			var uploadmode ="";
                			if(BoxParamTemplate.uploadmode == 1){
                				uploadmode = "人脸与数据库比对成功";
                			}else if(BoxParamTemplate.uploadmode == 2){
                				uploadmode = "人脸与身份证比对成功(人证比对)";
                			}else if(BoxParamTemplate.uploadmode == 4){
                				uploadmode = "IC卡与数据库比对成功";
                			}else if(BoxParamTemplate.uploadmode == 32){
                				uploadmode = "人证比对+入库照片比对";
                			}else{
                				uploadmode = "人脸与IC卡持有人入库照片比对";
                			}
                			
                			var doublecheck ="";
                			if(BoxParamTemplate.doublecheck == 1){
                				doublecheck = "负数：间隔人数比对";
                			}else if(BoxParamTemplate.doublecheck == 2){
                				doublecheck = "零：识别比对";
                			}else{
                				doublecheck = "正数：间隔秒数比对";
                			}
                			
                			var bitstream ="";
                			if(BoxParamTemplate.bitstream == 0){
                				bitstream = "主码流";
                			}else{
                				bitstream = "子码流";
                			}
                			
                			var wgoutenable ="";
                			if(BoxParamTemplate.wgoutenable == 0){
                				wgoutenable = "韦根26输出";
                			}else{
                				wgoutenable = "韦根34输出";
                			}
                			
                			var linefeed = " </br> ";
                			var space = "&nbsp;&nbsp;&nbsp;&nbsp;";
                			var BoxParamTemplateinfo="当前使用方案:"+BoxParamTemplate.templatename+",以下是方案具体信息:"+linefeed
                				BoxParamTemplateinfo+="比对上传方式:"+uploadmode+space
                				BoxParamTemplateinfo+="二次比对方式:"+doublecheck+linefeed
                				BoxParamTemplateinfo+="比对阈值:"+BoxParamTemplate.comparevalue+space
                				BoxParamTemplateinfo+="背景图:"+BoxParamTemplate.fullimage+linefeed
                				BoxParamTemplateinfo+="人脸框开关:"+BoxParamTemplate.facelable+space
                				BoxParamTemplateinfo+="截图码流:"+bitstream+linefeed
                				BoxParamTemplateinfo+="继电器持续时间(毫秒):"+BoxParamTemplate.relaytime+space
                				BoxParamTemplateinfo+="补光灯亮度:"+BoxParamTemplate.lightvalue+linefeed
                				BoxParamTemplateinfo+="韦根输出接口:"+wgoutenable+space
                				BoxParamTemplateinfo+="韦根输出接口:"+BoxParamTemplate.weigandtype+linefeed
                			$(this).html(BoxParamTemplateinfo); 
                		}else{
                			$(this).text("请选择方案"); 
                		}
                	}
                },
	            error:function()
	            {
	            	notify('数据提交失败，请检查网络是否畅通!');
	            },
	        });
			
			$('#alarmsetplateid').editable({
	            url: ctx+'/admin/boxconfig/save',
	            params: function(params) {//保存编辑的数据的时候,用于提交的数据
	            	var data = {};
	                data[params.name] = params.value;
	                data["boxid"] = $('#boxid').val();
	                return data;
	            },
	            emptytext : "请选择报警联动方案",
	            source : function () {//动态获取数据
                    var result = [];
                    $.ajax({
                        url : ctx+'/admin/boxconfig/getBoxAlarmSetTemplateList',
                        async : false,
                        type : "GET",
                        success : function(data) {
                            $.each(data.data,function(i,item){
                            	result.push(item);
                            });
                        }
                    });
                    return result;
                },
                select2 : {
                    allowClear : true,
                    language: "zh-CN",
                    width : '300px',//设置宽
                    templateResult: formatRepo3,
					escapeMarkup: function(markup) {
						return markup;
			        },
			        templateSelection: formatRepoSelection,
                    id: function (item) {
                        return item.id;
                    },
                },
                success: function(data, newValue) {
                	if(data.success){
                		if(data.BoxAlarmSetTemplate!=null){
                			$("#alarmsetplateiddescription").html(data.BoxAlarmSetTemplate.description);
                		}else{
                			$("#alarmsetplateiddescription").html("");
                		}
                	}
                	notify(data.msg);
                },
                display: function(value, sourceData) {
                	if(sourceData!=null){
                		if(sourceData.BoxAlarmSetTemplate!=null){
                			var BoxAlarmSetTemplate=sourceData.BoxAlarmSetTemplate;
                			var whiteio="";
                			var blackio="";
                			var vipio="";
                			var strangerio="";
                			
                			if(BoxAlarmSetTemplate.whiteio == 1){
                				whiteio = "继电器输出";
                			}else{
                				whiteio = "不输出";
                			}
                			
                			if(BoxAlarmSetTemplate.blackio == 1){
                				blackio = "继电器输出";
                			}else{
                				blackio = "不输出";
                			}
                			
                			if(BoxAlarmSetTemplate.vipio == 1){
                				vipio = "继电器输出";
                			}else{
                				vipio = "不输出";
                			}
                			
                			if(BoxAlarmSetTemplate.strangerio == 1){
                				strangerio = "继电器输出";
                			}else{
                				strangerio = "不输出";
                			}
                			
                			var linefeed = " </br> ";
                			var space = "&nbsp;&nbsp;&nbsp;&nbsp;";
                			var BoxAlarmSetTemplateinfo="当前使用方案:"+BoxAlarmSetTemplate.templatename+",以下是方案具体信息:"+linefeed
                				BoxAlarmSetTemplateinfo+="whiteio:"+whiteio+space
                				BoxAlarmSetTemplateinfo+="blackio:"+blackio+linefeed
                				BoxAlarmSetTemplateinfo+="vipio:"+vipio+space
                				BoxAlarmSetTemplateinfo+="strangerio:"+strangerio+linefeed
                				BoxAlarmSetTemplateinfo+="whitevolue:"+BoxAlarmSetTemplate.whitevolue+space
                				BoxAlarmSetTemplateinfo+="blackvolue:"+BoxAlarmSetTemplate.blackvolue+linefeed
                				BoxAlarmSetTemplateinfo+="vipvolue:"+BoxAlarmSetTemplate.vipvolue+space
                				BoxAlarmSetTemplateinfo+="strangervolue:"+BoxAlarmSetTemplate.strangervolue+linefeed
                			$(this).html(BoxAlarmSetTemplateinfo); 
                		}else{
                			$(this).text("请选择报警联动方案"); 
                		}
                	}
                },
	            error:function()
	            {
	            	notify('数据提交失败，请检查网络是否畅通!');
	            },
	        });
			
		}
	}
}();                                                    