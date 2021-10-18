"use strict";
// Class definition
var DemoList = function () {

    var initPage = function (that) {
        
        this.datatable = $('#table').DataTable({
            "serverSide": true,
            responsive: true,
            searchDelay: 500,
            "language": Lang.datatable,
            "ajax": {
                "url": ctx + "/admin/boxdog/quickSearch",
                "type": "GET",
                "data": function (params) {
	            	 params.search_EQ_deviceid=$("#deviceid").val();
		      		 return params;
                }
            },
            "fnDrawCallback": function () {
                this.api().column(0).nodes().each(
                    function (cell, i) {
                        cell.innerHTML = i + 1;
                    });
            },
            "columns": [{"data": null, "title": "序号","width": "30px","className": "text-center dt-nowrap"}, 
                        { "data": "deviceid","title" :"设备ID","className": " text-center dt-nowrap"},
                        { "data": "time","title" :"日志时间","className": " text-center dt-nowrap"},
                        {"data": "","className": "text-center dt-nowrap ","width": "160px","title": "操作",
     						render: function (data, type, row, meta) {
     							return `
		                        <a href="javascript:void(0)" class="btn  btn-clean " title="日志内容" onclick="DemoList.view(\'${row.id}\')">
		                          	日志内容
		                        </a>`;
		                    
                }}]
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
        view: function (id) {
        	//window.open(ctx.concat("/admin/boxdog/info?id=",id));
        	var $modal = $('#ajax-modal-psd');
    		$modal.on("hidden.bs.modal", function(e) {
    			$(this).removeData();
    		});
    		$modal.load(ctx + "/admin/boxdog/logcontent?id="+id, '', function() {
    			$modal.modal();
    			//$modal.find('#logcontent').val(logcontent);
    		});
        }
        
        
		
    };

}();

// Class initialization on page load
jQuery(document).ready(function () {
    DemoList.init();
});