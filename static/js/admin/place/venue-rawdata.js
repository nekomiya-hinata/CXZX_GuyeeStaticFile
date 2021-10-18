"use strict";
// Class definition
var RawWater = function () {

    var initPage = function (that) {
        $('.quickSearch').on('keypress', function (e) {
                if (e.which == 13) {
                    query();
                }
        });
        
        $('#btn_edit').on('click', function () {
        	edit();
        });
        
        $('.btn_search').on('click', function () {
        	query();
        });
        
        
      //注册handlebars模板
		var template = Handlebars.compile($("#template-manager").html());
		this.datatable = $('#table').dataTable({
				"serverSide" : true,
				"language" : {"url" : ctx+ "/static/resource/dataTables.zh_CN.txt"},
				"ajax" : {
					"url" : ctx + "/admin/device/quickSearch",
					"type" : "GET",
					"data" : function(params) {
						params.search_EQ_venueid = $("#id").val();
						return params;
					}
				},
				"createdRow":function(row,data,index){
	                if (data.status==1 ) {//历史住户
	                	$('td',row).css('color','red');
	                }
	           },
	           "fnDrawCallback" : function() {
					this.api().column(0).nodes().each(
							function(cell, i) {
								cell.innerHTML = i + 1;
					});
					
					//将数据封装成json对象
					 var array=[];
					 this.api().data().each( function (d) {
				  		array.push(d);
				  	  });
					 //将json对象用刚刚注册的Handlebars模板封装，得到最终的html，插入到table中。
				    $('#managerlist').html(template(array));
					$('#table').parent().hide();
					$('#table').parent().prev().hide();
					
				},
				"columns" : [{
					"data" : null,
					"title" : "序号",
					"width" : "30px",
					"className" : "text-center dt-nowrap"
				}]
			});
		
        this.datatable2 = $('#rawwatertable').DataTable({
            "serverSide": true,
            responsive: true,
            searchDelay: 500,
            "language": Lang.datatable,
            "ajax": {
                "url": ctx + "/admin/rawdata/connectSearch",
                "type": "GET",
                "data": function (params) {
                	 params.venueid = $("#id").val();
                	 params.devicecode = $("#devicecode").val();
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
                "data": "venuename",
                "title": "场所名称(简称)",
                "className": " text-center dt-nowrap"
            },{
                "data": "devicecode",
                "title": "采集设备编号",
                "className": "text-center dt-nowrap"
            }, {
                "data": "devicetypename",
                "title": "采集设备类型",
                "className": "text-center dt-nowrap"
            },{
                "data": "collecttime",
                "title": "采集时间",
                "className": "text-center dt-nowrap"
            }, {
                "data": "datatype",
                "title": "数据类型",
                "className": "text-center dt-nowrap",
				"render": function(data,type,row,meta){
           	   	  	 if(data==1){
   	   	  		 		  return '人脸识别'
               	   	  }else if(data==2){
               	   		  return '陌生人脸'
               	   	  }else if(data==3){
               	   		  return "车牌识别"
               	   	  }else{
               	   		  return "未知"
               	   	  }
				  }
            }, {
                "data": "fullurl",
                "title": "场景图",
                "className": "text-center dt-nowrap",
	        	"mRender": function ( data, type, row, meta) {
	        		return '<a onclick=RawWater.lookpicture(\"'+data+'\")><img src='+data+'> </a>';
				}
            },{
                "data": "",
                "className": "text-center dt-nowrap ",
                "width": "80px",
                "title": "操作",
                render: function (data, type, row, meta) {
                    return `
                        <a href="javascript:void(0)" class="btn  btn-clean " title="查看" onclick="RawWater.view(${row.id})">
                          	查看
                        </a>`;
                },
            }]
        });
		
        function query() {
            RawWater.refresh();
        }
    };

    var initData = function () {

    }


    return {
        init: function () {
            initPage.apply(this);
            initData.apply(this);
        },
        refresh: function () {
    		 $("#rawwatertable").dataTable().api().ajax.reload();
        },
        lookpicture:function(url) {
        	var content = url.substring(0,url.lastIndexOf('_'));
        	var stuff = url.substring(url.lastIndexOf('.'))
			window.open(content+stuff);
		},
		view: function (arg) {
            window.open(ctx + "/admin/rawdata/info?id=" + arg
            )
        },
    };

}();

// Class initialization on page load
jQuery(document).ready(function () {
    RawWater.init();
});