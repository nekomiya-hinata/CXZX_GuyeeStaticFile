"use strict";
// Class definition
var DemoList = function () {

    var initPage = function (that) {
    	
    	var fastNodeid=null;
		$("#kt_tree_4").jstree({
            "core" : {
                "themes" : {"responsive": true}, 
                "check_callback" : function (operation, node, parent, position, more) {
                	if(operation === "rename_node") {
                        if(parent.id === "#") {
                          return false;
                        }
                     }
                     return true;
                },
                'data' : function (obj, callback) {
                    var jsonstr="[]";
                    var jsonarray = eval('('+jsonstr+')');
                    $.ajax({
                        type: "GET",
                        url:ctx + '/gov/community/getJsonTree',
                        dataType:"json",
                        async: false,
                        success:function(result) {
                            var arrays= result;
                            for(var i=0 ; i<arrays.length; i++){
                                var arr = {
                                        "id":arrays[i].id,
                                        "parent":arrays[i].pid=="root"?"#":arrays[i].pid,
                                        "text":arrays[i].name,
                                        "icon":arrays[i].icon,
                                        "type":arrays[i].type,
                                        "opened":arrays[i].opened,
                                }
                                jsonarray.push(arr);
                            }
                            fastNodeid=arrays[0].id;
                        }
                    });
                    callback.call(this, jsonarray);
                }
            },
            "plugins" : [ "contextmenu","changed", "state", "types" ],//"dnd",拖拽 "contextmenu",节点菜单
            "types":{
            	"default":{"icon":"fa fa-folder icon-state-warning icon-lg"},
                "file":{"icon":"fa fa-file icon-state-warning icon-lg"}
            },
            "state": {"opened":true},
            "contextmenu":{
            	select_node:false,
    	    	show_at_node:true,
    	    	items: function (node){
    	    		var menu = {};
                    return menu;
    	    	}
            }
        }).on('changed.jstree', function (e, data) {
        	/*$("#wayid").val(data.instance.get_node(data.selected[0]).id);
        	$("#selectid").val(data.instance.get_node(data.selected[0]).id);
        	GateauthorityList.datatable.api().ajax.reload();
        	if($("#wayid").val() !=null && $("#wayid").val()!= -1 && $("#wayid").val() !="")
        	trainmain();
        	
        	$.ajax({
                type: "GET",
                url:ctx + "/ent/gate/getWayBox",
                dataType:"json",
                async: false,
                data:{
                	id:$("#wayid").val()
                },
                success:function(result) {
                	$("#showbox").html("");
                	if(result.data != null)
                	$("#showbox").html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+result.data.rfidreader+"&nbsp;&nbsp;&nbsp;&nbsp;"+result.data.boxid);
                }
            });*/
        });
        
        $.extend($.fn.dataTable.defaults, {
			"pageLength": 16
		});
        
        //注册handlebars模板
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
					
					//将数据封装成json对象
					 var array=[];
					 this.api().data().each( function (d) {
				  		array.push(d);
				  	  });
					 //将json对象用刚刚注册的Handlebars模板封装，得到最终的html，插入到table中。
				    $('#accesslist').html(template(array));
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
        	$("#table").dataTable().api().ajax.reload();
        },
        view: function (arg) {
            window.open(ctx + "/gov/librarystaff/info?id=" + arg);
        }
    };

}();

// Class initialization on page load
jQuery(document).ready(function () {
    DemoList.init();
});