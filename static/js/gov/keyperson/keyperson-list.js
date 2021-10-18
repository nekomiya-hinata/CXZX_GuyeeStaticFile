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
        	 window.open(ctx + "/gov/keyperson/add");
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
		Handlebars.registerHelper('branchhelpers',function(data,id){
			let branchid = $('#branchid').val();
			if (data == branchid) {
				return `
					<span class="dropdown" style="margin-left:75%;margin-top:0%;position:absolute;">
						<a href="#" class="btn m-btn m-btn--hover-brand m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="dropdown" aria-expanded="false">
						  <i class="la la-ellipsis-h"></i>
						</a>
						 <div class="dropdown-menu dropdown-menu-right" x-placement="bottom-end" style="position: absolute; transform: translate3d(-196px, 27px, 0px); top: 50px; left: 0px; will-change: transform;">
							<a class="dropdown-item" href="${ctx}/gov/keyperson/edit?id=`+ id +`" target="_blank"><i class="la la-edit"></i> 修改</a>
							<a class="dropdown-item" onclick="DemoList.del(` + id + `)"><i class="la la-trash"></i> 删除</a>
						 </div>
					 </span>
					`
			}
		});

        function loadWarningKpi(){
    		$.ajax({  
        		type: 'get',  
        		dataType: 'text',  
        		url :  ctx+'/gov/dashboard/keypersonKpi', 
        		success : function(arrays){ 
        			var parsedWordArray = CryptoJS.enc.Base64.parse(arrays);
                	var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
                	var result=JSON.parse(msg);
                	
        			$('#todayWarningTotoal').html('<span class="counter"  data-value="'+result.todayWarningTotoal+'">0</span>');
        			$('#todayPersonTotal').html('<span class="counter"  data-value="'+result.todayPersonTotal+'">0</span>');
        			$('#personTotal').html('<span class="counter"  data-value="'+result.personTotal+'">0</span>');
            		
        			$('.counter').counterUp({
        				delay: 10,/*每个数字动画的延迟时间，单位毫秒。*/
    	        	    time: 1000/*计数动画总的持续时间。*/
    	        	});
        			/*new CountUp("todayWarningTotoal", 0, result.todayWarningTotoal, 0, 3, options).start();
        			new CountUp("todayPersonTotal", 0, result.todayPersonTotal, 0, 3, options).start();
        			new CountUp("personTotal", 0, result.personTotal, 0, 3, options).start();*/
        		}
        	});
    	}
    	loadWarningKpi();

        $.extend($.fn.dataTable.defaults, {
			"pageLength": 24
		});
        
        var template = Handlebars.compile($("#template-keyperson").html());
        this.datatable = $('#table').DataTable({
            "serverSide": true,
            responsive: true,
            searchDelay: 500,
            "language": Lang.datatable,
            "ajax": {
                "url": ctx + "/gov/keyperson/quickSearch",
                "type": "GET",
                "data": function (params) {
                	if($("#personname").val()!=null && $("#personname").val()!=""){
                   	 	var words = CryptoJS.enc.Utf8.parse($("#personname").val());
                    	var name = CryptoJS.enc.Base64.stringify(words);
                    	params.name = name;
                   };
                   if($("#idcode").val()!=null && $("#idcode").val()!=""){
                    	 var words = CryptoJS.enc.Utf8.parse($("#idcode").val());
                     	 var idcode = CryptoJS.enc.Base64.stringify(words);
                     	 params.idcode = idcode;
                    };
                    if($("#address").val()!=null && $("#address").val()!=""){
                   	 	var words = CryptoJS.enc.Utf8.parse($("#address").val());
                    	var address = CryptoJS.enc.Base64.stringify(words);
                    	params.address = address;
                   };
                   if($("#tags").val()!=null && $("#tags").val()!=""){
                  	 	var words = CryptoJS.enc.Utf8.parse($("#tags").val());
                  	 	var tags = CryptoJS.enc.Base64.stringify(words);
                  	 	params.libRoleName = tags;
                   };
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
				 this.api().data().each( function (d) {
					 var parsedWordArray = CryptoJS.enc.Base64.parse(d);
	                 var msg = parsedWordArray.toString(CryptoJS.enc.Utf8);
	                 var result=JSON.parse(msg);
			  		array.push(result);
			  	  });
				 /*将json对象用刚刚注册的Handlebars模板封装，得到最终的html，插入到table中。*/
			    $('#keypersonlist').html(template(array));
				$('#table').parent().hide();
				$('#table').parent().prev().hide();
			},
			"columns" : [{"data" : null,"title" : "序号","width" : "30px","className" : "text-center dt-nowrap","visible": false}]
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
					 	url: ctx + "/gov/keyperson/delete",
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
            window.open(ctx + "/gov/keyperson/edit?id=" + arg);
        },
        view: function (arg) {
            window.open(ctx + "/gov/keyperson/info?id=" + arg);
        }
    };

}();
jQuery(document).ready(function () {
    DemoList.init();
});