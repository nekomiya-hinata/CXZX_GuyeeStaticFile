"use strict";
var DemoList = function () {

    var initPage = function (that) {

        $('.quickSearch').on('keypress', function (e) {
            if (e.which == 13) {query();}
        });
        $('.btn_search').on('click', function () {
        	query();
        });

        $('.btn_add').on('click', function () {
        	 window.open(ctx + "/gov/keycar/add");
        });
        
        $('.btn_search').on('click', function () {
        	query();
        });
        
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
        		url :  ctx+'/gov/dashboard/keycarKpi', 
        		success : function(arrays){ 
        			var parsedWordArray = CryptoJS.enc.Base64.parse(arrays);
                	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
                	var result=JSON.parse(msg);
        			$('#todayWarningTotoal').html('<span class="counter"  data-value="'+result.todayWarningTotoal+'">0</span>');
        			$('#todayCarTotal').html('<span class="counter"  data-value="'+result.todayCarTotal+'">0</span>');
        			$('#carTotal').html('<span class="counter"  data-value="'+result.carTotal+'">0</span>');
            		
        			$('.counter').counterUp({
        				delay: 10,/*每个数字动画的延迟时间，单位毫秒。*/
    	        	    time: 1000/*计数动画总的持续时间。*/
    	        	});
        		}
        	});
    	}
    	loadWarningKpi();

        $.extend($.fn.dataTable.defaults, {
			"pageLength": 15
		});
        
        /*var template = Handlebars.compile($("#template-keycar").html());
        this.datatable = $('#table').DataTable({
            "serverSide": true,
            responsive: true,
            searchDelay: 500,
            "language": Lang.datatable,
            "ajax": {
                "url": ctx + "/gov/keycar/quickSearch",
                "type": "GET",
                "data": function (params) {
                	if($("#plate").val()!=null && $("#plate").val()!=""){
                   	 	var words = CryptoJS.enc.Utf8.parse($("#plate").val());
                    	var plate = CryptoJS.enc.Base64.stringify(words);
                    	params.plate = plate;
                   };
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
			    $('#keycarlist').html(template(array));
				$('#table').parent().hide();
				$('#table').parent().prev().hide();
			},
			"columns" : [{"data" : null,"title" : "序号","width" : "30px","className" : "text-center dt-nowrap","visible": false}]
        });*/
        
        this.datatable = $('#table').DataTable({
            "serverSide": true,
            responsive: true,
            searchDelay: 500,
            "language": Lang.datatable,
            "ajax": {
            	"url": ctx + "/gov/keycar/quickSearch",
                "type": "GET",
                "data": function (params) {
                	if($("#plate").val()!=null && $("#plate").val()!=""){
                   	 	var words = CryptoJS.enc.Utf8.parse($("#plate").val());
                    	var plate = CryptoJS.enc.Base64.stringify(words);
                    	params.plate = plate;
                	};
                    return params;
                }
            },
            "fnDrawCallback": function () {
                this.api().column(0).nodes().each(
                    function (cell, i) {
                        cell.innerHTML = i + 1;
                    });
            },
            "columns": [{
                "data": null,
                "title": "序号",
                "width": "30px",
                "className": "text-center dt-nowrap"
            }, {
                "data": "plate",
                "title": "车牌号码",
                "className": " text-center dt-nowrap"
            },  {
                "data": "memo",
                "title": "备注信息",
                "className": "text-center dt-nowrap"
            },  {
                "data": "createdDate",
                "title": "录入时间",
                "className": " text-center dt-nowrap"
            }, {
                "data": "",
                "className": "text-center dt-nowrap ",
                "width": "200px",
                "title": "操作",
                render: function (data, type, row, meta) {
                    return `
							<a href="javascript:void(0)" class="btn  btn-clean " title="修改" onclick="DemoList.edit(\'${row.id}\')">
		              		修改
		            	</a>
		            	<a href="javascript:void(0)" class="btn  btn-clean " title="删除" onclick="DemoList.del(\'${row.id}\')">
		          			删除
						</a>`;
                },
            }]
        });

        function query() {
            DemoList.refresh();
        }
    };

    return {
        init: function () {
            initPage.apply(this);
        },
        refresh: function () {
            DemoList.datatable.ajax.reload();
        },
        del: function (id) {
			form_helpers.confirm('确定删除?', function(result) {
				if (result.value == true) {
					form_helpers.blockUI($(document.body));
					$.ajax({
						type : "POST",
					 	url: ctx + "/gov/keycar/delete",
						data : {
							'id' : id,
						},
						success : function(data) {
							form_helpers.unblockUI($(document.body));
							if (data.success) {
							 DemoList.refresh();
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
        edit: function (arg) {
            window.open(ctx + "/gov/keycar/edit?id=" + arg);
        },
        view: function (arg) {
            window.open(ctx + "/gov/keycar/info?id=" + arg);
        }
    };

}();
jQuery(document).ready(function () {
    DemoList.init();
});