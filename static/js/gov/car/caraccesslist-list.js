"use strict";
var DemoList = function () {

    var initPage = function (that) {
    	
    	var options = {
	        useEasing: true,
	        useGrouping: true,
	        separator: ',',
	        decimal: '.'
	    };
    	
    	function loadCarSnapKpi(){
    		var placeid = $("#placeid").val();
    		var source = $('input:radio[name="source"]:checked').val();
    		$.ajax({  
        		type: 'get',  
        		dataType: 'text',  
        		url :  ctx+'/gov/dashboard/carSnapKpi?placeid='+placeid+'&source='+source, 
        		success : function(data){ 
        			var parsedWordArray = CryptoJS.enc.Base64.parse(data);
                	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
                	var result=JSON.parse(msg);
        			new CountUp("todaySnapTotoal", 0, result.todaySnapTotoal, 0, 3, options).start();
        			new CountUp("todaySnapCarTotal", 0, result.todaySnapCarTotal, 0, 3, options).start();
        			//new CountUp("todaySnapOutTotoal", 0, result.todaySnapOutTotoal, 0, 3, options).start();
        			//new CountUp("todaySnapOutCarTotal", 0, result.todaySnapOutCarTotal, 0, 3, options).start();
        			//new CountUp("todaySnapLocalTotoal", 0, result.todaySnapLocalTotoal, 0, 3, options).start();
        			//new CountUp("todaySnapLocalCarTotal", 0, result.todaySnapLocalCarTotal, 0, 3, options).start();
        			new CountUp("snapTotal", 0, result.snapTotal, 0, 3, options).start();
        			new CountUp("snapCarTotal", 0, result.snapCarTotal, 0, 3, options).start();
        			new CountUp("boxTotal", 0, result.boxTotal, 0, 3, options).start();
        		}  
        	});
    	};
    	loadCarSnapKpi();

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
			"pageLength": 24
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
        
        $("#placeid").select2({
		    placeholder: "请选择抓拍点位",
		    allowClear:true,
		    ajax : {
				url : ctx + "/gov/place/list?type=2",
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
        
       /* $('#placeid').select2({
			placeholder : "抓拍场所",
			language:'zh-CN',
			allowClear : true,
			templateResult: formatRepo,
			escapeMarkup: function(markup) {
	                return markup;
	        },
			ajax : {
				url : ctx + "/gov/place/list?type=2",
				dataType : 'json',
				method : 'GET',
				delay: 250,
				data : function(params){
                    return {
                    	search_LIKE_name : params.term,
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
        
        var template = Handlebars.compile($("#template-stranger").html());
		this.datatable = $('#table').DataTable({
				"serverSide" : true,
				responsive: true,
	            searchDelay: 500,
	            "language": Lang.datatable,
				"ajax" : {
					"url": ctx + "/gov/caraccesslist/connectSearch",
					"type" : "GET",
					"data": function (params) {
						if($("#plate").val()!=null && $("#plate").val()!=""){
	                    	 var words = CryptoJS.enc.Utf8.parse($("#plate").val());
	                     	 var plate = CryptoJS.enc.Base64.stringify(words);
	                     	 params.plate = plate;
	                    };
	                	if($("#placeid").val()!=null && $("#placeid").val()!=""){
	                    	 var words = CryptoJS.enc.Utf8.parse($("#placeid").val());
	                     	 var placeid = CryptoJS.enc.Base64.stringify(words);
	                     	 params.placeid = placeid;
	                    };
	                	params.sdate = $("#sdate").val();
	                	params.edate = $("#edate").val();
	                	params.source = $('input:radio[name="source"]:checked').val();
	                	params.source2 = $('input:radio[name="source2"]:checked').val()
	                    return params;
	                }
				},
	           "fnDrawCallback" : function() {
					this.api().column(0).nodes().each(
							function(cell, i) {
								cell.innerHTML = i + 1;
					});
					 var array=[];
					 this.api().data().each( function (d) {
						 var parsedWordArray = CryptoJS.enc.Base64.parse(d);
		                 var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
		                 var result=JSON.parse(msg);
				  		 array.push(result);
				  	  });
					 $('#carlist').html(template(array));
					 $('#table').parent().hide();
					 $('#table').parent().prev().hide();
				},
				"columns" : [{"data" : null,"title" : "序号","width" : "30px","className" : "text-center dt-nowrap","visible": false}]
		});

        function query() {
            DemoList.refresh();
        };
        
        Handlebars.registerHelper('sourcephoto', function(source) { 
			 if (source == 1)
				 return ctx+'/static/image/localcar.png';
			 else
				 return ctx+'/static/image/strangercar.png';
		});
        
    };

    return {
        init: function () {
            initPage.apply(this);
        },
        refresh: function () {
        	$("#table").dataTable().api().ajax.reload();
        },
        view: function (arg) {
            window.open(ctx + "/gov/caraccesslist/info?id=" + arg);
        }
    };

}();
jQuery(document).ready(function () {
    DemoList.init();
});