"use strict";
// Class definition
var RoleList = function () {

    var initPage = function (that) {
    	
    	 $('#btn_addResource').on('click', function () {
    		 if(isEmpty($("#roleid").val())){
    			 form_helpers.notify('请选中需要添加权限的角色！！');
    		 }else{
    			 addResource($("#roleid").val());
    		 }
    	 });
    	 
    	 $('#btn_delResource').on('click', function () {
    		 if(isEmpty($("#roleid").val())){
    			 form_helpers.notify('请选中需要删除的权限角色！！');
    		 }else{ 
    			 delResource($("#roleid").val());
    		 }
    	 });
    	 
    	 
    	 
    	 
    	var roleicons = ["fa fa-user-circle kt-font-waring","fa fa-user-circle kt-font-success","fa fa-user-circle kt-font-default","fa fa-user-circle kt-font-danger","fa fa-user-circle kt-font-info"];
	 	var resouceicons = ["fa fa-file kt-font-waring","fa fa-file kt-font-success","fa fa-file kt-font-default","fa fa-file kt-font-danger","fa fa-file kt-font-info"];
    	var fastNodeid=null;
    	 $("#kt_tree_4").jstree({
             "core" : {
                 "themes" : {
                     "responsive": false
                 }, 
                 // so that create works
                 "check_callback" : true,
                 'multiple': false,
                 'data' : function (obj, callback) {
	                    var jsonstr="[]";
	                    var jsonarray = eval('('+jsonstr+')');
	                    $.ajax({
	                        type: "GET",
	                        url:ctx + "/admin/role/gettree",
	                        dataType:"json",
	                        async: false,
	                        success:function(result) {
	                            var arrays= result;
	                            for(var i=0 ; i<arrays.length; i++){
	                            	 if(arrays[i].type == 1){
	                            		 var roles = arrays[i].roles;
	                            		 var children = [];
	                            		 $.each(roles, function(index, val) {
	                            			 var children2 = [];
	                            			 var resouces = this.resouces;
	                            			 var rolename = this.rolename;
	                            			 var roleid = this.id;
	                            			 if(this.resoucesize > 0){
	                            				 $.each(resouces, function(index, val) {
	                            					 children2.push({
	                            						 'resouceid':this.id,'roleid':roleid,'text' : this.resourcename,'icon' : resouceicons[Math.floor((Math.random()*resouceicons.length))],"type":3,
	 		     									});
			                            		 });
	                            			 }
	                            			 children.push({
	                            				 'id':this.id,'text' : rolename,'icon' : roleicons[Math.floor((Math.random()*roleicons.length))],"children": children2,"type":2,
  	     									});
	                            		 });
		                            	 var arr = {
                            			"type":arrays[i].type,
                                        "text":arrays[i].text,
                                        "icon":arrays[i].icon,
                                        "children": children
		                                }
			                                jsonarray.push(arr);
		                            }
	                            }
	                        }
	 
	                    });
	                    callback.call(this, jsonarray);
	                }
             },
             "types" : {
                 "default" : {
                     "icon" : "fa fa-folder kt-font-brand"
                 },
                 "file" : {
                     "icon" : "fa fa-file  kt-font-brand"
                 }
             },
             "state" : { "key" : "demo2" },
             "plugins" : [ "contextmenu", "state", "types"  ],
         }).on('changed.jstree', function (e, data) {
	        	var d = data.instance.get_node(data.selected[0]);
	        	if(d){
	        		var ids = [];
	        		var type = d.original.type;
		        	if(type==2){
		        		$("#roleid").val(d.original.id);
		        	}else{
		        		$("#roleid").val("");
		        	}
	        	}
	        }); 
    	 
         this.datatable = $('#table').DataTable({
             "serverSide": true,
             responsive: true,
             searchDelay: 500,
             "language": Lang.datatable,
             "ajax": {
                 "url": ctx + "/admin/resource/quickSearch",
                 "type": "GET",
                 "data": function (params) {
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
                 "data": "resourcename",
                 "title": "权限名",
                 "className": " text-center dt-nowrap"
             },{
                 "data": "resourcevalue",
                 "title": "权限目录",
                 "className": " text-center dt-nowrap"
             },{
                 "data": "createdDate",
                 "title": "创建时间",
                 "className": " text-center dt-nowrap"
             },{
                 "data": "createdBy",
                 "title": "创建人",
                 "className": " text-center dt-nowrap"
             },{
                 "data": "description",
                 "title": "权限描述",
                 "className": " text-center dt-nowrap"
             },
             ]
         });
         
			function isEmpty(value){
			    if(value == null || value == "" || value == "undefined" || value == undefined || value == "null"){
			        return true;
			    }
			    else{
			        if(value == ""){
			            return true;
			        }
			        return false;
			    }
			}
			
			function addResource(roleid){
				RoleList.setResource(roleid);
			}
			
			function delResource(roleid){
				RoleList.delResource(roleid);
			}
			
    };

    var initData = function () {

    }


    return {
        init: function () {
            initPage.apply(this);
            initData.apply(this);
        },
        setResource:function(roleid) {
			var $modal = $('#ajax-modal-roleresourceadd');
			$modal.on("hidden.bs.modal", function(e) {
				$(this).removeData();
			});
			$modal.load(ctx + "/admin/role/addresource?roleid="+roleid, '', function() {
				$modal.modal();
			});
        },
        delResource:function(roleid) {
			var $modal = $('#ajax-modal-roleresourcedel');
			$modal.on("hidden.bs.modal", function(e) {
				$(this).removeData();
			});
			$modal.load(ctx + "/admin/role/delresource?roleid="+roleid, '', function() {
				$modal.modal();
			});
        },
    };

}();

// Class initialization on page load
jQuery(document).ready(function () {
    RoleList.init();
});