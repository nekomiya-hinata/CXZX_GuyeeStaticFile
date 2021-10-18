"use strict";
var DemoList = function () {

    var initPage = function (that) {
    	
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
    		$("#communityid").empty();
		};
		
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
        
        $('#communityid').select2({
			placeholder : "场所",
			language:'zh-CN',
			allowClear : true,
			templateResult: formatRepo,
			escapeMarkup: function(markup) {
	                return markup;
	        },
			ajax : {
				url : ctx + "/gov/community/list",
				dataType : 'json',
				method : 'GET',
				delay: 250,
				data : function(params){
                    return {
                    	search_LIKE_name : params.term
                    };
                },
				cache : true,
				processResults : function(data, page) {
					var result = [];
					$.each(data.data, function(index, val) {
						result.push({
							'id' : this.id,
							'text' : this.name,
							'desc' : this.address
						});
					});
					return {
						results : result
					};
				}
			}
		});
        
        $('.form_datetime').datepicker({
			language : 'zh-CN',
			autoclose : false,
			todayBtn : true,
			format : 'yyyy-mm-dd',
		});
        
        $.extend($.fn.dataTable.defaults, {
			"pageLength": 16
		});
        
        /*注册handlebars模板*/
        var template = Handlebars.compile($("#template-stranger").html());
		this.datatable = $('#table').DataTable({
				"serverSide" : true,
				responsive: true,
	            searchDelay: 500,
	            "language": Lang.datatable,
				"ajax" : {
					"url": ctx + "/gov/staff/connectSearch",
					"type" : "GET",
					"data": function (params) {
	                	params.name = $("#name").val();
	                	params.idcode = $("#idcode").val();
	                	params.mobile = $("#mobile").val();
	                	params.communityid = $("#communityid").val();
	                	params.msryids = $("#msryids").val()==null?"":$("#msryids").val();
	                    return params;
	                }
				},
	           "fnDrawCallback" : function() {
					this.api().column(0).nodes().each(
							function(cell, i) {
								cell.innerHTML = i + 1;
					});
					/*将数据封装成json对象*/
					 var array=[];
					 
					 /*var parsedWordArray = CryptoJS.enc.Base64.parse(message.body);
			         var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
			         var jo=JSON.parse(msg);*/
					 this.api().data().each( function (d) {
				  		array.push(d);
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
	         		url :ctx + "/gov/staff/quickSearchByBytes",
	    			dataType : 'json',
	    			type : 'POST',
	    			beforeSubmit : function(formData, form, options) {
	    				form_helpers.blockUI($('#searchForm'));
	    			},
	    			error : function(data, textStatus, errorThrown) {
	    				form_helpers.unblockUI($('#searchForm'));
	    			},
	    			success : function(data) {
	    				form_helpers.unblockUI($('#searchForm'));
	    				$("#msryids").val(data.length==0?"0":data);
	    				query();
	    			}
	         	 });
			}
        }
        
        function query() {
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