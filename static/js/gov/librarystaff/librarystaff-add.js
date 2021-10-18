var VenueAdd = function () {
		initData= function ()  {
			
		},
		initPage= function () {
			  	var $form = $('#form');		

				$("#btn_close").on('click',close);
				$("#btn_reset").on('click',reset);
				
			    /*var myDropzone = new Dropzone("#m-dropzone-one", {
			        url: "/file/upload",
			        acceptedFiles: ".jpg,.jpeg,.png",
			        autoQueue: false,
			        maxFilesize: 10,//限制文件的大小，单位是MB
			        autoProcessQueue : true,// 如果为false，文件将被添加到队列中，但不会自动处理队列。
			        uploadMultiple : true, // 是否在一个请求中发送多个文件。
			        parallelUploads : 1, //最大并行处理量（一次同时上传的个数，不设置的话，默认：2个）
			        maxFiles : 1, // 用于限制此Dropzone将处理的最大文件数
			        addRemoveLinks : true,//添加移除文件
			        dictRemoveFile: "移除文件",
			        dictCancelUpload: "取消",
			        dictMaxFilesExceeded:"已达到最大上传文件数量",
			        dictFileTooBig:"文件过大",
			        addViewLinks: false,
			        autoDiscover:false,
			        sending: function(file, xhr, formData) {
			            formData.append("filesize", file.size);
			        },
			        init: function () {
			        	var mockFile = { name: "banner2.jpg", size: 12345 };
			            myDropzone.options.addedfile.call(myDropzone, mockFile);
			            myDropzone.options.thumbnail.call(myDropzone, mockFile, "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1121122675,4171546081&fm=26&gp=0.jpg");
			            myDropzone.options.success(mockFile);
			        },
			        success: function (file, response, e) {
			            var res = JSON.parse(response);
			            if (res.error) {
			                $(file.previewTemplate).children('.dz-error-mark').css('opacity', '1')
			            }
			        }
			    });*/
				
				$("#file1").change(function(){
				    $("#dispimg1").attr("src",URL.createObjectURL($(this)[0].files[0]));
				});
				$("#file2").change(function(){
				    $("#dispimg2").attr("src",URL.createObjectURL($(this)[0].files[0]));
				});
				$("#file3").change(function(){
				    $("#dispimg3").attr("src",URL.createObjectURL($(this)[0].files[0]));
				});
				
				$('#massid').select2({
					placeholder : "请选择人员...",
					language:'zh-CN',
					allowClear : true,
					templateResult: formatRepo,
					escapeMarkup: function(markup) {
			                return markup;
			        },
					//minimumInputLength:1,
					ajax : {
						url : ctx + "/gov/mass/connectSearch",
						dataType : 'json',
						method : 'GET',
						delay: 250,
						data : function(params){
		                    return {
		                    	param : params.term,
		                    }
		                },
						cache : true,
						processResults : function(data, page) {
							var result = [];
							$.each(data.data, function(index, val) {
								result.push({
									'id' : this.id,
									'text' : this.name,
									'idcode' : this.idcode,
									'address' : this.address
								});
							});
							return {
								results : result
							};
						}
					}
				});
				
				function formatRepo(object) {
		            var markup = "<div class='select2-result-repository clearfix'>" +
	                "<div class='select2-result-repository'>" +
	                "<div class='select2-result-repository__title'>" + object.text + "</div>";
		            	markup += "<div class='select2-result-repository__statistics'>" +
	                "<div class='select2-result-repository__forks'>证件号码: </span> " + object.idcode + " </div>" +
	                "<div class='select2-result-repository__forks'>地址信息: </span> " + object.address + " </div>" +
	                "</div>" +
	                "</div></div>";
		            $("#address").val(object.address);
		            return markup;
		        };
		        
		        $("#massid").change(function () {
		        	var id = $("#massid option:selected").val();
		        	$.ajax({
						type : "GET",
						url : ctx + "/gov/mass/get?id="+id,
						success : function(data) {
							$("#address").val(data.address);
							$("#idcode").val(data.idcode);
						},
						error : function(data) {
							 //notify('数据获取失败，请检查网络是否畅通!');
						},
						complete : function(XHR, TS) {
							XHR = null
						}
					});
		        	
				 });
		        
		      
				
				function loadTag(){
					$.ajax({
						type : "GET",
						url : ctx + "/gov/tag/list",
						success : function(data) {
							var tag_template = Handlebars.compile($("#tag_template").html());
				    		var tag_html=tag_template(data.data);
			    			$('#taglist').append(tag_html);
						},
						error : function(data) {
							 //notify('数据获取失败，请检查网络是否畅通!');
						},
						complete : function(XHR, TS) {
							XHR = null
						}
					});
				}
				loadTag();
			      
				form_helpers.parsley($('#form'));// 表单验证
				  $('#form').ajaxForm(
					{
						url : ctx+'/gov/librarystaff',
						dataType : 'json',
						type : 'POST',
						beforeSubmit : function(formData, form, options) {
							form_helpers.blockUI($('#form'));// 加载动画
						},
						error : function(data, textStatus, errorThrown) {
							form_helpers.unblockUI($('#form'));// 取消加载动画
						},
						success : function(data) {
							if (data.success) {
								form_helpers.unblockUI($('#form'));
								form_helpers.notify(data.msg, "提示信息", "success");
							} else {
								form_helpers.unblockUI($('#form'));
								form_helpers.info($('#alert'), "warning", "warning", data.msg, 6);
							}
						}
					});			

				function close() {
		    		window.close();
				};
				
				function refresh() {
					location.reload();
				};
				
				function reset() {
		    		$('#form')[0].reset();
		    		$("#massid").empty();
		    		$("#dispimg1").attr("src",ctx+"/static/image/noimg.jpg");
		    		$("#dispimg2").attr("src",ctx+"/static/image/noimg.jpg");
		    		$("#dispimg3").attr("src",ctx+"/static/image/noimg.jpg");
				};
		       

		}

    return {
        init: function () {
            initPage();
            initData();
        }
    };
}();

// Class initialization on page load
jQuery(document).ready(function () {
    VenueAdd.init();
});