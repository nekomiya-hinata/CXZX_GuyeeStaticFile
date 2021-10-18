"use strict";
var Index=function(){
	
	var initKpi=function(){
		//blockLoading($(document.body));
		$.ajax({  
    		type: 'get',  
    		dataType: 'json',  
    		url :  ctx+'/sap/dashboard/kpi', 
    		success : function(result){ 
    			$('#cssl').html('<span class="counter"  data-value="'+result.cssl+'">0</span>');
    			$('#sbsl').html('<span class="counter"  data-value="'+result.sbsl+'">0</span>');
    			$('#dataIncreases').html('<span class="counter"  data-value="'+result.dataIncreases+'">0</span>');
        		$('.counter').counterUp({
	        	    delay: 10,
	        	    time: 1000
	        	});
        		//unblockUI($(document.body));
    		}  
    	});
		
	};
	
	return{
		initPage : function(){
			initKpi();
		}
	}
	
}();

jQuery(document).ready(function () {
	Index.initPage();
});