"use strict";
var DemoList = function () {
    var initPage = function (that) {
    	var options = {
	        useEasing: true,
	        useGrouping: true,
	        separator: ',',
	        decimal: '.'
	    };
    	
    	function loadWarningKpi(){
    		$.ajax({  
        		type: 'get',  
        		dataType: 'text',  
        		url :  ctx+'/gov/dashboard/carWarningKpi', 
        		success : function(arrays){ 
        			var parsedWordArray = CryptoJS.enc.Base64.parse(arrays);
                	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
                	var result=JSON.parse(msg);
        			new CountUp("todayWarningTotoal", 0, result.todayWarningTotoal, 0, 3, options).start();
        			new CountUp("todayCarTotal", 0, result.todayCarTotal, 0, 3, options).start();
        			new CountUp("warningTotal", 0, result.warningTotal, 0, 3, options).start();
        			new CountUp("carTotal", 0, result.carTotal, 0, 3, options).start();
        		}
        	});
    	}
    	loadWarningKpi();

        $('.quickSearch').on('keypress', function (e) {
            if (e.which == 13) {query();}
        });
        $('.btn_search').on('click', function () {
        	query();
        });
        
        $("#btn_reset").on('click',reset);
     	function reset() {
    		$('#searchForm')[0].reset();
    		$("#placeid").empty();
		};
        
		$('.form_datetime').datepicker({
			language : 'zh-CN',
			autoclose : false,
			todayBtn : true,
			format : 'yyyy-mm-dd',
		});
        
        $.extend($.fn.dataTable.defaults, {
			"pageLength": 18
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
        
        $('#placeid').select2({
			placeholder : "抓拍场所",
			language:'zh-CN',
			allowClear : true,
			templateResult: formatRepo,
			escapeMarkup: function(markup) {
				return markup;
	        },
			ajax : {
				url : ctx + "/gov/place/list",
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
		});
        
        /*注册handlebars模板*/
        var template = Handlebars.compile($("#template-stranger").html());
		this.datatable = $('#table').DataTable({
				"serverSide" : true,
				responsive: true,
	            searchDelay: 500,
	            "language": Lang.datatable,
				"ajax" : {
					"url": ctx + "/gov/carwarning/quickSearch",
					"type" : "GET",
					"data": function (params) {
						if($("#plate").val()!=null && $("#plate").val()!=""){
	                    	 var words = CryptoJS.enc.Utf8.parse($("#plate").val());
	                     	 var plate = CryptoJS.enc.Base64.stringify(words);
	                     	 params.plate = plate;
	                    };
	                    /*if($("#content").val()!=null && $("#content").val()!=""){
	                    	 var words = CryptoJS.enc.Utf8.parse($("#content").val());
	                     	 var content = CryptoJS.enc.Base64.stringify(words);
	                     	 params.content = content;
	                    };*/
	                    if($("#placeid").val()!=null && $("#placeid").val()!=""){
	                    	 var words = CryptoJS.enc.Utf8.parse($("#placeid").val());
	                     	 var placeid = CryptoJS.enc.Base64.stringify(words);
	                     	 params.placeid = placeid;
	                    };
	                    params.search_GE_ddate = $("#sdate").val();
	                	params.search_LE_ddate = $("#edate").val();
	                	
	                	/*params.search_LIKE_personname = $("#personname").val();
	                	params.search_LIKE_content = $("#content").val();
	                	params.search_EQ_placeid = $("#placeid").val();
	                	params.search_GE_ddate = $("#sdate").val();
	                	params.search_LE_ddate = $("#edate").val();*/
	                    return params;
	                }
				},
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
					 $('#warninglist').html(template(array));
					 $('#table').parent().hide();
					 $('#table').parent().prev().hide();
				},
				"columns" : [{"data" : null,"title" : "序号","width" : "30px","className" : "text-center dt-nowrap","visible": false}]
		});

        function query() {
            DemoList.refresh();
        };
    };

    return {
        init: function () {
            initPage.apply(this);
        },
        refresh: function () {
        	$("#table").dataTable().api().ajax.reload();
        }
    };

}();

jQuery(document).ready(function () {
    DemoList.init();
});