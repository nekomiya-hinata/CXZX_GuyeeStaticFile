"use strict";
var DemoList = function () {

    var initPage = function (that) {
    	function loadFaceSnapKpi(){
    		var placeid = $("#placeid").val();
    		var source = $('input:radio[name="source"]:checked').val();
    		$.ajax({  
        		type: 'get',  
        		dataType: 'text',  
        		url :  ctx+'/gov/dashboard/faceSnapKpi',
        		success : function(data){ 
        			var parsedWordArray = CryptoJS.enc.Base64.parse(data);
                	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
                	var result=JSON.parse(msg);
        			$('#todaySnapTotoal').html('<span class="counter"  data-value="'+result.todaySnapTotoal+'">0</span>');
        			/*$('#placeTotal').html('<span class="counter"  data-value="'+result.placeTotal+'">0</span>');
        			$('#boxTotal').html('<span class="counter"  data-value="'+result.boxTotal+'">0</span>');*/
        			$('#todayWhitePersonTotal').html('<span class="counter"  data-value="'+result.todayWhitePersonTotal+'">0</span>');
        			$('#todaySnapWhitePersonTotal').html('<span class="counter"  data-value="'+result.todaySnapWhitePersonTotal+'">0</span>');
        			$('#todayStrangeTotoal').html('<span class="counter"  data-value="'+result.todayStrangeTotoal+'">0</span>');
        			$('#todaySnapStrangeTotoal').html('<span class="counter"  data-value="'+result.todaySnapStrangeTotoal+'">0</span>');
        			$('#whitePersonTotal').html('<span class="counter"  data-value="'+result.whitePersonTotal+'">0</span>');
        			$('#liveness').html('<span class="counter"  data-value="'+result.liveness+'">0</span>');
        			$('.counter').counterUp({
    	        	    delay: 10,
    	        	    time: 1000
    	        	});
        		}  
        	});
    	}
    	loadFaceSnapKpi();
    	
        $('.quickSearch').on('keypress', function (e) {
            if (e.which == 13) {query();}
        });
        $("#btn_submit").on('click',quickSearchByBytes);
        
        $("#files").change(function(){
		    $("#dispimg").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
        
        $("#btn_reset").on('click',reset);
     	function reset() {
    		$('#searchForm')[0].reset();
    		$("#dispimg").attr("src",ctx+"/static/image/noimg.jpg");
    		$("#placeid").empty();
		};
		
		$("#placeid").select2({
		    placeholder: "请选择抓拍点位",
		    allowClear:true,
		    ajax : {
				url : ctx + "/gov/place/list?type=1",
				dataType : 'json',
				method : 'GET',
				delay: 250,
				data : function(params){
                    return {
                    	search_LIKE_name : params.term
                    }
                },
				cache : true,
				processResults : function(data, page) {
					var result = [];
					$.each(data.data, function(index, val) {
						var parsedWordArray = CryptoJS.enc.Base64.parse(this);
	                	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
	                	var st=JSON.parse(msg);
						result.push(st);
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
            "<div class='select2-result-repository__forks'>地址: </span> " + object.desc + " </div>" +
            "</div>" +
            "</div></div>";
            return markup;
        };
        
        function formatRepoSelection(repo) {
        	return repo.name;
        };
        
       /* $('#placeid').select2({
			placeholder : "抓拍场所",
			language:'zh-CN',
			allowClear : true,
			templateResult: formatRepo,
			escapeMarkup: function(markup) {
	                return markup;
	        },
			ajax : {
				url : ctx + "/gov/place/list?type=1",
				dataType : 'json',
				method : 'GET',
				delay: 250,
				data : function(params){
                    return {
                    	search_LIKE_name : params.term
                    }
                },
				cache : true,
				processResults : function(data, page) {
					var result = [];
					$.each(data.data, function(index, val) {
						var parsedWordArray = CryptoJS.enc.Base64.parse(this);
	                	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
	                	var st=JSON.parse(msg);
						result.push({
							'id' : st.id,
							'text' : st.name,
							'desc' : st.address==null?"场所地址信息":st.address
						});
					});
					return {
						results : result
					};
				}
			}
		});*/
        
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
        
        /*$('.form_datetime').datepicker({
			language : 'zh-CN',
			autoclose : false,
			todayBtn : true,
			format : 'yyyy-mm-dd'
		});*/
        
        $(".form_datetime").datetimepicker({
			language : 'zh-CN',
	        format: "yyyy-mm-dd hh:ii",
	        autoclose: true,
	        todayBtn: true,
	        size:'mini',
	        minuteStep:5,
	        endDate:new Date()
	    });
        
        $.extend($.fn.dataTable.defaults, {
			"pageLength": 24,
			"processing" : true,
			"searching" : false,
			"ordering" : false,
			"filter" : false,
			"info" : true,
			"paging" : true,
			"lengthChange" : false,
			"processing" : true
		});
        
        /* 注册handlebars模板 */
        var template = Handlebars.compile($("#template-stranger").html());
		this.datatable = $('#table').DataTable({
				"serverSide" : true,
				responsive: true,
	            searchDelay: 500,
	            "language": Lang.datatable,
				"ajax" : {
					"url": ctx + "/gov/accesslist/connectSearch",
					"type" : "GET",
					"data": function (params) {
						/*var formData = new FormData();
						formData.append('files', blob,uploadedImageName);*/
						/*params.personid = $("#personid").val();
	                	params.personname = $("#name").val();
	                	params.placeid = $("#placeid").val();*/
	                	if($("#personid").val()!=null && $("#personid").val()!=""){
	                    	 var words = CryptoJS.enc.Utf8.parse($("#personid").val());
	                     	 var personid = CryptoJS.enc.Base64.stringify(words);
	                     	 params.personid = personid;
	                    };
	                    if($("#name").val()!=null && $("#name").val()!=""){
	                    	 var words = CryptoJS.enc.Utf8.parse($("#name").val());
	                     	 var name = CryptoJS.enc.Base64.stringify(words);
	                     	 params.personname = name;
	                    };
	                    if($("#placeid").val()!=null && $("#placeid").val()!=""){
	                    	 var words = CryptoJS.enc.Utf8.parse($("#placeid").val());
	                     	 var placeid = CryptoJS.enc.Base64.stringify(words);
	                     	 params.placeid = placeid;
	                    };
	                    if($("#sdate").val()!=null && $("#sdate").val()!=""){
	                    	params.sdate = $("#sdate").val()+":00";
	                    }
	                    if($("#edate").val()!=null && $("#edate").val()!=""){
	                    	params.edate = $("#edate").val()+":00";
	                    }
	                	params.source = $('input:radio[name="source"]:checked').val();
	                	if($("#msryids").val()!=null && $("#msryids").val()!=""){
	                		params.msryids = $("#msryids").val();
	                	};
	                    return params;
	                }
				},
				/*"fnDrawCallback" : function() {
					this.api().column(0).nodes().each(
							function(cell, i) {
								cell.innerHTML = i + 1;
					});
				},
				"columns" : [{"data" : null,"title" : "序号","className" : "text-center dt-nowrap"},
					{"data" : "pname","title" : "姓名","className" : "text-center dt-nowrap"},
					{"data" : "kqtime","title" : "通行时间","className" : "text-center dt-nowrap"},
					{"data" : "fullurl","title" : "通行图片","className" : "text-center dt-nowrap",
						"render":function (data,type,row) {
							return '<a href="'+data+'" target="_blank"><img src=' + urlFormat(data, 60, 60) + ' > </a>';
						}
					}
					]*/
				"fnDrawCallback" : function() {
					this.api().column(0).nodes().each(function(cell, i) {cell.innerHTML = i + 1;});
					/*将数据封装成json对象*/
					 var array=[];
					 this.api().data().each( function (d) {
						 var parsedWordArray = CryptoJS.enc.Base64.parse(d);
		                 var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
		                 var result=JSON.parse(msg);
				  		 array.push(result);
				  	  });
					 /*将json对象用刚刚注册的Handlebars模板封装，得到最终的html，插入到table中。*/
				    $('#accesslist').html(template(array));
					$('#table').parent().hide();
					$('#table').parent().prev().hide();
				},
				"columns" : [{"data" : null,"title" : "序号","width" : "30px","className" : "text-center dt-nowrap","visible": false}]
		});

		Handlebars.registerHelper('urlFormat', function(photo) { 
			return urlFormat(photo,130,120);
		});
		
		function quickSearchByBytes() {
        	$("#msryids").val("");
        	if($("#files")[0].files[0]==null){
				query();
			}else{
				form_helpers.parsley($('#searchForm'));
	            $('#searchForm').ajaxSubmit({
	         		url :ctx + "/gov/accesslist/quickSearchByBytes",
	    			dataType : 'text',
	    			type : 'POST',
	    			beforeSubmit : function(formData, form, options) {
	    				form_helpers.blockUI($('#searchForm'));
	    			},
	    			error : function(data, textStatus, errorThrown) {
	    				form_helpers.unblockUI($('#searchForm'));
	    			},
	    			success : function(data) {
	    				form_helpers.unblockUI($('#searchForm'));
	    				$("#msryids").val(data);
	    				query();
	    			}
	         	 });
			}
        }
        
        function query() {
        	/*loadFaceSnapKpi();*/
            DemoList.refresh();
        }
        
    };

    return {
        init: function () {
            initPage.apply(this);
        },
        refresh: function () {
        	$("#table").dataTable().api().ajax.reload();
        },
        view: function (arg) {
            window.open(ctx + "/gov/librarystaff/info?id=" + arg);
        }
    };

}();
/*Class initialization on page load*/
jQuery(document).ready(function () {
    DemoList.init();
});