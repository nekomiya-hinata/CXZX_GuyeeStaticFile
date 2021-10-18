"use strict";
// Class definition
var DataList = function () {

    var initPage = function (that) {

        $('.quickSearch').on('keypress', function (e) {
                if (e.which == 13) {
                    query();
                }
        });

        $('#btn_add').on('click', function () {
            openBrowse(ctx + '/sap/rawdata/add', '新增');
        });
        
        $('.btn_search').on('click', function () {
        	query();
        });
        
        function formatRepo(repo) {
            var markup = "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository'>" +
            "<div class='select2-result-repository__title'>" + repo.text + "</div>";
            	markup += "<div class='select2-result-repository__statistics'>" +
            "<div class='select2-result-repository__forks'>描述: </span> " + repo.desc + " </div>" +
            "</div>" +
            "</div></div>";
            return markup;
        };
	  
	  function formatRepoSelection(repo) {
		  return repo.name;
      };
      
        $('#deviceid').select2({
			placeholder : "请选择场所类型...",
			language:'zh-CN',
			allowClear : true,
			templateResult: formatRepo,
			//multiple :true,
			escapeMarkup: function(markup) {
	                return markup;
	        },
	        //templateSelection: formatRepoSelection,
			ajax : {
				url : ctx + "/sap/rawdata/enumDeviceList",
				dataType : 'json',
				method : 'GET',
				delay: 250,
				cache : true,
				processResults : function(data, page) {
					var result = [];
					$.each(data, function(index, val) {
						result.push({
							'id' : this.id,
							'text' : this.name,
							'desc':this.desc
						});
					});
					return {
						results : result
					};
				}
			}
		})
		
        this.datatable = $('#table').DataTable({
            "serverSide": true,
            responsive: true,
            searchDelay: 500,
            "language": Lang.datatable,
            "ajax": {
                "url": ctx + "/sap/rawdata/connectSearch",
                "type": "GET",
                "data": function (params) {
                	 params.param = $("#param").val();
                	 params.deviceid = $("#deviceid").val();
                	 params.beginCollecttime = $("#beginCollecttime").val();
                	 params.endCollecttime = $("#endCollecttime").val();
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
                "title": "采集场所",
                "className": " text-center dt-nowrap"
            },{
                "data": "devicemac",
                "title": "采集设备MAC",
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
                "title": "采集图",
                "className": "text-center dt-nowrap",
	        	"mRender": function ( data, type, row, meta) {
	        		return '<a onclick=DataList.lookpicture(\"'+data+'\")><img src='+urlFormat(data,60,60)+'> </a>';
				}
            },{
                "data": "",
                "className": "text-center dt-nowrap ",
                "width": "80px",
                "title": "操作",
                render: function (data, type, row, meta) {
                    return `
                        <a href="javascript:void(0)" class="btn  btn-clean " title="查看" onclick="DataList.view(${row.id})">
                          	查看
                        </a>`;
                },
            }]
        });


        function query() {
            DataList.refresh();
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
            DataList.datatable.ajax.reload();
        },
        view: function (arg) {
            window.open(ctx + "/sap/rawdata/info?id=" + arg
            )
        },
        lookpicture:function(url) {
			window.open(url);
		}
    };

}();

// Class initialization on page load
jQuery(document).ready(function () {
    DataList.init();
});